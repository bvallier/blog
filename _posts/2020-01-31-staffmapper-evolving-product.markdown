---
layout: post
title: "Evolving Staff Mapper: Productized Services vs. Pure SaaS"
author: Brice Vallieres
topic: "Product"
summary: "A year after landing our first paying customer, Staff Mapper grew to ~$700/month—forcing an honest look at how custom client features and SaaS scale collide."
image: "/images/covers/staffmapper-evolving.jpg"
date: 2020-01-31 13:57:19
last_modified_at: 2026-11-27
categories: [product, ideation]
tags: [staff mapper, saas, productized services, consulting]
---

Fast-forward a year from our first invoice, and Staff Mapper looks very different. Our primary client is still actively using the platform, and their steady stream of real-world feature requests has turned a simple availability tracker into an operational backbone for their practice.

## What We Built in Year One

Working closely with one engaged consulting firm pushed the product well beyond scheduling:

- **Time-entry integration:** Synced their full roster with BigTime, growing recurring subscription revenue to roughly **$700/month**.
- **Performance management:** Built a biannual review workflow with automated notifications, dynamic manager assignment based on shared billable hours ("intensity ratios"), and a Kanban-style board so leadership can rebalance reviewer assignments.
- **Bonus and progression modules:** Added automated bonus calculations tied to utilization, level, and partner input, alongside career-progression and attrition analytics.
- **Compliance and HR controls:** Introduced time-entry compliance reports to tighten billing cycles and centralized HR administration.

For partners billing $500+ an hour, saving roughly a week per review cycle makes the ROI unmistakable. Equally valuable, the platform became a durable archive of past reviews—giving staff a clear record of their accomplishments over time.

## Making the Economics Work

The obvious question is how a solo founder can justify building all of that for $700/month.

The answer is a **customization clause**:

- **General-purpose improvements** that benefit any firm are folded into the core product at no extra charge.
- **Firm-specific logic**—such as bespoke bonus formulas or custom policy compliance rules—is billed hourly.

That arrangement shares development costs fairly while ensuring Staff Mapper stays deeply tailored to how the firm actually operates.

## The Scaling Tension

People management is never one-size-fits-all. Every consultancy has its own culture, review cadence, and reporting idioms, and software that ignores those nuances usually gets abandoned for spreadsheets.

At the same time, custom code is notoriously difficult to scale—outside of massive platform ecosystems like Salesforce, almost nobody pulls it off cleanly. An investor once warned me to avoid custom client work at all costs. Technically, he wasn't wrong.

For now, I think of Staff Mapper less as pure SaaS and more as a **productized service**. Our priority this year is modularizing those custom workflows so new firms can configure their own experience without creating forks of the codebase. Having happy, paying customers funding real discovery is a problem worth solving around.
