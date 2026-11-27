---
layout: post
title: "Building a Serverless Contact Form with AWS Lambda and SES"
author: Brice Vallieres
topic: "Engineering"
summary: "Adding an inexpensive, server-free contact form to a static Jekyll site using AWS Lambda, DynamoDB, SES, and ConvertKit."
image: "/images/covers/serverless-form.jpg"
date: 2019-05-09 13:57:19
last_modified_at: 2026-11-27
categories: [web, development]
tags: [serverless, aws, lambda, python, jekyll]
---

My consulting site runs on Jekyll and GitHub Pages—completely static HTML. Rather than leaving visitors with bare `mailto:` links, I wanted a real contact form with two constraints: no paid third-party form SaaS, and automatic syncing into ConvertKit.

Using the [Serverless Framework](https://www.serverless.com/) with AWS Lambda, DynamoDB, and Simple Email Service (SES), the whole setup took a single morning. I adapted an existing open-source template so submissions email *me* directly (the original sent emails back to the submitter) and append the contact to my mailing list.

## 1. Clone and Install Dependencies

{% highlight bash %}
git clone https://github.com/bvallier/python-ses-dynamodb-contactform.git
cd python-ses-dynamodb-contactform
npm install -g serverless
npm install
npm install --save serverless-python-requirements
{% endhighlight %}

## 2. Configure AWS Credentials

Create an IAM user with programmatic access in the AWS Console (scoping permissions down to CloudFormation, Lambda, API Gateway, DynamoDB, and SES once tested), then register your profile locally:

{% highlight bash %}
sls config credentials \
  --provider aws \
  --key <your_key> \
  --secret <your_secret> \
  --profile <your_iam_profile>
{% endhighlight %}

In the AWS SES console (*Identity Management → Email Addresses*), verify the `SENDER_EMAIL` address you plan to send from.

## 3. Add Configuration and Python Requirements

Create two files at the project root. First, `secrets.json` (excluded from Git):

{% highlight json %}
{
  "REGION": "us-east-1",
  "PROFILE": "your_iam_profile",
  "SENDER_EMAIL": "verified_ses_email@example.com",
  "CONVERTKIT_KEY": "your_convertkit_api_key",
  "CONVERTKIT_FORM": "123123",
  "EMAIL_SUBJECT": "CONTACT REQUEST"
}
{% endhighlight %}

Second, `requirements.txt` so Serverless bundles `requests` for the ConvertKit POST call:

{% highlight text %}
requests==2.21.0
{% endhighlight %}

## 4. Deploy to AWS

{% highlight bash %}
sls deploy -v
{% endhighlight %}

Deployment provisions two Lambda functions behind API Gateway:

- **`SendMailLambdaFunction`** — writes the submission to DynamoDB, sends an email via SES, and adds the subscriber to ConvertKit.
- **`ListLambdaFunction`** — exposes a `GET` endpoint to retrieve stored inquiries.

## 5. Wire Up the Static Form

Drop a standard HTML form into your static page, point `URL` at the API Gateway endpoint returned by `sls deploy`, and include the [client script](https://raw.githubusercontent.com/bvallier/python-ses-dynamodb-contactform/master/public/js/script.js):

{% highlight html %}
<form id="serverless-form" action="#">
  <input type="text" id="firstname" name="firstname" placeholder="First Name" required>
  <input type="text" id="lastname" name="lastname" placeholder="Last Name" required>
  <input type="email" id="exampleInputEmail" name="email" placeholder="Email" required>
  <textarea id="message" name="message" placeholder="Your Message" required></textarea>
  <button type="submit" id="submit">Send Message</button>
</form>

<script>
  var URL = "https://<api-id>.execute-api.us-east-1.amazonaws.com/development/sendMail";
</script>
<script src="js/script.js"></script>
{% endhighlight %}

At low contact-form volumes, Lambda, DynamoDB, and SES sit comfortably inside AWS's free tier—giving a static site dynamic form handling with essentially zero ongoing maintenance.
