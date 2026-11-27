---
layout: post
title: "Hosting a Private LLM on AWS with Ollama"
author: Brice Vallieres
topic: "AI & Data"
summary: "Standing up a privately hosted open-source LLM on an AWS GPU instance is easier—and more expensive—than most teams expect."
image: "/images/covers/private-llm.jpg"
date: 2024-04-15 13:57:19
last_modified_at: 2026-11-27
categories: [product, ideation]
tags: [llm, ollama, aws, ec2, privacy]
---

A client recently asked whether we could run a privately hosted LLM inside our own infrastructure so sensitive data never left our control. I wired [Ollama](https://ollama.com/) onto an AWS GPU instance, connected it to our web app, and shared a quick note on X—which unexpectedly struck a nerve. Clearly, plenty of teams want practical patterns for private inference without building a full ML platform from scratch.

Ollama makes running open-weight models like Mistral, Llama, and Mixtral remarkably straightforward. It is not yet a turnkey multi-tenant production serving engine (tools like vLLM handle high concurrency much better), but for a dedicated single-client proof of concept, its simplicity is hard to beat.

## Choosing an AWS Instance

For this proof of concept, I launched a **`g5.2xlarge`** running the *Deep Learning OSS Nvidia Driver AMI (Amazon Linux 2)* with 8 vCPUs, 32 GB RAM, an NVIDIA A10G GPU, and 100 GB of storage.

At roughly **$870/month** on-demand, that is overkill for small 7B models. A `g4dn.xlarge` (4 vCPUs, 16 GB RAM) costs roughly half as much and handles 7B models cleanly. Because the AMI comes pre-configured with NVIDIA drivers, GPU acceleration works immediately—dramatically faster than CPU inference.

## Installing Docker and Ollama

Lock down your SSH key permissions and connect to the instance:

{% highlight bash %}
chmod 400 ssh_key.pem
ssh -i ssh_key.pem ec2-user@ec2-XX-XXX-XX-XX.compute-1.amazonaws.com
{% endhighlight %}

Install Docker (optional if you don't need Open WebUI) and Ollama:

{% highlight bash %}
sudo yum update -y
sudo yum install -y docker
sudo usermod -a -G docker ec2-user
sudo systemctl enable --now docker.service

curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl status ollama
{% endhighlight %}

Pull the models you want to test. Keep in mind that switching between models on the fly incurs a cold-load delay while Ollama swaps weights in VRAM:

{% highlight bash %}
ollama run mistral
ollama run llama2
ollama run mixtral
{% endhighlight %}

## Exposing the API via Nginx

By default, Ollama listens locally on port `11434`. To expose it to your application (initially locked down to your own IP via AWS Security Groups, and later fronted with TLS on port 443), install Nginx and configure a reverse proxy:

{% highlight bash %}
sudo amazon-linux-extras install nginx1=latest
sudo nano /etc/nginx/conf.d/ollama.conf
{% endhighlight %}

Add the proxy block, replacing the server name with your instance hostname or domain:

{% highlight nginx %}
server {
    listen 80;
    server_name ec2-XX-XXX-XX-XX.compute-1.amazonaws.com;

    location / {
        proxy_pass http://127.0.0.1:11434;
        proxy_set_header Host $host;
    }
}
{% endhighlight %}

Restart Nginx and configure systemd so it recovers automatically on reboot:

{% highlight bash %}
sudo systemctl restart nginx
sudo systemctl edit nginx
{% endhighlight %}

{% highlight ini %}
[Service]
Restart=always
{% endhighlight %}

If you also want a browser chat interface during testing, you can point Open WebUI at the same endpoint:

{% highlight bash %}
docker run -d -p 3000:8080 \
  -e OLLAMA_API_BASE_URL=http://ec2-XX-XXX-XX-XX.compute-1.amazonaws.com/api \
  -v open-webui:/app/backend/data \
  --name open-webui --restart always \
  ghcr.io/open-webui/open-webui:main
{% endhighlight %}

## Practical Takeaways

Standing up the stack took less than an afternoon. The real work is operational and economic:

- **Lock down network access early:** Restrict port 80/443 strictly to your application server's IP or VPC peering, and terminate HTTPS with a proper certificate before sending real data.
- **Watch idle GPU costs:** Dedicated GPUs are expensive when sitting idle between intermittent client queries. For SaaS products, you need clear pricing tiers that reflect the real cost difference between privately hosted open models and pay-per-token commercial APIs.
- **Know when to graduate:** Ollama is unbeatable for fast prototypes and low-concurrency workloads; once concurrent traffic grows, look at dedicated inference servers like vLLM.
