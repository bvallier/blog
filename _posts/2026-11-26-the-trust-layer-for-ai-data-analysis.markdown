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
| **Inkling 2 Mini** (fast) | Small Local (Mac) | 14/18 (78%) · 46.1s · $0.027† | 15/18 (83%) · 37.3s · $0.059† | **18/18 (100%)** · 26.0s · $0.046† | **+22 pts (Free +6) · −44% faster (3.8× Hard DS) · −50% out** |
| **DeepSeek V4.1 Flash** | Local Cluster (DGX Spark) | 17/18 (94%) · 25.7s · $0.059† | 17/18 (94%) · 27.7s · $0.090† | **18/18 (100%)** · 15.6s · $0.055† | **+6 pts · −39% faster · −30% turns · −48% out · −7% API†** |
| **Claude Haiku 5.5** | Fast Cloud | 15/18 (83%) · 13.1s · $0.074* | 16/18 (89%) · 13.9s · $0.083* | **18/18 (100%)** · 12.5s · $0.083* | **+17 pts (Free +6) · −5% faster (−23% Hard DS)** |
| **Claude Sonnet 5.5** | Balanced Frontier | 18/18 (100%) · 20.0s · $1.22* | 18/18 (100%) · 22.1s · $0.88* | **18/18 (100%)** · 18.8s · $1.01* | **100% Free (−28%*) & Pro (no Bash) · −6% faster · −17% warm*** |
| **Claude Opus 5.5** | Flagship Frontier | 18/18 (100%) · 21.5s · $2.32* | 18/18 (100%) · 21.9s · $2.65* | **18/18 (100%)** · 22.0s · $1.41* | **100% Free & Pro · −19% faster Hard DS · −39% warm API*** |
| **Combined (90 tasks/arm)** | **All 5 Models** | **82/90 (91%) · 25.3s** | **84/90 (93%) · 24.6s** | **90/90 (100%) · 19.0s** | **+9 pts overall (Free +2) · −25% faster · 2.1× Hard DS** |

*\*Claude 5.5 arms ran via local Claude Code subscription ($0 extra spend) with costs computed from published Anthropic API rates; `TinyPivot Free` ran additively alongside Claude Code's built-in `Bash` (matching real installs), while `TinyPivot Pro` ran MCP-only (`Bash` disabled) and still hit 54/54 (100%) across all three Claude models. Sonnet & Opus reflect warm-session prompt caching (90% cache-read discount on repeated tool schemas).*
*†Local models ran at $0 marginal cost on local hardware; API-equivalent USD figures are imputed from exact recorded prompt/completion tokens using realistic multi-turn prefix caching at published 2026 `DeepSeek-Flash` Peak rates ($0.30/1M uncached in, $0.006/1M cache hit, $1.20/1M out) for DeepSeek V4.1 and comparable small-fast cloud API rates ($0.15/1M in, $0.075/1M cached, $0.60/1M out; GPT-4o-mini tier) for Inkling 2 Mini.*

By category across all 5 models (30 model-tasks per arm):
- **Routine BI:** `93% (28/30)` → `93% (28/30)` Free → **`100% (30/30)`** with TinyPivot Pro (`17.4s` vs `17.7s`).
- **Relational Analytics:** `100% (30/30)` → **`100% (30/30)`** Free → **`100% (30/30)`** Pro with unweighted `AVG(rate/position)` guards and clickable Studio lineage.
- **Hard Data Science:** `80% (24/30)` → `87% (26/30)` Free → **`100% (30/30, +20 pts!)`**, **`2.1× faster`** (`39.7s → 19.3s/task`), **`−20% fewer turns`** (`5.40 → 4.33`), and **`−32% fewer output tokens`**.

### 2. Controlled Same-Model A/B: MIT KramaBench (ICLR 2026, 248 Runs)

To test TinyPivot on a fresh, uncontaminated 2026 data-lake benchmark (not just our own 18 traps), we ran a controlled apples-to-apples A/B (`Vanilla Claude Code` with Read + Bash/Python vs. `TinyPivot Pro` on the **exact same base model**) across 4 multi-file data lakes from MIT's [**KramaBench** (ICLR 2026)](https://kramabench.org/) ([GitHub `mitdbg/Kramabench`](https://github.com/mitdbg/Kramabench) · [ICLR 2026 OpenReview Paper](https://openreview.net/forum?id=fZfUdeCC5X)): **Environment** (36 CSVs + txt), **Biomedical** (7 multi-sheet `.xlsx` workbooks + 1 CSV), **Archaeology** (3 CSVs + 2 `.xlsx`), and **Wildfire** (17 CSVs + `.xlsx` + `.json` + 2 `.gpkg` GeoPackages) — **62 tasks × 2 models × 2 arms = 248 runs**, scored verbatim with MIT's deterministic metrics (`Success`, `RAEScore`, `F1`).

