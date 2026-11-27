---
layout: post
title: "Why I Built TinyPivot"
author: Brice Vallieres
topic: "Product"
summary: "After years of hitting the same data-table feature creep across client projects, I built a lightweight, zero-dependency pivot grid for Vue 3 and React."
image: "/images/covers/building-tinypivot.jpg"
date: 2025-12-01 13:57:19
last_modified_at: 2026-11-27
categories: [product, development]
tags: [vue 3, react, pivot table, data grid, tinypivot, open source]
---

If you have built data-heavy web apps in Vue or React, you know the trade-off you always hit when it is time to render tabular data.

On one end sit massive enterprise grid suites: expensive annual contracts, 500 KB added to your bundle, and configuration schemas that feel like a second programming language. On the other end sit bare-bones table primitives that require weeks of glue code before a user can even filter a column or copy a range of cells into Excel.

There was very little in between.

## The Feature-Creep Loop

I ran into the exact same pattern across years of consulting projects and my own web apps. A stakeholder starts by saying, *"We just need a simple table to display this dataset."*

Two weeks later, the asks arrive like clockwork:

- *"Can we filter by region and product?"*
- *"Can we pivot the rows by quarter and see subtotals?"*
- *"Can I copy a block of cells into Excel—or just export the filtered view?"*

What starts as a clean HTML `<table>` quietly turns into a brittle, half-baked spreadsheet. I wanted a drop-in component that felt close to Excel out of the box, stayed tiny in the bundle, and handled pivoting without forcing a procurement review.

So I built [TinyPivot](https://tiny-pivot.com).

## Zero Configuration to Start

Passing an array of flat objects should be enough to get sorting, multi-select column filtering, keyboard navigation, clipboard copy (`Cmd+C`), export, and drag-and-drop pivoting—no boilerplate column definitions required.

In **Vue 3**:

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
  <DataGrid :data="data" :show-pivot="true" />
</template>
{% endhighlight %}

In **React**:

{% highlight tsx %}
import { DataGrid } from '@smallwebco/tinypivot-react'
import '@smallwebco/tinypivot-react/style.css'

const data = [
  { region: 'North', product: 'Widget A', sales: 12500 },
  { region: 'North', product: 'Widget B', sales: 8300 },
  { region: 'South', product: 'Widget A', sales: 15200 },
]

export default function App() {
  return <DataGrid data={data} showPivot />
}
{% endhighlight %}

## Keeping the Business Model Simple

I have been burned by developer tools that look free until you are halfway through production and hit an enterprise paywall for basic functionality.

With TinyPivot, the core data grid and drag-and-drop pivot tables (with Sum aggregation, totals, and calculated fields) are free to use indefinitely. A one-time perpetual Pro license covers advanced statistical aggregations, built-in charts, embedded natural-language querying, and watermark removal. Simple for a solo builder to support, and straightforward for an engineering team to evaluate.

Both packages are on npm (`@smallwebco/tinypivot-vue` and `@smallwebco/tinypivot-react`), with live demos and documentation at [tiny-pivot.com](https://tiny-pivot.com).
