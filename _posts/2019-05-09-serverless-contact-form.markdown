---
layout: post
title:  "Building a Serverless Contact Form and Integrating with Convertkit"
author: Brice V.
summary: Because I needed a contact form on my static business site?
image: '/images/serverless.png'
date:   2019-05-09 13:57:19
categories: [web, development]
tags: [serverless, convertkit, python]
---

[Serverless](https://serverless.com/) - I'd argue that it's not really serverless, but to the end-user it might as well be. While Serverless is useful to me, it also offers powerful oppurtunities for my less tech-saavy clients. Serverless allows you to do things that typically require a server. Basically, AWS and Cloud Formation handle setting up a runtime environment where you can deploy models and then sync it to an [AWS Lambda](https://aws.amazon.com/lambda/) function (e.g. input/output). Serverless, AFAIK, is tightly coupled to AWS services, and allows you to do all sorts of funky things. Today, I'll show you how to build a contact form on your static site. Here is a [SNEAK PREVIEW](https://thesmallweb.co/contact.html) of the form. Feel free to reach out!

My [business site](https://thesmallweb.co) is powered by Jekyll and runs on Github pages - it's a completely static site. I thought it was about time to develop a simple contact form, rather than have visitors click those pesky email links so looked into my options. I only had two requirements:
- I did NOT want to pay for a third party js library
- I wanted to integrate with [Convertkit](https://convertkit.com/?utm_source=dynamic&utm_medium=referral&utm_campaign=poweredby&utm_content=form)

For some weird reason, the [original repo](https://github.com/faizanbashir/python-ses-dynamodb-contactform) contact form was sending an email to the submitter, which doesn't make too much sense. I wanted it to be sent to me, so I could, you know, get back in touch. So the repo I created adjusts for that. 

The setup is suprisingly easy. It took me the morning, but I have a fully functioning contact form that triggers an email to my inbox when someone reaches out AND adds a subscriber to my Convertkit account. Pretty cool.

Here's how to get started:

{% highlight shell %}
git clone https://github.com/bvallier/python-ses-dynamodb-contactform.git
cd python-ses-dynamodb-contactform
npm install serverless -g
npm install
npm install --save serverless-python-requirements
{% endhighlight %}

Next, you should head to your AWS console and setup an Administrator with CLI access (search for the AdministratorAccess Policy). That policy should look like this:
{% highlight json %}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
{% endhighlight %}

Once setup, grab the credentials in the csv file and add to command line prompt below:
{% highlight shell %}
sls config credentials --provider aws --key <your_key> --secret <your_secret> --profile <your_iam_user_name>
{% endhighlight %}

Next, you'll want to add a secrets.json file where you can pass along some of your secret info. You'll also want to add a requirements.txt file. Both of these files will sit in the root of the project and look like the following:

secrets.json
{% highlight json %}
{
  "REGION": "us-east-1",
  "PROFILE": "your_im_profile_alias",
  "SENDER_EMAIL": "the_email_setup_in_simple_email_service",
  "CONVERTKIT_KEY": "your_convertkit_api_key",
  "CONVERTKIT_FORM": "123123",
  "EMAIL_SUBJECT": "CONTACT REQUEST"
}
{% endhighlight %}

That SENDER_EMAIL key should be setup in AWS under Simple Email Service (SES, Go to: Under Identity Management => Email Addresses). Add the email address and follow the steps to get it verified. It's like confirming your email for a subscription to a newsletter.  

Since I've added the requests library to our handler.py file to make a POST request to Convertkit we need to tell Serverless that it should be packaged and brought into our environment. You'll want to add that library to your requirements file below.

requirements.txt
{% highlight txt %}
requests==2.21.0
{% endhighlight %}

Finally, you can deploy:
{% highlight shell %}
sls deploy -v
{% endhighlight %}

Once it finishes, you can see two Lambda functions (ListLambdaFunction and SendMailLambdaFunction) on AWS. ListLambdaFunction is simply a GET request that retrieves all of you contacts and SendMailLambdaFunction is a function that allows you to add an entry to DynamoDB and triggers the SES service to send you an email when the contact form is submitted. I also sneak in a function that adds the contact to convertkit in the handler.py script. Easy enough huh?

Here's the form I'm using. Make sure the id and name of the inputs match the script.js file, linked to below.

{% highlight html %}
<form id="serverless-form" action="#">
    <div class="row">
        <div class="col-lg-4 offset-lg-2">
            <input type="text" class="form-control" autocomplete="given-name" id="firstname" name="firstname"
            placeholder=" Enter First Name" required>
        </div>
        <div class="col-lg-4">
            <input type="text" class="form-control" autocomplete="family-name" id="lastname" name="lastname"
            placeholder=" Enter Last Name" required>
        </div>
        </div>
        <br />
        <div class="row">
        <div class="col-lg-8 offset-lg-2">
            <input type="email" class="form-control" autocomplete="email" id="exampleInputEmail" name="email"
            placeholder=" Enter Email" required>
        </div>
        <div class="col-lg-8 offset-lg-2">
            <div class="form-group">
            <br />
            <textarea class="form-control" id="message" name="message" placeholder="Enter Your Message"
                required></textarea>
            </div>
            <div class="row">
            <div class="col-lg-4">
                <button type="submit" id="submit" class="btn btn-primary submit" style="cursor:pointer"><i id="loader" class="fa fa-paper-plane" aria-hidden="true"></i> Send Message</button>
            </div>
            <div class="col-lg-8">
                Kindly include any services you'd be interested in. We look forward to hearing from you.
            </div>
            </div>
        </div>
    </div>
</form>
<script>
    //Insert your lambda function URL here
    var URL = "https://12cas314qwed.execute-api.us-east-1.amazonaws.com/development/sendMail";
</script>
<script src="js/script.js"></script>
{% endhighlight %}

You'll need to link to the scripts.js file located [HERE](https://raw.githubusercontent.com/bvallier/python-ses-dynamodb-contactform/master/public/js/script.js).

That's it. Setup didn't take me long and I now have a nice, cheap, serverless contact form. Was fun getting to know serverless and hope to use it more in the future!

<script async id="_ck_321906" src="https://forms.convertkit.com/321906?v=6"></script>

<br />
<br />
{% include disqus.html %} 