| Model / Domain | Vanilla (`Read` + `Bash`/`Python`) | TinyPivot Pro (`v0.8.4`) | Delta |
|---|---:|---:|---:|
| **Claude Haiku 5.5 — Biomedical** (`n=9`, 7 `.xlsx`) | `66.7%` (`67.7s`) | **`88.9%`** (**`31.6s`**) | **`+22.2 pts` · `2.14×` faster** |
| **Claude Haiku 5.5 — Archaeology** (`n=12`, CSV + `.xlsx`) | `41.7%` (`16.0s`) | **`50.0%`** (`17.1s`) | **`+8.3 pts`** (beats Sonnet) |
| **Claude Haiku 5.5 — Environment** (`n=20`, 36 CSVs) | `78.0%` (`17.9s`) | **`83.3%`** (`22.5s`) | **`+5.3 pts`** |
| **Claude Haiku 5.5 — Wildfire** (`n=21`, incl. `.gpkg`) | **`85.7%`** (`16.3s`) | `84.4%` (`20.1s`) | `-1.3 pts` (geospatial `.gpkg`) |
| **Claude Haiku 5.5 Overall (`n=62`)** | `71.9%` (`24.2s` · `$4.21*`) | **`78.0%`** (**`21.9s`** · `$5.28*`) | **`+6.1 pts` · `10%` faster (8–5 H2H)** |
| **Claude Sonnet 5.5 — Environment** (`n=20`) | `90.0%` (`13.1s`) | **`95.0%`** (`17.0s`) | **`+5.0 pts`** |
| **Claude Sonnet 5.5 — Biomedical** (`n=9`, 7 `.xlsx`) | `100.0%` (`31.3s`) | **`100.0%`** (**`26.4s`**) | **Tie · `16%` faster** |
| **Claude Sonnet 5.5 Overall (`n=62`)** | `82.6%` (`17.5s` · `$10.63*`) | **`83.8%`** (`19.2s` · `$12.88*`) | **`+1.1 pts` (2–1 H2H)** |
| **Combined 2-Model Overall (`n=124` paired)** | `77.3%` (`20.9s`) | **`80.9%`** (`20.6s`) | **`+3.6 pts` (10–6 H2H)** |

