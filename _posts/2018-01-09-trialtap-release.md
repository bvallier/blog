---
layout: post
title: "Democratizing Clinical Trials Data with TrialTap"
author: Brice Vallieres
topic: "AI & Data"
summary: "Why clinical trial registries deserve cleaner, standardized public access—and why we opened up 260,000+ structured ClinicalTrials.gov records for free."
image: "/images/covers/trialtap-clinical.jpg"
date: 2018-01-09 13:57:19
last_modified_at: 2026-11-27
categories: [development, productivity]
tags: [clinical trials, healthcare, open data, ctgov, data engineering]
---

<div class="editorial-note">
  <p><strong>Update:</strong> The hosted TrialTap web interface has since been retired, though we still maintain the underlying structured database. Feel free to reach out if you are working with clinical trial registry data.</p>
</div>

Clinical trials deserve radical transparency. Open data is not a panacea on its own, as initiatives like [Project Data Sphere](https://www.projectdatasphere.org/) have shown, but the core premise is hard to argue with: the easier it is to inspect and analyze trial records, the faster medical research moves—and the better sponsors are held accountable.

## Beyond Partial Exports

While anyone can download summary files directly from [ClinicalTrials.gov](https://clinicaltrials.gov), the standard exports leave out large portions of the underlying record.

At The Small Web Co., we built automated crawlers to parse the full XML schema—capturing arms, interventions, facilities, conditions, publications, keywords, and eligibility metadata across **260,000+ registered trials**, refreshed daily in lockstep with the public registry.

A [sample extract](https://drive.google.com/file/d/16gmN4aWdLIXNzmAmUw5_8YcizQHlTYqT/view?usp=sharing) illustrates the relational structure we generated for analysts who would rather query clean tables than wrangle hundreds of thousands of raw XML files.

## What Clean Registry Data Unlocks

Standardized trial data supports far more than academic curiosity. Across healthcare analytics work, I have used datasets like this for:

- Tracking active recruitment geographies and site density
- Identifying principal investigators across specific indications
- Monitoring compliance with FDAAA and NIH reporting requirements
- Prototyping eligibility-criteria matching for patient recruitment
- Analyzing macro trends in study activity across therapeutic areas

## Why We Made It Free

Originally, I planned to charge pharmaceutical and medical device companies while keeping access free for nonprofits and foundations.

Once early users started pulling the data, a clear pattern emerged: sponsors were primarily using it to **audit the accuracy of their own disclosures** on ClinicalTrials.gov. Some used it for competitive landscaping, of course, but nothing on ClinicalTrials.gov is a trade secret.

Charging organizations to verify the accuracy of public patient-safety records felt backwards. Making the dataset freely accessible meant any researcher, analyst, or compliance team could run an analysis in minutes instead of writing XML parsers from scratch—a small step toward broader standardization across global trial registries.
