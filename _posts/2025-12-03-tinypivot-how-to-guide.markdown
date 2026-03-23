---
layout: post
title: "Vue 3 & React Pivot Table Tutorial: Build Data Dashboards with TinyPivot"
author: Brice V.
summary: Step-by-step tutorial for adding lightweight pivot tables to Vue 3 and React apps. Learn filtering, sorting, aggregations, and Excel-like data grids with code examples.
image: '/images/tinypivot_demo.gif'
date: 2025-12-03 10:00:00
last_modified_at: 2026-03-23
categories: [development, tutorial]
tags: [vue 3 pivot table tutorial, react pivot table tutorial, vue 3 data grid, react data grid, lightweight data table, tinypivot, javascript pivot table, data visualization]
---

Last week someone asked me "what can TinyPivot actually *do*?" - and I realized I'd been so focused on building features that I hadn't written a proper guide on how to use them. So here's the practical stuff: real scenarios, actual code, and the patterns I've found myself using repeatedly.

Whether you're looking for a **lightweight Vue 3 pivot table** or a **React data grid component**, this tutorial covers everything from basic setup to advanced pivot table configurations.

If you haven't already, check out [the intro post on why I built TinyPivot](/product/development/2025/12/01/building-tinypivot.html) for the backstory and motivation.

## Try It Now

Before we dive into code, here's the actual component in action. Click around, filter some columns, try Cmd+C to copy cells:

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; border: 1px solid #e5e7eb; margin: 1.5rem 0;">
  <iframe 
    src="https://tiny-pivot.com#demo" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    loading="lazy"
    title="TinyPivot Demo">
  </iframe>
</div>

## The Basics: Vue 3 Data Grid Setup

Let's start with the most common case. You have an array of objects and you need to display them in a grid. No fancy config - just data in, table out. This lightweight approach means no complex schemas or configuration objects.

{% highlight vue %}
<script setup lang="ts">
import { DataGrid } from '@smallwebco/tinypivot-vue'
import '@smallwebco/tinypivot-vue/style.css'

// Your API response, CSV import, whatever
const orders = ref([
  { orderId: 'ORD-001', customer: 'Acme Corp', amount: 2340, status: 'shipped' },
  { orderId: 'ORD-002', customer: 'TechStart', amount: 890, status: 'pending' },
  { orderId: 'ORD-003', customer: 'Acme Corp', amount: 1200, status: 'delivered' },
])
</script>

<template>
  <DataGrid :data="orders" />
</template>
{% endhighlight %}

That's it. TinyPivot infers the columns from your data keys. Numbers get formatted with commas automatically. Strings display as-is. No schema definition required.

## Scenario 1: Sales Dashboard with Filtering

Most dashboards need filtering. Users want to slice data by region, by product, by date range. Here's a sales dashboard setup:

{% highlight vue %}
<script setup lang="ts">
import { ref } from 'vue'
import { DataGrid } from '@smallwebco/tinypivot-vue'

const salesData = ref([
  { date: '2025-01-15', region: 'Northeast', rep: 'Alice', product: 'Enterprise', amount: 45000 },
  { date: '2025-01-16', region: 'Southwest', rep: 'Bob', product: 'Starter', amount: 1200 },
  { date: '2025-01-16', region: 'Northeast', rep: 'Alice', product: 'Pro', amount: 8500 },
  { date: '2025-01-17', region: 'Midwest', rep: 'Carol', product: 'Enterprise', amount: 52000 },
  // ... more data
])
</script>

<template>
  <DataGrid
    :data="salesData"
    :enable-search="true"
    :enable-export="true"
    export-filename="sales-report.csv"
    theme="light"
  />
</template>
{% endhighlight %}

The column headers become clickable filters. Users can:
- Click any column header to filter by specific values
- Use the global search (Cmd+F) to find specific records
- Export the filtered view to CSV

## Scenario 2: React Data Grid with Large Datasets

When you're dealing with 10K+ rows, pagination keeps things snappy. Here's how to set up a **lightweight React pivot table** that handles large datasets efficiently:

{% highlight tsx %}
// React data grid example
import { DataGrid } from '@smallwebco/tinypivot-react'
import '@smallwebco/tinypivot-react/style.css'

