---
layout: post
title: "Democratizing Clinical Trials Data via TrialTap"
author: Brice V.
summary: Because clinical trials data should be standardized, analyzed, and transparent.
image: '/images/ctgov_books.jpeg'
date:   2018-01-09 13:57:19
categories: [development, productivity]
tags: [clinical trials, software, productivity, ctgov, trials, studies, patients]
---
{% comment %}
	image tag above needs to be 200x200
{% endcomment %}

**NOTE - We've taken the online solution down, but are still running the database backend. If you'd like to inquire about this product more, please reach out.**

Let me start by saying that clinical trials deserves transparency. Why? Because patients lives are at stake. Okay, well maybe not directly or immediately, but it's a huge part of advancing our research efforts (e.g. [Project Data Sphere](https://www.projectdatasphere.org/projectdatasphere/html/home)). Aggregating trial data hasn't been the pancea we thought it was at first glance, but the consensus is universal: the more data in the public the better for human kind. And maybe it just needs to be easier to analyze.



Today, I want to announce the release of an extremely valuable resource we've developed over at the small web co. allowing you to download **standardized clinical trials data** from [https://clinicaltrials.gov](https://clinicaltrials.gov). Sure, you can download _some_ of this data from ct.gov directly, but it only contains a fraction of the total data available - don't you want more data?? In other words, we capture ALL meta fields from their XML schema which includes data points like arms, interventions, facilities, conditions, publications, keywords, etc.  We currently have over 260K+ trials on our platform and it grows everyday in lock-step with clinicaltrials.gov through some crawlers we've built.

[Here's an extract of the type of data you can tap](https://drive.google.com/file/d/16gmN4aWdLIXNzmAmUw5_8YcizQHlTYqT/view?usp=sharing)

This is an important project to me for several reasons, but like many in the industry, I felt that advancing this data set and providing it free of charge would help to mobilize a stronger community around it. A type of community where we can advance good ideas and design something everyone will use to support the mission of better data, while holding sponsors accountable for releasing correct data. My hope is that people will use the data to analyze trial data with their specific expertise or just play around with to understand what's possible. In the past, I have it used for many reasons, including but not limited to the following:
- Tracking clinical trial recruitment locations
- Reaching out to PIs for information on a study
- Monitoring compliance with FDAAA and NIH rules
- Proof-of-concept patient recruitment matching algorithms based on eligibility criteria
- Identification of latent assets (genetic marker targets) of interest based on good p-values (only present in the results data, which we don't have...yet)
- Looking at general trends in study activity across various conditions, etc. 

As you can see, there are many good reasons to be using this data, some of which aren't clearly contemplated here. 

**So why did I make it free?**

Well initially, I thought I would charge pharma and med device companies and keep it free for non-profits and foundations, but after seeing usage of the data, I realized companies were using the data to check accuracy of their disclosure to ct.gov - a compliance issue. Sure, some were using it for competitive intelligence, but it's not like they disclosed trade secrets on ct.gov. In the end, I wanted to make sure they didn't need to purchase data to do something I found fundamentally critical to patient safety: ensuring correct clinical trial data in the wild.

_So it's free_ to everyone for as long as I can keep the solution running. 

**If you're interested in grabbing the data, go for it. I look forward to all the potential use cases for data analysts who don't care to scrape hundreds of thousands of XML files to run a quick test and do an analysis. All I ask is a little love, meaning: attribution back to trialtap, this blog, a share or a follow.**

My ultimate goal, as stated earlier, is to build a community around this, so we can tackle bigger issues like standardizing global trial registry data, automated CSR development and/or disclosure to ct.gov, whatever, really. If you're interested in tackling solutions as a community on these issues, use TrialTap. 

<center>🎉 LONG LIVE TRANSPARENCY 🎉</center>
