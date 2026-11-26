---
layout: post
title: "The Trust Layer for AI Data Analysis: Turning Local & Fast Models Into Reliable Data Scientists"
author: Brice V.
summary: "We built deterministic SQL guardrails, exact-table batch SQL, a 1-call Data Science shelf, Proof-of-Work Lineage, and local Recursive Data Memory into TinyPivot MCP — then tested them on 18 unhinted BI & Data Science tasks across 5 models (270 runs) plus the official Adyen / Hugging Face DABstep benchmark."
image: '/images/tinypivot_pivot.png'
date: 2026-11-26 11:30:00
last_modified_at: 2026-11-26
categories: [product, development]
tags: [tinypivot, mcp, duckdb, data-science, llm, benchmarks, dabstep, local-llm, deepseek, claude, analytics]
---

If you ask any senior data leader why they still don't trust AI-generated analysis in a board deck, the answer is almost never *"the chart looked ugly."*

It's **silent wrong math**.

A SQL syntax error is harmless — an agent fixes it in two seconds. The real nightmare is a query that runs cleanly in 15 milliseconds while silently:

- Multiplying revenue by `2.25×` because a `JOIN` fanned out on a non-unique dimension table (or exploding totals 6×–8× in a 3-table chasm trap).
- Averaging a percentage column (`AVG(conversion_rate)`) unweighted and missing Simpson's paradox.
- Reporting a `−79%` April revenue crash because April only has 6 days of data, or letting two $250k whale orders flip a regional ranking.
- Dropping 40% of orders on `WHERE discount_code != 'PROMO20'` because SQL excludes `NULL`s, or summing USD, EUR, GBP, and JPY together.
- Celebrating a statistically "significant" segment in a 20-segment A/B test whose randomization split is broken `52.5/47.5` (Sample Ratio Mismatch) and fails Holm-Bonferroni correction.
- Telling your VP that discounts hurt renewals (`−19.1 pp` naive!) when discounts were targeted at at-risk accounts and actually *lift* renewals by **`+8.0 pp`** once you control for customer health score.

I've seen every single one of those mistakes happen in real life — with humans and with frontier LLMs.

So I asked a simple engineering question: **What if TinyPivot MCP wasn't just an interactive Data IDE, but a deterministic, local Trust Layer that sits right beside DuckDB — catching silent BI and statistical traps before the model ever answers, cutting turns and latency instead of adding overhead, and proving every number with clickable lineage?**

## Designing an Honest, Unhinted Benchmark (Plus Official Adyen DABstep)

Our first benchmark mistake was telegraphing the traps in the prompt (*"watch for outliers"*, *"check validity"*). Real executives don't warn analysts where the landmines are — they ask *"Which region outperformed?"* or *"Should we ship variant B?"*

So we threw out the hinted prompts and built two rigorous evaluations:

1. **18-Task Unhinted Executive Benchmark (5 Models × 3 Arms = 270 runs):** Zero hints in any prompt, spanning three equal categories of realistic work:
   - **Routine BI (6):** Executive KPI summary, 6-day partial trailing April, 40% `NULL` anti-join, 2 whale orders ($500k) inverting East vs. West, 1.35× duplicate `event_id` rows, and mixed USD/EUR/GBP/JPY currencies.
   - **Relational Analytics (6):** 2.25× dimension fan-out, 3-table multi-fact chasm trap, unweighted conversion-rate average, Kitagawa mix-vs-rate Simpson's paradox, Search Console impression-weighted CTR & position, and survivorship-biased LTV.
   - **Hard Data Science (6):** 12-segment `54/46` SRM + p-hacking, subtle 20-segment `52.5/47.5` SRM + Holm-Bonferroni, confounded OLS causal reversal, right-censored monthly cohorts, 90-day seasonal structural break (`2026-02-18`, `−16.5%`), and whale-skewed revenue A/B test.