export function TransactionLog({ transactions }) {
  return (
    <DataGrid
      data={transactions}
      enablePagination={true}
      pageSize={100}
      enableSearch={true}
      fontSize="xs"
    />
  )
}
{% endhighlight %}

The `fontSize` prop is worth mentioning - when you're showing dense data like transaction logs or server metrics, `xs` lets you fit more on screen without scrolling.

## Scenario 3: Interactive Row Selection

Need to do something when a user clicks a row? Wire up the `cell-click` event:

{% highlight vue %}
<script setup lang="ts">
import { DataGrid } from '@smallwebco/tinypivot-vue'

const customers = ref([
  { id: 1, name: 'Acme Corp', tier: 'Enterprise', mrr: 12500 },
  { id: 2, name: 'TechStart', tier: 'Starter', mrr: 49 },
  { id: 3, name: 'BigCo', tier: 'Pro', mrr: 499 },
])

const selectedCustomer = ref(null)

function handleCellClick({ rowData }) {
  selectedCustomer.value = rowData
  // Open detail panel, navigate to customer page, whatever you need
}
</script>

<template>
  <div class="flex gap-4">
    <DataGrid
      :data="customers"
      @cell-click="handleCellClick"
      class="flex-1"
    />
    <CustomerDetail 
      v-if="selectedCustomer" 
      :customer="selectedCustomer" 
    />
  </div>
</template>
{% endhighlight %}

The `rowData` gives you the entire object for that row - no need to track indices or do lookups.

## Scenario 4: Copying Data to Clipboard

One of those "small but huge" features. Select a range of cells, hit Cmd+C, paste into Excel or Google Sheets. It just works.

{% highlight vue %}
<template>
  <DataGrid
    :data="data"
    :enable-clipboard="true"
    @copy="({ text, cellCount }) => console.log(`Copied ${cellCount} cells`)"
  />
</template>
{% endhighlight %}

Users can:
- Click and drag to select a range
- Shift+Arrow keys to extend selection
- Cmd+C to copy
- Paste anywhere that accepts tabular data

This is the kind of thing finance teams *love*. They can pull a subset of data into their own spreadsheets without exporting the whole thing.

## Scenario 5: Vue 3 Pivot Table with Drag-and-Drop

This is where TinyPivot really shines as a **Vue 3 pivot table component**. Say you have sales data and want to analyze it by region and product:

{% highlight vue %}
<script setup lang="ts">
import { ref } from 'vue'
import { DataGrid } from '@smallwebco/tinypivot-vue'

const salesData = ref([
  { region: 'North', product: 'Widget A', quarter: 'Q1', revenue: 45000, units: 150 },
  { region: 'North', product: 'Widget B', quarter: 'Q1', revenue: 32000, units: 95 },
  { region: 'South', product: 'Widget A', quarter: 'Q1', revenue: 52000, units: 180 },
  { region: 'South', product: 'Widget B', quarter: 'Q1', revenue: 28000, units: 85 },
  { region: 'North', product: 'Widget A', quarter: 'Q2', revenue: 48000, units: 160 },
  // ... more quarters
])
</script>

<template>
  <DataGrid
    :data="salesData"
    :show-pivot="true"
  />
</template>
{% endhighlight %}

TinyPivot includes pivot mode in the free tier, so users can drag fields into row/column slots and get instant Sum-based aggregations. Want to see total revenue by region? Drag `region` to rows and `revenue` to values. Want to break it down by quarter? Drag `quarter` to columns.

In the free tier, you get:
- **Sum** - total of all values
- **Row/column totals** - quick rollups without extra setup
- **Calculated fields** - create derived metrics from your existing columns

If you upgrade to Pro, TinyPivot adds the fuller analytics layer:
- **Count / Average / Min / Max**
- **Median / Std Dev**
- **% of Total**
- **Chart Builder**
- **Embedded AI Analyst**

## Scenario 6: Custom Aggregations

Sometimes the built-in aggregations aren't enough. Need a 90th percentile? Weighted average? Pass your own function:

{% highlight vue %}
<script setup lang="ts">
const valueFields = ref([
  {
    field: 'response_time',
    aggregation: 'custom',
    customFn: (values) => {
      // P95 latency
      const sorted = [...values].sort((a, b) => a - b)
      const idx = Math.floor(sorted.length * 0.95)
      return sorted[idx]
    },
    customLabel: 'P95 Latency',
    customSymbol: 'P95'
  }
])
</script>
{% endhighlight %}

