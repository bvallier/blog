---
layout: post
title: "TinyPivot MCP: Turning Any AI Agent Into a Real Data IDE"
author: Brice V.
summary: "TinyPivot is now available as an interactive MCP App (@smallwebco/tinypivot-mcp) for Antigravity, Claude, Cursor, OpenCode, Codex CLI, and pi — giving AI workflows real Charts, Pivot Tables, Drill-Through, and Excel exports without dumping raw rows into LLM context."
image: '/images/tinypivot_pivot.png'
date: 2026-11-24 17:00:00
last_modified_at: 2026-11-24
categories: [product, development]
tags: [tinypivot, mcp, mcp-app, model-context-protocol, claude-code, cursor, antigravity, analytics, pivot-table, data-grid]
---

A few months ago I realized something funny about how I actually use TinyPivot day to day.

Yes, people drop `@smallwebco/tinypivot-react` and `@smallwebco/tinypivot-vue` into SaaS apps and internal dashboards. That part is working great.

**But more and more of my own data analysis was happening inside AI coding harnesses** — Antigravity, Claude Code, Cursor, OpenCode, and `pi`. And every single time I asked an agent to look at a CSV or run a SQL query, the same annoying loop happened:

1. The agent dumped a truncated 15-row markdown table I couldn't sort, filter, or pivot.
2. Stuffing a few thousand raw rows into chat burned input tokens up front — and re-read them on every follow-up turn.
3. Asking *"now break that down by region and quarter"* or *"switch to a stacked bar sorted descending"* meant waiting for another LLM round-trip and paying output tokens to rewrite markdown or throwaway Python scripts — while hoping the LLM didn't drift on a sum.

So today I'm launching **`@smallwebco/tinypivot-mcp`** — an interactive **MCP App (SEP-1865) + live Terminal Companion Data IDE** powered by the exact same TinyPivot Core engine.

## 1-Command Setup Across Every Harness

```bash
npx @smallwebco/tinypivot-mcp init
```

That single command auto-detects and wires **Claude Code, Claude Desktop, Cursor, Antigravity, OpenCode, Codex CLI, and `pi`**.

- **Webview harnesses (Antigravity, Claude Desktop, Cursor):** Renders a full-bleed interactive Chart, Pivot Table, and Data Grid right inside the chat or side pane.
- **Terminal harnesses (Claude Code, OpenCode, `pi`, Ghostty):** Prints crisp Unicode charts + deterministic pivot summaries in your terminal *and* spins up a live SSE-synced Companion Data IDE on `http://127.0.0.1:<port>` that auto-updates on every turn.

## How It Actually Saves Tokens (Honest, Cache-Aware Math)

A lot of AI tools throw around inflated "99% cost savings" claims that ignore prompt caching. I wanted TinyPivot's numbers to pass a back-of-the-napkin check from an engineer.

When an agent analyzes a 2,000-row × 8-column dataset (~80k tokens) the usual way:

- **Turn 1** pays full input rate on the raw rows (~`$0.16–$0.32`).
- **Follow-up turns** pay ~10% cached input reads *plus* ~600+ expensive output tokens (`$10–$20/1M`) every time the model rewrites a table or rebuilds a chart script.

With TinyPivot MCP, `load_file` and `query_postgres` send only a **~200-token schema & summary** to the model and stream the full rows locally from the MCP server straight into the UI at **0 LLM tokens**. Switching Chart ↔ Pivot ↔ Data, changing sort order, filtering, or double-clicking a cell to drill through runs in local JavaScript at **$0**.

*(Caveat: if you already aggregate in SQL down to 15 summary rows before showing the LLM, raw-row savings are smaller — your win is avoiding follow-up chart re-prompts and getting instant local exploration. You can inspect the cache-adjusted math yourself on the [interactive ROI calculator](https://tiny-pivot.com/mcp#savings).)*

## Works With Any Database Today

Out of the box, TinyPivot works with **BigQuery, Snowflake, MySQL, DuckDB, Databricks, and PostgreSQL** via local CLI/CSV handoff to `load_file` (keeping your existing SSO/SAML/IAM auth untouched) or by piping JSON rows from any other MCP server via `load_data`. Pro also includes AST-validated read-only `query_postgres`, with native multi-DB and Parquet adapters coming in v0.2.

## Generous Free Tier + High-Trust Row Limits

Core Charts (`bar`, `stackedBar`, `line`, `area`, `pie`, `donut`), Basic Pivot (`sum`), the `Code` theme, and the Live Companion IDE are **free forever** up to **2,500 rows** — no account or API key needed.

And because analytical trust is everything: **TinyPivot never truncates silently.** If a dataset exceeds 2,500 rows on the Free tier, both the UI (an unmistakable amber top banner) and the text summary sent to the LLM explicitly state `Showing first 2,500 of N rows — charts & totals reflect this subset only`.

## One Engine, Three Clear Tracks

I also updated [tiny-pivot.com](https://tiny-pivot.com) to make the product lineup crystal clear for every type of user:

1. **AI Users & Data Analysts — [TinyPivot MCP](https://tiny-pivot.com/mcp):** Free up to 2,500 rows; **MCP Pro** (`$19/mo`, `$149/yr`, or `$399` Local Pro v1.x Lifetime) and **MCP Team 5 Seats** (`$79/mo` or `$699/yr`) unlock unlimited rows, all 5 visual themes (`Code`, `Phosphor`, `Nord`, `Thermal`, `Mono`), double-click Drill-Through, 9+ aggregations, styled `.xlsx` exports, and read-only `query_postgres`.
2. **Frontend & SaaS Engineers — React & Vue 3 UI Library:** Lightweight `<DataGrid />` with free Pivot Tables & Core Charts, plus one-time perpetual commercial licenses (`$49–$399`) for web apps.
3. **Product Teams — Embedded AI Data Analyst (BYOK):** Let your app's end users query data in plain English using your own OpenAI/Anthropic key over DuckDB WASM or Postgres.

Existing UI Library licenses (`TP-PRO*`) remain valid forever for React & Vue apps, while MCP Pro uses dedicated `TP-MCP*` keys.

Give it a spin in 10 seconds with `npx @smallwebco/tinypivot-mcp init`, check out the [live site](https://tiny-pivot.com/mcp), or star the repo on [GitHub](https://github.com/Small-Web-Co/tinypivot).
