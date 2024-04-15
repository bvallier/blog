---
layout: post
title: "Hosting a private LLM in the cloud"
author: Brice V.
summary: Hosting a private LLM in the cloud is easier and more expensive than you think
image: "/images/staffmapper_llm.gif"
date: 2024-04-15 13:57:19
categories: [product, ideation]
tags: [staff mapper, ideation, llm, ollama, openrouter]
---

Last week I wrote a post on X about hosting a private LLM for a client, and it unexpectedly blew up. If I had to guess, there's a ton of demand for being able to securely interact with LLMs. I also think there's a lot of curiousity around how these private LLMs, using open source models, can be integrated into current applications or workflows. The primary technology I leveraged was [Ollama](https://ollama.com/) and it's a wonderful app for running local LLMs, like Llama and Mixtral. It works really well. There are of course concerns, about running in production and the ability for it to run concurrent requests - I don't think it's there yet, but eventually, someone will get there.

For those who are curious, here is the post on X:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">A client asked me yesterday if we could run a privately hosted LLM to avoid data privacy issues. Today I implemented <a href="https://twitter.com/ollama?ref_src=twsrc%5Etfw">@ollama</a> on an AWS g5 EC2 instance and it&#39;s currently hooked up to Staff Mapper. Couple of thoughts on connecting this service to your web app... <a href="https://t.co/QFtkNGWGMT">pic.twitter.com/QFtkNGWGMT</a></p>&mdash; Brice Vallieres (@bricevallieres) <a href="https://twitter.com/bricevallieres/status/1778883793648009224?ref_src=twsrc%5Etfw">April 12, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Now, before we get through the "How-To", here's the general setup (assumes you have an active AWS account):

At the time of writing, I'm running a g5.2xlarge Deep Learning OSS Nvidia Driver AMI GPU PyTorch 2.2.0 (Amazon Linux 2) 20240410 machine on AWS. It has 8vCPU and 32GB of memory. This is probably more than you need at ~$870/month. You can also try a g4dn.xlarge model with 4vCPU and 16GB of memory for half the price, I think you'd be able to run the smaller models on this without an issue. I'm using 100GB of storage for this proof-of-concept. Make sure to store your .pem key when you set this up so we can SSH into it later. I typically just have one SSH key I use for all my instances.

Once you launch the instance in AWS, we're gonna have to do some setup. Luckily, the instances are pre-configured with GPU acceleration, so the inference will be faster than running traditional CPU instances (benchmarking to be created in another post).

As soon as the server is spun up, I change the permission on my key via:

{% highlight ruby %}
chmod 400 ssh_key.pem
{% endhighlight %}

I then SSH into my instance:

{% highlight ruby %}
ssh -i ssh_key.pem ec2-user@ec2-XX-XXX-XX-XX.compute-1.amazonaws.com
{% endhighlight %}

Then I install docker services:

{% highlight ruby %}
sudo yum update -y
sudo yum install docker
sudo usermod -a -G docker ec2-user
sudo systemctl enable docker.service
sudo systemctl start docker.service
sudo systemctl status docker.service
{% endhighlight %}

Then I install Ollama:

{% highlight ruby %}
curl -fsSL https://ollama.com/install.sh | sh
{% endhighlight %}

Check Ollama status:

{% highlight ruby %}
sudo systemctl status ollama
{% endhighlight %}

Ollama makes it dead easy to download a model. I'm running mistral because it's a smaller 7B model and it's pretty fast. I've also listed others you can download and run. As a word-of-caution, I beleive Ollama can context switch between models when the request is made, but it takes time perform the switch and load the model:

{% highlight ruby %}
ollama run mistral
ollama run llama2
ollama run mixtral
{% endhighlight %}

Finally, we need a way to expose the Ollama service via Nginx:

{% highlight ruby %}
sudo amazon-linux-extras install nginx1=latest
{% endhighlight %}

It's possible, nginx has a different version, so you may need to search for it if the command above fails. Find the version you have on your system and re-run above:

{% highlight ruby %}
sudo amazon-linux-extras
{% endhighlight %}

Now, we need to configure Nginx. This is the setup that worked for me. The default port that Ollama runs on is 11434. We are esentially proxying that so we can run on port 80 and expose the service to the public / web - this should make the API endpoints for Ollama available. Eventually I will configure this to only serve via HTTPS / SSL via port 443. Will update this post, when I do (need to generate a certificate on Cloudflare, and configure the Nginx here):

{% highlight ruby %}
sudo nano /etc/nginx/conf.d/myapp.conf
{% endhighlight %}

Paste below and switch out the public server name. If you haven't used Nano before, it's just a text editor on your terminal. I just ctrl+v, ctrl+x and save.
{% highlight ruby %}
server {
listen 80;
server_name ec2-XX-XXX-XX-XX.compute-1.amazonaws.com;

    location / {
        proxy_pass http://127.0.0.1:11434;
        proxy_set_header Host $host;
    }

}
{% endhighlight %}

Restart the Nginx server:

{% highlight ruby %}
sudo systemctl restart nginx
{% endhighlight %}

Now start the Ollama service:

{% highlight ruby %}
docker run -d -p 3000:8080 -e OLLAMA_API_BASE_URL=http://ec2-XX-XXX-XX-XX.compute-1.amazonaws.com/api -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
{% endhighlight %}

I'm not using the webui for Ollama just the API endpoint, so haven't configured that yet.

One last thing you may want to do is enable an Nginx restart on server reboot. I don't want to run the server full-time right now because it's just a POC until I get Staff Mapper v2 up and running in prod. Also need to think through pricing for end client to accomodate switches from open source LLMs hosted privately, vs commerical LLMs. To run your Nginx restart on system reboots:

{% highlight ruby %}
systemctl edit nginx
{% endhighlight %}

And then copy paste:
{% highlight ruby %}
[Service]
Restart=always
{% endhighlight %}

One other point to make, is that I've restricted access to this LLM - it's only available to my IP address at the moment. Eventually, I'll get the cert up and I have it pointed to my actual app IP and voila - my SaaS app will be connected to a secure privately-hosted LLM. Once Ollama evolves and grows, this setup will be amazing. There were several suggestions in the comments to check out vLLM, which I'll review as well. Just love the simplicity of Ollama.

Again, not saying this is production ready but certainly presents a ton of oppurtunities to roll-your-own LLM.

For those of you interested in how I created the UX interface for allowing customers to choose between open vs closed LLMs, comment below and follow and I'll show you how I handled! Benchmarks incoming too.
