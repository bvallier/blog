---
layout: post
title:  "Action Cable in Rails 5"
author: Brice V.
summary: Rails 5 real-time fun
image: '/images/rails5.jpg'
date:   2015-12-28 13:57:19
categories: [web, development]
tags: [rails 5, web sockets, actioncable, DHH]
---

Recently I was watching a David Heinemeier Hansson (DHH) (founder of rails, basecamp) tutorial on implementing a chat app using the new and improved rails 5 beta release which makes working with web sockets and real-time apps a breeze - seriously, it's fantastic. I was really impressed with how easy it was and so I wanted to take that DHH tutorial ([here][dhh-tutorial]) and provide a written tutoral with the steps DHH outlined for implementing it, but I also wanted to include some additional steps I needed to take to get it to work in my environment. I hope this is helpful for anyone out there looking to implement real-time functionalties using the rails 5 framework. All the credit goes to DHH. His video provides much more detail and explanation, so I would not consider this an alternative, simply a place where it's all laid out on paper. I mostly needed a reference for myself and wanted to solidify the concepts in my head.

Note: I am running vagrant via virtual box on an ubuntu 14.04 box. This tutorial assumes that you are running ruby > 2.2.2.

First let's start by cloning the rails 5 github source code into a directory. This will initialize an empty rails5 directory, where we will download the rails 5 source code.

{% highlight ruby %}
sudo mkdir rails5
cd rails5
git clone https://github.com/rails/rails.git .
{% endhighlight %}

If you are already using a rails environment, you are probably running a rails version < 5, so this will allow you to spawn a new rails project using the freshly minted rails 5 source. Once this downloads, you should create a new project directory. First navigate back a level in your directory, running the following:

{% highlight ruby %}
cd ..
sudo mkdir campfire
sudo chmod 777 campfire
cd campfire
../rails5/railties/exe/rails new . --skip-spring
rails -v
{% endhighlight %}

This code block will initialize the application using the rails 5 source and then we will verify we are runnning rails 5. If it works, you should see "Rails 5.0.0.beta1".

Before we can get started building the application, there were a couple of gems I needed to add to get the application working (redis-rails via bundle install, for whatever reason, was giving me the 0.0.0.0 version, so before I ran the bundle install below, I did a manual install by running: gem install redis-rails, which gave me 4.0.0):

{% highlight ruby %}
#Add to Gemfile
gem 'redis'
gem 'redis-namespace'
gem 'redis-rails'
gem 'redis-rack-cache'
{% endhighlight %}

Run bundle install to download the redis (more information about redis [here][redis]) gems:

{% highlight ruby %}
bundle install
{% endhighlight %}

Let's start building the application. First we will use a command line generator to develop a controller called rooms with a method called show:

{% highlight ruby %}
rails g controller rooms show
{% endhighlight %}

This will generate a scaffold with several files for you. Modify the config/routes.rb to point the root to the show method you just created. You will also want to enable the Action Cable route, which will be needed later on.

{% highlight ruby %}
#Modify config/routes.rb
Rails.application.routes.draw do
  root to: 'rooms#show'
  mount ActionCable.server => '/cable'
end
{% endhighlight %}

Once you do this, you should be able to start your rails server and visit the page:

{% highlight ruby %}
rails s -b 0.0.0.0
{% endhighlight %}

I bind to 0.0.0.0 since my environment sits in a virtual box with a private network IP assigned to the box. By binding my rails server to 0.0.0.0, I am able to see the app when I visit it in my browser. If you are not runnning this environment, you can probably leave off the -b flag.

Now, modify the rooms controller to the following:

{% highlight ruby %}
#app/controllers/rooms_controller.rb
class RoomsController < ApplicationController
  def show
    @messages = Message.all
  end
end
{% endhighlight %}

Once we have the controller setup to grab all the messages in our model, we want to setup the model by running this in the command prompt (visiting the rails site at this point would cause an error, since we have not yet initialized the data model we are calling in the controller):

{% highlight ruby %}
rails g model message content:text
rails db:migrate
{% endhighlight %}

This creates a model called Message with a text field called content. This will be used to store our messages in the chat room. Then we run a migration to get the table created. Let's initialize a value in our model, manually for the time being:

{% highlight ruby %}
Message.create! content: 'Hello World!'
{% endhighlight %}

In order to see this message we need to pass the model attribute to the view. We will need to update the following files:

{% highlight ruby %}
#modify app/views/rooms/show.html.erb
<h1>Chat Room</h1>
<div id="messages">
    <%= render @messages %>
</div>

<form>
    <label>Say Something:</label><br>
    <input type="text" data-behavior="room_speaker">
</form>
{% endhighlight %}

