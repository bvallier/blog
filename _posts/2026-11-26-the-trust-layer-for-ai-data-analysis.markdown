---
layout: post
title: "The Trust Layer for AI Data Analysis"
author: Brice Vallieres
topic: "AI & Data"
summary: "Why data leaders still don't trust AI analysis in a board deck—and what 700+ benchmark runs taught me about catching silent math errors deterministically."
image: "/images/covers/trust-layer-ai.jpg"
date: 2026-11-26 11:30:00
last_modified_at: 2026-11-27
categories: [product, development]
tags: [tinypivot, mcp, duckdb, data-science, llm, benchmarks, analytics]
---

Ask any senior data leader why they still hesitate to put AI-generated analysis in front of an executive team, and the answer is rarely that the chart looked rough.

It is **silent wrong math**.

A SQL syntax error is harmless—an agent fixes it in two seconds. The real risk is a query that runs cleanly in 15 milliseconds while quietly producing a wrong answer:

- **Join fan-out:** Multiplying revenue by 2.25× because a join hits a non-unique dimension table, or exploding totals across a three-table chasm trap.
- **Unweighted averages:** Running `AVG(conversion_rate)` across segments and walking straight into Simpson's paradox.
- **Partial periods and outliers:** Reporting a 79% April drop when April only has six days of data, or letting two outlier orders invert a regional ranking.
- **SQL `NULL` traps and mixed units:** Dropping 40% of orders on `WHERE discount_code != 'PROMO20'` because SQL excludes `NULL`s, or summing USD, EUR, GBP, and JPY as if they shared a currency.
- **Broken experiments and confounding:** Celebrating a "significant" slice in a 20-segment A/B test with a broken randomization split (Sample Ratio Mismatch) and no multiple-testing correction, or concluding discounts hurt renewals (−19.1 pp naive) when they were targeted at at-risk accounts and actually *lift* renewals (+8.0 pp) once you control for account health.

I have seen every one of these happen in real life—both with human analysts and with frontier models.

