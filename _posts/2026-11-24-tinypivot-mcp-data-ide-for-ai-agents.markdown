---
layout: post
title: "TinyPivot MCP: Turning Any AI Agent Into a Real Data IDE"
author: Brice Vallieres
topic: "AI & Data"
summary: "Why pasting raw rows into chat breaks analytical work, and how pairing MCP Apps with a local companion workspace fixes the loop."
image: "/images/covers/mcp-data-ide.jpg"
date: 2026-11-24 17:00:00
last_modified_at: 2026-11-27
categories: [product, development]
tags: [tinypivot, mcp, claude-code, cursor, antigravity, analytics, pivot-table]
---

A few months ago I noticed something ironic about how I was doing my own data work.

I built TinyPivot as a React and Vue data grid for web apps. Yet most of my day-to-day analysis was happening inside AI coding harnesses—Claude Code, Cursor, Antigravity, OpenCode, and `pi`. Every time I pointed an agent at a CSV or a SQL query, the same tedious loop played out:

1. The agent printed a truncated 15-row Markdown table I couldn't sort, filter, or pivot.
2. Stuffing a few thousand raw rows into chat burned input tokens up front and forced the model to re-read them on every turn.
3. Asking *"break that down by region and quarter"* or *"switch to a stacked bar"* meant waiting for another LLM round-trip and paying output tokens to rewrite Markdown or throwaway Python scripts—while hoping the model didn't hallucinate a sum.

Chat is a great interface for asking questions, and a terrible interface for exploring tabular data.

So I packaged the TinyPivot engine into **`@smallwebco/tinypivot-mcp`**—an interactive MCP App paired with a local Companion Data IDE that runs beside whatever coding agent you already use.

## One-Command Setup

```bash
npx @smallwebco/tinypivot-mcp init
```

The installer detects and configures Claude Code, Claude Desktop, Cursor, Antigravity, OpenCode, Codex CLI, and `pi` automatically:

- **Webview harnesses** (Claude Desktop, Cursor, Antigravity) render an interactive Chart, Pivot Table, and Data Grid directly inside the chat or side pane.
- **Terminal harnesses** (Claude Code, OpenCode, `pi`) print crisp Unicode charts and deterministic summaries in the terminal while spinning up a live local Companion IDE over SSE at `http://127.0.0.1:<port>` that updates on every turn.

## Honest, Cache-Aware Token Math

A lot of AI tooling throws around inflated "99% cost savings" claims that quietly ignore prompt caching. I wanted the math here to pass an engineer's back-of-the-napkin check.

When an agent analyzes a 2,000-row × 8-column dataset (~80k tokens) in plain chat:

- **Turn 1** pays full input cost on the raw rows.
- **Every follow-up turn** pays cached input reads (~10% of base rate) *plus* hundreds of expensive output tokens each time the model rewrites a summary table or regenerates a chart script.

With TinyPivot MCP, `load_file` and `query_postgres` send only a compact **~200-token schema and summary** to the model. The full dataset streams locally from the MCP server straight into the browser workspace at zero LLM tokens. Switching between Chart, Pivot, and Data views—or filtering, sorting, and double-clicking a cell to drill through—runs in local JavaScript instantaneously at $0.

One honest caveat: if you already aggregate in SQL down to 15 summary rows before showing the model anything, raw-row token savings are modest. In that case, the real win is eliminating follow-up re-prompts and getting direct, local visual exploration.

## Works With Your Existing Data Stack

Out of the box, TinyPivot works alongside BigQuery, Snowflake, Databricks, DuckDB, MySQL, and PostgreSQL—either by pointing `load_file` at a local CSV/Parquet export (keeping your existing SSO/SAML/IAM auth untouched), piping JSON rows from another MCP server via `load_data`, or querying PostgreSQL directly through an AST-validated read-only connection.

Analytical trust only works if numbers are complete. Local file analysis runs with **unlimited local rows** on the free tier—no silent truncation, no signup, and no cloud upload. Your data stays on your machine.

You can explore the documentation at [tiny-pivot.com/mcp](https://tiny-pivot.com/mcp) or inspect the source on [GitHub](https://github.com/Small-Web-Co/tinypivot).