This view will display all messages in the Message model and the input text box will be linked to some client-side javascript attribute ("data-behavior") that will pass our text messages into the messages channel. More on that soon.

{% highlight ruby %}
rails g channel room speak
{% endhighlight %}

This will create a channel called room which will contain a method called speak. Modify the following file to match this:

{% highlight ruby %}
#app/channels/room_channel.rb
class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    Message.create! content: data['message']
  end
end
{% endhighlight %}

This file indicates that you would like to stream messages from the room_channel and that any data passed to speak (e.g. your message content) will be saved to the database.


Let's create a 'messages' folder in app/views and within this folder create a partial called '_message.html.erb. Modify a message partial which we will use to display the messages, later on:

{% highlight ruby %}
#app/views/messages/_message.html.erb
<div class="message">
    <p><%= message.content %></p>
</div>
{% endhighlight %}

This will display the content of your messages. Running the rails server, should show the hello world message you created earlier. In order to finish this tutorial up, we need to tell the room controller how to interact with the client side input. This can be done by modifying the room js coffee file:

{% highlight ruby %}
#app/assets/javascripts/channels/room.coffee
App.room = App.cable.subscriptions.create "RoomChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

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

This js file does a couple of things, but primarily accepts input from the user in our view, binds the data-behavior attribute in the view to an enter/return keypress event and then calls the App.room.speak('your message here') method, which we define just before it. Perform is then called and message is passed to it in a jobs file we have yet to create. This jobs file will do the magic rendering as the input is recorded by our users.

Before we continue, we will need to enable Action Cable in the following file:

{% highlight ruby %}
#app/assets/javascripts/cable.coffee
#= require action_cable
#= require_self
#= require_tree ./channels
#
@App ||= {}
App.cable = ActionCable.createConsumer()
{% endhighlight %}

This chunk of code initializes a consumer. More information on the terminology is located [here][actioncable]. I suggest reading through this. I was having trouble with this because I was making invalid requests to the site since I was operating within virtualbox. In order to allow this I had to add the following to the app/controllers/application_controller.rb:

{% highlight ruby %}
#app/controllers/application_controller.rb
ActionCable.server.config.allowed_request_origins = ['http://ruby.app:3000']
{% endhighlight %}

I setup a windows host file that creates an alias for the network IP assigned by virtual box. That way I can visit ruby.app instead of localhost or 127.0.0.1 or 193.122.12.1 in my browser. Because rails 5 is setup to point to localhost in development for Action Cable, I had to explicity allow request origins from a different name, hence the code above.

Alright, let's get back on track. Next we need to update the model to ensure that the message can be rendered through a template. Remember - we already have a means to save the record; now we just need to transmit or broadcast the message to a viewer without refreshing the page. This will require that we display a transmitted message continuously as new messages are submitted through the channel. This isn't really something you would execute in a model, so we will create a MessageBroadcast Job and call it in the model after the message is committed, as follows: 

{% highlight ruby %}
#app/models/message.rb
class Message < ApplicationRecord
    after_create_commit { MessageBroadcastJob.perform_later self }
end
{% endhighlight %}

We of course, need to generate the message broadcast job we refer to in this model using a generator:

{% highlight ruby %}
rails g job MessageBroadcast
{% endhighlight %}

This generates a file in the jobs folder, which should be modified as follows:

{% highlight ruby %}
#app/jobs/message_broadcast_job.rb
class MessageBroadcastJob < ApplicationJob
  queue_as :default

  def perform(message)
    ActionCable.server.broadcast 'room_channel', message: render_message(message)
  end

  private
    def render_message(message)
        ApplicationController.renderer.render(partial: 'messages/message', locals: {message: message})
    end
end
{% endhighlight %}

This perform method is called in the room channel we created earlier and has one parameter, a message. This message is then rendered through render_message using a partial (which we created earlier). It's rails magic!

The flow, as I understand it, is as follows: The user enters input into the text field (client side) via App.room.speak which is sent through the Channel. This message then gets commited to the database through the model via the create methods within the channel, and then after the message is created, the broadcast job above is called which renders a "revolving door" partial template containing our message(s)! Now anyone who subscribes to the channel (e.g. at this point, it's anyone who visits this root page, should be able to see the chat conversation). At this point if you run the rails server and you also open another window (incognito if you have chrome), you can start typing back and forth (e.g. across multiple connections) in real-time! That's it.

If you have any thoughts, please leave them below. Always looking to improve the delivery of my content and I'd like to hear if I was helpful. Again all the credit goes to DHH. Rails 5 is stellar.
<br />
<br />

[dhh-tutorial]: https://www.youtube.com/watch?v=n0WUjGkDFS0
[actioncable]: https://github.com/rails/rails/tree/master/actioncable
[redis]: https://github.com/redis-store/redis-rails


{% include disqus.html %} 