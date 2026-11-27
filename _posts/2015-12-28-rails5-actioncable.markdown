---
layout: post
title: "Real-Time WebSockets with Action Cable in Rails 5"
author: Brice Vallieres
topic: "Engineering"
summary: "A concise written walkthrough of DHH's Rails 5 Action Cable chat demo, including the Redis and origin tweaks needed inside a local Vagrant VM."
image: "/images/covers/rails-actioncable.jpg"
date: 2015-12-28 13:57:19
last_modified_at: 2026-11-27
categories: [web, development]
tags: [rails 5, websockets, actioncable, ruby]
---

After watching David Heinemeier Hansson's [Rails 5 Action Cable walkthrough](https://www.youtube.com/watch?v=n0WUjGkDFS0), I wanted a concise written reference—both to cement how the pieces fit together and to document the extra configuration required inside my Ubuntu 14.04 Vagrant VM (running Ruby 2.2.2+).

## 1. Initialize a Rails 5 App

Clone the Rails edge repository and generate a fresh project from it:

{% highlight bash %}
mkdir rails5 && cd rails5
git clone https://github.com/rails/rails.git .

cd ..
mkdir campfire && cd campfire
../rails5/railties/exe/rails new . --skip-spring
rails -v  # => Rails 5.0.0.beta1
{% endhighlight %}

Add the Redis adapter gems to your `Gemfile` and run `bundle install` (if Bundler resolves an older `redis-rails` version, install `4.0.0` manually first):

{% highlight ruby %}
gem 'redis'
gem 'redis-namespace'
gem 'redis-rails'
gem 'redis-rack-cache'
{% endhighlight %}

## 2. Routes, Controller, and Message Model

Generate a `rooms` controller and mount Action Cable in `config/routes.rb`:

{% highlight bash %}
rails g controller rooms show
{% endhighlight %}

{% highlight ruby %}
# config/routes.rb
Rails.application.routes.draw do
  root to: 'rooms#show'
  mount ActionCable.server => '/cable'
end
{% endhighlight %}

Load all messages in `RoomsController#show`, generate the `Message` model, and seed one test record in the console:

{% highlight ruby %}
# app/controllers/rooms_controller.rb
class RoomsController < ApplicationController
  def show
    @messages = Message.all
  end
end
{% endhighlight %}

{% highlight bash %}
rails g model message content:text
rails db:migrate
rails runner "Message.create! content: 'Hello World!'"
{% endhighlight %}

## 3. Views and Message Partial

Render the messages and wire an input field with a `data-behavior` hook in `app/views/rooms/show.html.erb`:

{% highlight erb %}
<h1>Chat Room</h1>
<div id="messages">
  <%= render @messages %>
</div>

<form>
  <label>Say Something:</label><br>
  <input type="text" data-behavior="room_speaker">
</form>
{% endhighlight %}

Create `app/views/messages/_message.html.erb`:

{% highlight erb %}
<div class="message">
  <p><%= message.content %></p>
</div>
{% endhighlight %}

## 4. Channels and Client Subscription

Generate the `room` channel with a `speak` action:

{% highlight bash %}
rails g channel room speak
{% endhighlight %}

Stream from `room_channel` and persist incoming messages in `app/channels/room_channel.rb`:

{% highlight ruby %}
class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_channel"
  end

  def speak(data)
    Message.create! content: data['message']
  end
end
{% endhighlight %}

Hook up the client subscription and Enter-key handler in `app/assets/javascripts/channels/room.coffee`:

{% highlight coffeescript %}
App.room = App.cable.subscriptions.create "RoomChannel",
  received: (data) ->
    $('#messages').append data['message']

  speak: (message) ->
    @perform 'speak', message: message

$(document).on 'keypress', '[data-behavior~=room_speaker]', (event) ->
  if event.keyCode is 13
    App.room.speak event.target.value
    event.target.value = ''
    event.preventDefault()
{% endhighlight %}

Enable the Action Cable consumer in `app/assets/javascripts/cable.coffee`:

{% highlight coffeescript %}
#= require action_cable
#= require_self
#= require_tree ./channels

@App ||= {}
App.cable = ActionCable.createConsumer()
{% endhighlight %}

*VM gotcha:* If you access your Vagrant box through a custom host alias instead of `localhost`, explicitly allow that origin so Action Cable doesn't reject the WebSocket handshake, and bind Rails to `0.0.0.0`:

{% highlight ruby %}
# config/environments/development.rb (or application_controller.rb)
ActionCable.server.config.allowed_request_origins = ['http://ruby.app:3000']
{% endhighlight %}

## 5. Broadcast via Active Job

Trigger a background broadcast job whenever a `Message` commits to the database:

{% highlight ruby %}
# app/models/message.rb
class Message < ApplicationRecord
  after_create_commit { MessageBroadcastJob.perform_later self }
end
{% endhighlight %}

Generate the job (`rails g job MessageBroadcast`) and render the message partial server-side before broadcasting:

{% highlight ruby %}
# app/jobs/message_broadcast_job.rb
class MessageBroadcastJob < ApplicationJob
  queue_as :default

  def perform(message)
    ActionCable.server.broadcast 'room_channel', message: render_message(message)
  end

  private

  def render_message(message)
    ApplicationController.renderer.render(
      partial: 'messages/message',
      locals: { message: message }
    )
  end
end
{% endhighlight %}

## How the Flow Connects

A user types into the input and presses Enter → `App.room.speak` sends the payload over WebSockets → `RoomChannel#speak` saves the `Message` record → `after_create_commit` enqueues `MessageBroadcastJob` → the job renders the HTML partial and broadcasts it to every connected client subscribed to `room_channel`.

Open two browser tabs, start `rails s -b 0.0.0.0`, and messages stream across both windows in real time. Full credit to DHH for the original demo—Action Cable makes WebSockets in Rails refreshingly approachable.
