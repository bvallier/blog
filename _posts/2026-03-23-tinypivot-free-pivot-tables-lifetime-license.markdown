---
layout: post
title: "TinyPivot Update: Free Pivot Tables + Lifetime Pro Licensing"
author: Brice V.
summary: TinyPivot now makes its core story much clearer: free pivot tables with Sum aggregation, totals, and calculated fields for Vue 3 and React. Pro focuses on advanced aggregations, charts, AI Analyst, and watermark removal with a lifetime license.
image: '/images/tinypivot_pivot.png'
date: 2026-03-23 11:00:00
last_modified_at: 2026-03-23
categories: [product, development]
tags: [tinypivot, react pivot table, vue 3 pivot table, data grid, lightweight data grid, lifetime license, javascript pivot table]
---

One of the hardest parts of selling developer tools isn't building the thing. It's explaining it clearly.

TinyPivot has reached that point where the product is broad enough that the old messaging was starting to blur the real value. So I spent some time tightening the story, and this is the version I want developers to see first:

**TinyPivot gives you a lightweight data grid with free pivot tables for Vue 3 and React.**

That means the free tier now clearly includes:

- Grid view with sorting, filtering, search, export, and keyboard navigation
- Pivot tables with **Sum** aggregation
- Row and column totals
- Calculated fields and formula builder

And **Pro** is now the upgrade path for the more advanced analytics layer:

- Advanced aggregations like Count, Average, Min/Max, Median, Std Dev, and % of Total
- Chart Builder
- Embedded AI Analyst
- Watermark removal

## Why This Matters

When you land on a component site, you're usually trying to answer one question fast:

> "Can I drop this into my app today and get real value without a procurement process?"

If the answer is buried under too much pricing or too many "enterprise" caveats, most of us bounce.

TinyPivot was always meant to be the opposite of that. I wanted the free experience to be genuinely useful, especially for:

- Internal tools
- Admin dashboards
- Reporting screens
- Customer-facing analytics views

The goal is still the same: give you something that feels closer to Excel than a bare-bones table, without dragging a giant bundle into your app.

## What The Free Tier Looks Like

If you're using TinyPivot for the first time, here's the basic setup in **Vue 3**:

{% highlight vue %}
<script setup lang="ts">
import { DataGrid } from '@smallwebco/tinypivot-vue'
import '@smallwebco/tinypivot-vue/style.css'

const data = [
  { region: 'North', product: 'Widget A', sales: 12500, units: 150 },
  { region: 'North', product: 'Widget B', sales: 8300, units: 95 },
  { region: 'South', product: 'Widget A', sales: 15200, units: 180 },
]
</script>

<template>
  <DataGrid
    :data="data"
    :show-pivot="true"
    :enable-search="true"
    :enable-export="true"
  />
</template>
{% endhighlight %}

And the same idea in **React**:

{% highlight tsx %}
import { DataGrid } from '@smallwebco/tinypivot-react'
import '@smallwebco/tinypivot-react/style.css'

const data = [
  { region: 'North', product: 'Widget A', sales: 12500, units: 150 },
  { region: 'North', product: 'Widget B', sales: 8300, units: 95 },
  { region: 'South', product: 'Widget A', sales: 15200, units: 180 },
]

export default function App() {
  return (
    <DataGrid
      data={data}
      showPivot={true}
      enableSearch={true}
      enableExport={true}
    />
  )
}
{% endhighlight %}

No schema definition. No config file the size of a novella. Just your data, a component, and a pivot view that's available from the start.

## What Pro Is For

I still want a paid tier, but I want it to feel clean and justified.

So the Pro story is now much simpler:

**Use Pro when you need richer analytics, not when you just need a pivot table.**

That includes:

- More aggregation modes
- Drag-and-drop charts
- Natural language data exploration with the Embedded AI Analyst
- Watermark removal for shipped products

That separation feels healthier. The free tier is useful on its own. Pro is the serious upgrade for teams building more polished analytics experiences.

## Lifetime Means Lifetime

The other cleanup was licensing language.

TinyPivot Pro is a **lifetime license**. Buy it once, activate it once, and keep using it. I wanted that to be obvious everywhere instead of sounding like there was some hidden annual catch.

I'm a solo builder. I like one-time pricing when I can make it work. It's simpler for me, and it's definitely simpler for the developers evaluating the library.

## If You Already Tried TinyPivot

If you looked at TinyPivot a while ago and assumed pivot tables were part of the paid tier, take another look.

The free tier now tells the story I wanted it to tell from the beginning:

- useful immediately
- small enough to justify
- powerful enough to grow with

You can try it at [tiny-pivot.com](https://tiny-pivot.com), and if you want the full analytics stack, Pro is there when you need it.

{% highlight bash %}
# Vue 3
pnpm add @smallwebco/tinypivot-vue

# React
pnpm add @smallwebco/tinypivot-react
{% endhighlight %}

Questions, ideas, or feature requests? Reach out on [GitHub](https://github.com/Small-Web-Co/tinypivot) or find me on [X @bricevallieres](https://twitter.com/bricevallieres).