That led to a straightforward engineering question: what if [TinyPivot MCP](https://tiny-pivot.com) acted not just as an interactive data workspace, but as a local, deterministic **trust layer** sitting beside DuckDB—catching analytical traps before a model ever answers, and attaching clickable query lineage to every number?

## Testing Without Hints

My first benchmark mistake was telegraphing the traps in the prompt (*"watch for outliers"*, *"check validity"*). Real stakeholders never warn an analyst where the landmines are. They ask *"Which region outperformed?"* or *"Should we ship variant B?"*

To measure whether deterministic guardrails actually help, I threw out hinted prompts and evaluated five models—local `Inkling 2 Mini` (Mac), local `DeepSeek V4.1 Flash` (DGX Spark), and `Claude Haiku 5.5`, `Sonnet 5.5`, and `Opus 5.5`—across three benchmark suites:

1. **18-Task Unhinted Executive Suite (270 runs):** Six routine BI traps (partial periods, `NULL` anti-joins, duplicate IDs, whale outliers, mixed currencies), six relational traps (join fan-out, chasm traps, unweighted rates, Simpson's paradox, survivorship bias), and six statistical traps (SRM, p-hacking, confounded OLS, right-censored cohorts, structural breaks).
2. **MIT KramaBench (ICLR 2026, 372 paired runs):** Controlled same-model A/B across four multi-file data lakes (Environment, Biomedical, Archaeology, and Wildfire—spanning CSVs, multi-sheet Excel workbooks, JSON, and GeoPackages), scored verbatim with MIT's evaluation scripts.
3. **Adyen / Hugging Face DABstep (450 blind tasks):** Official external financial analytics leaderboard over a 22 MB `payments.csv` (138,236 rows) and 1,000 nested fee rules, scored blindly by Adyen.

## What the Benchmarks Showed

### 1. Unhinted Executive Traps (5 Models, 270 Runs)

Comparing bare SQL/Python baselines against TinyPivot Free and TinyPivot Pro:

| Model | Baseline | TinyPivot Free | TinyPivot Pro | Latency Impact |
|---|---:|---:|---:|---:|
| Inkling 2 Mini (Mac local) | 14/18 (78%) | 15/18 (83%) | **18/18 (100%)** | −44% faster |
| DeepSeek V4.1 Flash (DGX local) | 17/18 (94%) | 17/18 (94%) | **18/18 (100%)** | −39% faster |
| Claude Haiku 5.5 | 15/18 (83%) | 16/18 (89%) | **18/18 (100%)** | −5% faster |
| Claude Sonnet 5.5 | 18/18 (100%) | 18/18 (100%) | **18/18 (100%)** | −6% faster |
| Claude Opus 5.5 | 18/18 (100%) | 18/18 (100%) | **18/18 (100%)** | −19% on Hard DS |
| **Combined (90 tasks/arm)** | **82/90 (91%)** | **84/90 (93%)** | **90/90 (100%)** | **−25% overall** |

The biggest jump came on the six hard statistical tasks: across all five models, accuracy moved from **80% (24/30) to 100% (30/30)** while running **2.1× faster** (39.7s down to 19.3s per task) with 20% fewer agent turns. Instead of writing 60 lines of ad-hoc Python to implement Holm-Bonferroni corrections or survival curves from scratch, the model calls a verified statistical primitive and spends its tokens interpreting the output.

### 2. MIT KramaBench Same-Model A/B (372 Runs)

On MIT's fresh 2026 multi-file data-lake benchmark, every tested model improved with the exact same base weights:

| Model (62 tasks each) | Vanilla (Read + Python) | TinyPivot Pro | Delta |
|---|---:|---:|---:|
| Claude Haiku 5.5 | 71.9% (24.2s) | **78.0% (21.9s)** | **+6.1 pts · 10% faster** |
| Claude Sonnet 5.5 | 82.6% (17.5s) | **83.8% (19.2s)** | **+1.2 pts** |
| DeepSeek V4.1 (local) | 62.8% (46.2s) | **63.9% (59.9s)** | **+1.1 pts** |

Two results stood out to me:

- **Small models punch above their weight:** Haiku 5.5 with TinyPivot Pro closed more than half the gap to vanilla Sonnet 5.5 at roughly half the API cost, jumping **+22.2 points** (66.7% to 88.9%) and running **2.1× faster** on the Biomedical Excel workbooks.
- **Local models stay competitive:** Running 100% locally on a home DGX Spark at zero cloud spend, DeepSeek V4.1 with TinyPivot Pro reached 63.9%—well ahead of earlier published DeepSeek-family agents on the same benchmark—without needing Jupyter servers or multi-agent orchestration.

### 3. Adyen DABstep Blind Leaderboard (450 Tasks)

On Adyen's official 450-task blind leaderboard, `Sonnet 5.5 + TinyPivot Pro` scored **97.2% Easy (70/72)** and **68.8% Hard (260/378)**—73.3% overall. `Haiku 5.5` reached 46.7% overall (and jumped +10 points in our controlled Dev A/B), while local `DeepSeek V4.1` hit 90.3% Easy and 34.9% overall at zero API spend.

To keep attribution honest: Sonnet's high absolute score on DABstep reflects strong base-model reasoning paired with a clean DuckDB workflow (our 10-task Dev A/B showed parity on Sonnet and Opus, and a +10-point lift on Haiku). That is why pairing a blind external leaderboard with controlled same-model A/Bs matters.

## Five Engineering Changes That Actually Moved the Needle

Running hundreds of real failures surfaced five concrete improvements—none of which required heavier models or extra dependencies:

1. **Batch analytical SQL and persistent views:** Letting an agent execute up to six read-only `SELECT` statements in one tool call, returning full-precision tables and persisting named results as DuckDB views across turns, cut unnecessary round-trips immediately.
2. **One-call data-lake profiling:** Scanning an entire folder of CSV, Parquet, JSON, and multi-sheet Excel files via DuckDB `DESCRIBE` collapses partitioned sibling files (like `water-2021..2024.csv`) into a single glob hint and surfaces shared join keys without stuffing raw rows into context.
3. **Smart Excel header detection:** Scientific and financial spreadsheets rarely put column names on row 1. Auto-detecting the real header row beneath title and unit preambles—and returning the preamble notes alongside the schema—was the single biggest driver of the +22-point Biomedical jump.
4. **Automatic SQL-to-statistics routing:** When a model bypasses profiling and writes raw SQL against an A/B test, cohort table, or seasonal time series, the audit layer checks for SRM, right-censoring, or day-of-week distortion and points the model to the exact deterministic statistical call.
5. **Headless mode for batch evaluation:** Running automated benchmarks shouldn't pop open dozens of browser tabs. Adding `--no-studio` disables the local HTTP workspace cleanly during scripted runs.

## Why Determinism Matters More Than Clever Prompts

Prompt engineering can remind a model to check for join fan-out, and half the time it will. A deterministic layer running next to DuckDB checks every time—whether you are using a flagship cloud model or a fast local model on your laptop.

The full white paper and benchmark breakdown are published at [tiny-pivot.com/whitepaper](https://tiny-pivot.com/whitepaper), and you can test the local MCP server with a single command:

```bash
npx @smallwebco/tinypivot-mcp init
```