Notice the model-tier finding: **`Haiku 5.5 + TinyPivot Pro` (`78.0%`, `$5.28*`) closes 57% of the gap to `Vanilla Sonnet 5.5` (`82.6%`, `$10.63*`) at half the API cost** — driven by lightweight, zero-bloat upgrades (`profile(dirPath)` 1-call folder schema discovery, direct `.xlsx` sheet loading into DuckDB, and stateful named `query` views) with zero Jupyter servers, VLMs, or multi-agent ensembles. *(For context, the #1 public leaderboard system on [kramabench.org](https://kramabench.org/) — RADAR on DeepSeek-V4-Flash — scores `83.3%` Environment, `73.7%` Wildfire, `50.0%` Archaeology, and `66.7%` Biomedical across the public dataset; our run is a 4-domain controlled A/B rather than an official 6-domain obscured submission.)*

### 3. Official 450-Task Blind Leaderboard: Adyen / Hugging Face `adyen/DABstep`

We also ran and submitted all **450 blind questions** on the official [Adyen / Hugging Face `adyen/DABstep` Leaderboard](https://huggingface.co/spaces/adyen/DABstep) (22 MB `payments.csv` + 1,000 nested fee rules, scored blindly by Adyen and published in `adyen/DABstep` `data/task_scores/`):

| Live Adyen Submission | Easy (`72`) | Hard (`378`) | Total (`450`) | Context vs Validated Top 9 |
|---|---:|---:|---:|---|
| **TinyPivot MCP Pro — Claude Sonnet 5.5** | **`97.22%`** (`70/72`) | **`68.78%`** (`260/378`) | **`73.33%`** (`330/450`) | **#1 Easy · #3-equiv Hard** (ahead of GPT-5 `57.7%` & Google `DS-STAR` `45.2%`) |
| **TinyPivot MCP Pro — Claude Haiku 5.5** | `88.89%` (`64/72`) | **`38.62%`** (`146/378`) | `46.67%` (`210/450`) | **#8-equiv Hard** (`~2×` Claude 4 ReACT `19.8%`; Dev A/B `+10 pts` `60% → 70%`) |
| **TinyPivot MCP Pro — DeepSeek V4.1** *(DGX Spark local)* | **`90.28%`** (`65/72`) | **`24.34%`** (`92/378`) | `34.89%` (`157/450`) | **Beats Claude 4 ReACT locally** at `$0` cloud spend (higher Easy % than KGMON `87.5%` & DataPilot `86.1%`) |

*Honest attribution:* On `DABstep`, `Sonnet 5.5`'s absolute `97.2%` Easy / `68.8%` Hard score reflects strong base-model reasoning paired with TinyPivot's DuckDB workflow (our 10-task Dev A/B showed `90%` parity on Sonnet, `80%` parity on Opus, and `+10 pts` on Haiku `60% → 70%`). Pairing `DABstep` (third-party blind parity) with our controlled same-model **Bench v2 (`91% → 100%`)** and **MIT KramaBench (`77.3% → 80.9%`, Haiku `+6.1 pts`)** keeps the attribution clean and honest.

## What Optimizations Actually Moved the Needle (Shipped in `v0.8.4`)

Running these benchmarks surfaced five concrete, lightweight MCP improvements — **all with zero new npm dependencies and strictly under 2,500 Free schema tokens**:

1. **Exact-table analytical SQL + batch queries (`query.queries[]`) & stateful named views:** Analytical `query` calls return full-precision Markdown tables (up to 60 narrow rows / 14 decimals) and batch up to 6 read-only `SELECT`s per call, while named `query({ sql, name })` results now persist automatically as DuckDB views across turns.
2. **1-call local data-lake folder profiler (`profile({ dirPath })`):** Scans CSV, TSV, JSON, JSONL, Parquet, and `.xlsx` schemas via DuckDB `DESCRIBE` + ExcelJS without pasting raw rows into context, lists nearby docs, and (on Pro) surfaces cross-file shared join keys — flipping `Sonnet 5.5` on KramaBench `Environment` from `90% → 95%`.
3. **Direct `.xlsx` workbook reading into DuckDB (`load_file({ filePath, sheet })`):** Reuses TinyPivot Core's already-bundled `exceljs` so agents query multi-sheet Excel workbooks straight in DuckDB SQL — lifting `Haiku 5.5` on KramaBench `Biomedical` by **`+22.2 pts` (`66.7% → 88.9%`) and `2.14×` faster**.
4. **Pro SQL-to-`analyze` Routing Guards:** When agents skip `load_file` and query a cohort, A/B experiment, or daily time-series CSV directly with raw SQL, `TinyPivot Pro`'s zero-overhead audit layer automatically flags right-censoring, SRM/Holm, or day-of-week seasonality risks and points to the exact 1-call `analyze(method, filePath)` shortcut.
5. **Headless / No-Studio mode (`--no-studio` / `TINYPIVOT_NO_STUDIO=1`):** Running hundreds of automated benchmark sessions opened dozens of Studio browser windows. Passing `--no-studio` (or `TINYPIVOT_NO_STUDIO=1`) disables the localhost Studio HTTP server completely (zero ports, zero popups), while `--no-open` (`TINYPIVOT_OPEN_STUDIO=0`) keeps Studio running quietly without auto-popping tabs.

## Unlimited Local Rows on TinyPivot Free

An analyst evaluating a trust layer on a 22 MB CSV should never see partial totals. **TinyPivot Free includes unlimited local rows**, charts, pivots, DuckDB SQL, Studio IDE + Proof-of-Work Lineage, offline HTML export, basic SQL guardrails & repair hints, and `analyze(explain_change, ab_test)` — with no signup or trial clock.

**TinyPivot Pro** gates what serious analysts and teams actually pay for: deep relational & statistical audits (join fan-out, chasm traps, partial periods, silent NULL drops, duplicate IDs, mixed currencies, extreme outliers, and Pro `analyze` routing), the full Pro Data Science shelf, local **Recursive Data Memory** (−47% tokens on repeat schemas), closed-loop claim verification, 10 editorial themes, white-label HTML & `.xlsx` exports, and read-only PostgreSQL.

Read the full [Trust Layer White Paper & 5-Model + DABstep Benchmark Report](https://tiny-pivot.com/whitepaper) on [tiny-pivot.com](https://tiny-pivot.com), or try it locally in 10 seconds:

```bash
npx @smallwebco/tinypivot-mcp init
```