2. **Official External Benchmark — Adyen / Hugging Face `adyen/DABstep` Dev (60 runs):** 10 official labeled financial analytics tasks (3 easy, 7 hard) over a real **22 MB `payments.csv`** (138,236 rows), `fees.json` (1,000 nested fee rules), `merchant_data.json`, and `manual.md` — scored with Adyen's verbatim `question_scorer`.

We tested across **five models** — Mac-local `Inkling 2 Mini`, my home DGX Spark cluster (`DeepSeek V4.1 Flash 1017`), `Claude Haiku 5.5`, `Claude Sonnet 5.5`, and `Claude Opus 5.5` — comparing Baseline (`bare-sql` or vanilla `Python/Bash`), **TinyPivot Free**, and **TinyPivot Pro**.

## The Results (Measured Across 330 Total Runs)

### 1. 18-Task Unhinted Executive Benchmark (270 Runs)

| Model | Class | Baseline (`bare-sql` / Python) | TinyPivot Free | TinyPivot Pro | Baseline → Pro Impact |
|---|---|---|---|---|---|
| **Inkling 2 Mini** (fast) | Small Local (Mac) | 14/18 (78%) · 46.1s · 5.11t | 15/18 (83%) · 37.3s | **18/18 (100%)** · 26.0s · 4.22t | **+22 pts (Free +6) · −44% faster (3.8× Hard DS) · −50% out tok** |
| **DeepSeek V4.1 Flash** | Local Cluster (DGX Spark) | 17/18 (94%) · 25.7s · 4.94t | 17/18 (94%) · 27.7s | **18/18 (100%)** · 15.6s · 3.44t | **+6 pts · −39% faster (3.4× Hard DS) · −30% turns · −48% out** |
| **Claude Haiku 5.5** | Fast Cloud | 15/18 (83%) · 13.1s · $0.074* | 16/18 (89%) · 13.9s | **18/18 (100%)** · 12.5s · $0.083* | **+17 pts (Free +6) · −5% faster (−23% Hard DS)** |
| **Claude Sonnet 5.5** | Balanced Frontier | 18/18 (100%) · 20.0s · $1.22* | 16/18 (89%) · 18.0s | **18/18 (100%)** · 18.8s · $1.01* | **100% parity (no Bash) + lineage · −6% faster · −17% warm API*** |
| **Claude Opus 5.5** | Flagship Frontier | 18/18 (100%) · 21.5s · $2.32* | 18/18 (100%) · 21.9s | **18/18 (100%)** · 22.0s · $1.41* | **100% Free & Pro · −19% faster Hard DS · −39% warm API*** |
| **Combined (90 tasks/arm)** | **All 5 Models** | **82/90 (91%) · 25.3s** | **82/90 (91%) · 23.8s** | **90/90 (100%) · 19.0s** | **+9 pts overall · −25% faster · 2.1× faster Hard DS (80% → 100%)** |

*\*Claude 5.5 arms ran via local Claude Code subscription ($0 extra spend) with costs computed from published Anthropic API rates; `TinyPivot Free` ran additively alongside Claude Code's built-in `Bash` (matching real installs), while `TinyPivot Pro` ran MCP-only (`Bash` disabled) and still hit 54/54 (100%) across all three Claude models. Sonnet & Opus `tp-pro` reflect warm-session prompt caching (90% cache-read discount on repeated tool schemas).*

By category across all 5 models (30 model-tasks per arm):
- **Routine BI:** `93% (28/30)` → `93% (28/30)` Free → **`100% (30/30)`** with TinyPivot Pro (`17.4s` vs `17.7s`).
- **Relational Analytics:** `100% (30/30)` → **`100% (30/30)`** Free → **`100% (30/30)`** Pro with unweighted `AVG(rate/position)` guards and clickable Studio lineage.
- **Hard Data Science:** `80% (24/30)` → `80% (24/30, −15% faster)` Free → **`100% (30/30, +20 pts!)`**, **`2.1× faster`** (`39.7s → 19.3s/task`), **`−20% fewer turns`** (`5.40 → 4.33`), and **`−32% fewer output tokens`**.