I've used this for:
- Calculating weighted averages (value * weight / sum of weights)
- Finding mode (most common value) in categorical data
- Computing growth rates between first and last values
- Custom percentile calculations for SLA reporting

## Scenario 7: Calculated Fields

Want derived metrics that don't exist in your raw data? Calculated fields let you build formulas:

{% highlight vue %}
<script setup lang="ts">
const calculatedFields = ref([
  {
    id: 'profit_margin',
    name: 'Profit Margin %',
    formula: '(SUM(revenue) - SUM(cost)) / SUM(revenue) * 100',
    formatAs: 'percent',
    decimals: 1
  },
  {
    id: 'avg_order_value',
    name: 'Avg Order Value',
    formula: 'SUM(revenue) / COUNT(order_id)',
    formatAs: 'currency',
    decimals: 2
  },
  {
    id: 'units_per_transaction',
    name: 'Units/Transaction',
    formula: 'SUM(units) / COUNT(order_id)',
    formatAs: 'number',
    decimals: 1
  }
])
</script>
{% endhighlight %}

These calculated fields update dynamically as users filter and pivot the data. Great for KPIs that leadership actually cares about.

## Scenario 8: Dark Mode

If your app has dark mode, TinyPivot should match:

{% highlight vue %}
<template>
  <DataGrid
    :data="data"
    :theme="isDark ? 'dark' : 'light'"
  />
</template>
{% endhighlight %}

Or let it follow the system preference:

{% highlight vue %}
<template>
  <DataGrid :data="data" theme="auto" />
</template>
{% endhighlight %}

## Scenario 9: Custom Styling

Need to match your brand colors? Override the CSS variables:

{% highlight css %}
/* In your app's CSS */
.vpg-data-grid {
  --vpg-header-bg: #1a1a2e;
  --vpg-header-text: #eef2ff;
  --vpg-row-hover: #f0f9ff;
  --vpg-border-color: #e5e7eb;
  --vpg-selection-bg: #dbeafe;
}
{% endhighlight %}

The component uses scoped styles so you won't have conflicts with existing CSS.

## Keyboard Shortcuts Reference

For power users who hate reaching for the mouse:

| Shortcut | What it does |
|----------|--------------|
| `Cmd/Ctrl+C` | Copy selected cells |
| `Cmd/Ctrl+F` | Focus search input |
| `Arrow keys` | Navigate between cells |
| `Shift+Arrow` | Extend selection |
| `Escape` | Clear selection or search |

## What Data Shape Works Best

TinyPivot expects flat objects. Each object is a row, each key becomes a column:

{% highlight typescript %}
// ✅ This works great
const data = [
  { id: 1, customer: 'Acme', revenue: 50000, region: 'West' },
  { id: 2, customer: 'TechCo', revenue: 35000, region: 'East' },
]

// ❌ Nested objects won't display correctly
const badData = [
  { id: 1, customer: { name: 'Acme', tier: 'Enterprise' }, metrics: { revenue: 50000 } }
]
{% endhighlight %}

If you have nested data from an API, flatten it first. A quick map usually does the trick:

{% highlight typescript %}
const flatData = apiResponse.map(item => ({
  id: item.id,
  customerName: item.customer.name,
  customerTier: item.customer.tier,
  revenue: item.metrics.revenue
}))
{% endhighlight %}

## Wrapping Up

The patterns above cover probably 90% of what I've needed across various projects. Whether you need a **lightweight Vue 3 data grid**, a **React pivot table component**, or something that handles both - TinyPivot keeps things simple without sacrificing features.

The core idea is: get data on screen fast, let users explore it, and don't make them wait for the backend when they want to filter or aggregate. And do it all with a tiny bundle size.

Full docs and live demo at [tiny-pivot.com](https://tiny-pivot.com). The npm packages are `@smallwebco/tinypivot-vue` for Vue 3 and `@smallwebco/tinypivot-react` for React.

Questions or feedback? Find me on [X @bricevallieres](https://twitter.com/bricevallieres) or open an issue on [GitHub](https://github.com/Small-Web-Co/tinypivot).
