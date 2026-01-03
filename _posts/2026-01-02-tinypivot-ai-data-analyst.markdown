---
layout: post
title:  "Introducing AI Data Analyst: Natural Language Data Exploration for TinyPivot"
date:   2026-01-02
categories: tinypivot ai data-analysis
description: "TinyPivot now includes an AI Data Analyst that lets you explore data using natural language. Bring your own API key (BYOK) for full control over costs and privacy."
---

Today we're excited to announce **AI Data Analyst**, a new Pro feature in TinyPivot that brings natural language data exploration to your Vue 3 and React applications.

## The Problem with Traditional Data Exploration

Data grids are powerful, but they require users to understand the structure of their data. Want to find your top customers? You need to know which columns to filter, how to sort, and maybe even how to use pivot tables.

For technical users, this is fine. But what about business users who just want to ask: *"Show me sales by region"* or *"Which products have the highest return rate?"*

## Enter Natural Language Queries

With TinyPivot's AI Data Analyst, users can ask questions in plain English:

- "What are the top 10 products by revenue?"
- "Show me monthly sales trends"
- "Which regions have the highest customer lifetime value?"
- "Compare Q4 performance across product categories"

The AI understands your data schema and generates appropriate SQL queries automatically. Results appear in the data grid where users can further analyze with pivot tables and charts.

## Bring Your Own Key (BYOK)

Unlike many AI features that lock you into a specific provider or charge premium fees, TinyPivot uses a **Bring Your Own Key** model:

- **Use your existing API key** from OpenAI, Anthropic, or OpenRouter
- **Full control over costs** — pay your AI provider directly
- **No data middleman** — queries go directly to your chosen provider
- **Switch providers anytime** — just change your API key

This approach means:
1. You're not locked into TinyPivot's infrastructure for AI
2. You control rate limits and model selection
3. Your data privacy policies remain unchanged

## Privacy-First Architecture

For maximum security, TinyPivot supports client-side SQL execution with DuckDB WASM:

```
User Question → AI (generates SQL) → DuckDB (browser) → Results
```

In this setup:
- The AI only sees your **table schema**, not actual data
- SQL execution happens **entirely in the browser**
- Your data **never leaves the user's device**

For teams with strict compliance requirements, this architecture means you can offer AI-powered data exploration without changing your data handling policies.

## Lightweight Integration

TinyPivot remains lightweight even with AI features. The AI Data Analyst:

- Adds minimal bundle size (the heavy lifting is in your AI provider's API)
- Is tree-shakeable — don't use it, don't ship it
- Works with the same simple component API you already know

```vue
<DataGrid
  :data="data"
  :ai-analyst="{
    enabled: true,
    aiEndpoint: '/api/ai-proxy',
    dataSources: [{ id: 'sales', table: 'sales', name: 'Sales Data' }],
    queryExecutor: runDuckDBQuery
  }"
/>
```

## Try It Today

The AI Data Analyst is available now for all TinyPivot Pro license holders. Try it in the [live demo](https://tiny-pivot.com) or check out the [documentation](https://github.com/Small-Web-Co/tinypivot) to get started.

Not a Pro user yet? [Get a license](https://tiny-pivot.com/#pricing) starting at $49 — one-time payment, lifetime access.

---

## What's Next?

We're continuing to improve the AI Data Analyst based on user feedback:

- **Conversation memory** — ask follow-up questions that build on previous queries
- **Query explanations** — understand what SQL was generated and why
- **Suggested questions** — AI-powered suggestions based on your data schema

Have ideas? [Open an issue](https://github.com/Small-Web-Co/tinypivot/issues) on GitHub or reach out on Twitter [@bricevallieres](https://twitter.com/bricevallieres).