### 2. Official External Benchmark: Adyen / Hugging Face `adyen/DABstep` Dev (60 Runs)

| Model | Vanilla Claude Code (Python/Bash) | TinyPivot Pro (DuckDB MCP) | Notes |
|---|---|---|---|
| **Claude Haiku 5.5** | 6/10 (60%) · Hard 4/7 | **7/10 (70%) · Hard 5/7** | **+10 pts** — solved hard fee-rule tasks `#1464` & `#1753` that vanilla Haiku missed |
| **Claude Sonnet 5.5** | 9/10 (90%) · Hard 6/7 | **9/10 (90%) · Hard 6/7** | 90% parity; faster & cheaper on hard task `#1464` (`11.0s` vs `11.6s`) |
| **Claude Opus 5.5** | 8/10 (80%) · Hard 6/7 | **8/10 (80%) · Hard 6/7** | Faster overall (`16.6s` vs `16.7s`); −37% faster & −23% cheaper on hard task `#2697` |
| **Combined (30 runs/arm)** | **23/30 (76.7%) · Hard 16/21 (76.2%)** | **24/30 (80.0%) · Hard 17/21 (81.0%)** | Scored with Adyen's verbatim `question_scorer` |

## What Optimizations Actually Moved the Needle

Running the benchmark surfaced three concrete MCP engineering bottlenecks that we fixed and re-verified:

1. **Exact-table analytical SQL + batch queries (`query.queries[]`):** Previously, `query({ sql })` defaulted to a 1-metric rounded ASCII chart card and hid extra columns (forcing agents into 7–11 follow-up turns!). Returning exact, full-precision (up to 14-decimal) Markdown tables automatically on analytical `query` calls while allowing up to 6 read-only `SELECT`s per batch cut turns and output tokens dramatically — and preserved exact 14-decimal precision for `DABstep`.
2. **Pro SQL-to-`analyze` Routing Guards:** When agents skip `load_file` and query a cohort, A/B experiment, or daily time-series CSV directly with raw SQL, `TinyPivot Pro`'s zero-overhead audit layer automatically flags right-censoring, SRM/Holm, or day-of-week seasonality risks and points to the exact 1-call `analyze(method, filePath)` shortcut. That single guard flipped **both** `Sonnet 5.5` (`16/18 → 18/18`) and `Inkling 2 Mini` (`ds_seasonal_changepoint`: `FAIL 9t/56.8s → PASS 5t/27.1s`)!
3. **Keeping TinyPivot Free strictly under 2,500 schema tokens:** All five statistical engines (`explain_change`, `ab_test` with SRM + Holm + top-1% whale trim, controlled OLS `regression`, right-censored `cohort_retention`, seasonal `anomalies`) live behind one zero-param `analyze` tool — keeping context overhead minimal for both cloud prompt caching and local models.

## Unlimited Local Rows on TinyPivot Free

An analyst evaluating a trust layer on a 22 MB CSV should never see partial totals. **TinyPivot Free includes unlimited local rows**, charts, pivots, DuckDB SQL, Studio IDE + Proof-of-Work Lineage, offline HTML export, basic SQL guardrails & repair hints, and `analyze(explain_change, ab_test)` — with no signup or trial clock.

**TinyPivot Pro** gates what serious analysts and teams actually pay for: deep relational & statistical audits (join fan-out, chasm traps, partial periods, silent NULL drops, duplicate IDs, mixed currencies, extreme outliers, and Pro `analyze` routing), the full Pro Data Science shelf, local **Recursive Data Memory** (−47% tokens on repeat schemas), closed-loop claim verification, 10 editorial themes, white-label HTML & `.xlsx` exports, and read-only PostgreSQL.

Read the full [Trust Layer White Paper & 5-Model + DABstep Benchmark Report](https://tiny-pivot.com/whitepaper) on [tiny-pivot.com](https://tiny-pivot.com), or try it locally in 10 seconds:

```bash
npx @smallwebco/tinypivot-mcp init
```
