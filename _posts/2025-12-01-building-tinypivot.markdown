---
layout: post
title: "TinyPivot: A Lightweight Pivot Table Component for Vue 3 & React"
author: Brice V.
summary: A lightweight, zero-dependency pivot table and data grid component for Vue 3 and React. Excel-like features without the bloat - filtering, sorting, aggregations, and drag-and-drop pivoting.
image: '/images/tinypivot_demo.gif'
date: 2025-12-01 13:57:19
last_modified_at: 2025-12-17
categories: [product, development]
tags: [vue 3, vue 3 pivot table, vue 3 data grid, react, react pivot table, react data grid, lightweight pivot table, data grid component, open source, tinypivot]
---

If you've ever built a data-heavy dashboard in Vue 3 or React, you know the pain. You need to display tabular data, let users sort and filter, maybe even do some aggregations. You reach for a data table library and... it's either way too heavy, looks like it was designed in 2012, or requires a PhD to configure.

I've been there more times than I'd like to admit.

After years of wrestling with various table components across client projects - at consultancies, on my own apps like Staff Mapper - I realized something: **there wasn't a lightweight, beautiful, Excel-like data grid for Vue 3 or React that just worked out of the box.** Sure, there were enterprise behemoths that cost thousands per year and added 500KB to your bundle. And there were bare-bones tables that looked... bare-bones. Nothing in between.

So I built [TinyPivot](https://tiny-pivot.com) - a lightweight pivot table component that doesn't sacrifice features for simplicity.

## What Is It?

TinyPivot is a **lightweight Vue 3 and React pivot table component** that gives you:

- An Excel-like data grid with auto-sizing columns
- Column filtering with multi-select dropdowns
- Sorting (just click the headers)
- Keyboard navigation and cell selection
- Copy to clipboard (Cmd+C like you'd expect)

And if you upgrade to Pro, you get the real magic: **drag-and-drop pivot tables** with aggregations, totals, and percentage modes. The kind of stuff your finance team has been asking for.

## The Problem I Was Solving

Here's the thing - I kept running into the same pattern on client projects. Someone would say "we just need a simple table to show this data." Two weeks later, it's "can we add filtering?" Then "can users pivot the data by region?" Then "can we export this to Excel?"

Every. Single. Time.

What starts as a simple `<table>` element inevitably becomes a feature-creep nightmare. I wanted something that could handle the basics beautifully out of the gate, but scale up to pivot table territory when the inevitable ask came.

## Dead Simple to Use

Here's all you need to get started with **Vue 3**:

{% highlight vue %}
<script setup lang="ts">
import { DataGrid } from '@smallwebco/tinypivot-vue'
import '@smallwebco/tinypivot-vue/style.css'

const data = [
  { region: 'North', product: 'Widget A', sales: 12500 },
  { region: 'North', product: 'Widget B', sales: 8300 },
  { region: 'South', product: 'Widget A', sales: 15200 },
]
</script>

<template>
  <DataGrid :data="data" />
</template>
{% endhighlight %}

Or with **React**:

{% highlight tsx %}
import { DataGrid } from '@smallwebco/tinypivot-react'
import '@smallwebco/tinypivot-react/style.css'

const data = [
  { region: 'North', product: 'Widget A', sales: 12500 },
  { region: 'North', product: 'Widget B', sales: 8300 },
  { region: 'South', product: 'Widget A', sales: 15200 },
]

export default function App() {
  return <DataGrid data={data} />
}
{% endhighlight %}

That's it. No config objects, no schema definitions, no boilerplate. Just pass your data and it figures out the columns.

## The Freemium Model

I went back and forth on pricing for a while. Ultimately, I landed on a freemium approach:

**Free tier** gets you the data grid with filtering, sorting, and all the basics. No watermark tricks, no feature time-bombs. It's genuinely useful.

**Pro licenses** ($49 for a single project, $149 unlimited) unlock pivot tables, aggregations, totals, and removes the small "Powered by TinyPivot" badge.

Why this model? Because I've been burned by libraries that bait-and-switch. You integrate them, ship to production, and then realize you need a feature that's locked behind a $5K/year enterprise plan. Not cool.

With TinyPivot, you can evaluate everything in demo mode before buying. And if the free tier does what you need, use it forever. I'd rather have devs actually using it than hiding it behind a paywall nobody can afford.

## What's Next

I'm actively working on a few things:

- **Virtual scrolling** for massive datasets (100K+ rows)
- **Column resizing** via drag handles
- **Export to CSV/Excel** (the inevitable ask, might as well build it in)
- **Nuxt module** for easier SSR integration
- **Next.js** optimizations for React SSR

If you're building dashboards in Vue 3 or React and need a lightweight data grid that doesn't suck, give [TinyPivot](https://tiny-pivot.com) a shot. Zero dependencies, tiny bundle size, and it actually looks good. It's on npm:

{% highlight bash %}
# Vue 3
pnpm add @smallwebco/tinypivot-vue

# React
pnpm add @smallwebco/tinypivot-react
{% endhighlight %}

I'd love to hear what you think. Drop me a line on [X @bricevallieres](https://twitter.com/bricevallieres) or open an issue on [GitHub](https://github.com/Small-Web-Co/tinypivot).

**Next up:** Check out the [Vue 3 & React Pivot Table Tutorial](/development/tutorial/2025/12/03/tinypivot-how-to-guide.html) for practical examples and real-world use cases.

<center>🚀 Happy pivoting 🚀</center>

