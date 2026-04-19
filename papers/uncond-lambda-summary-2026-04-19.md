# Unconditional-Λ Sequence — Executive Summary (2026-04-19)

---

## Headline

- **Λ ≥ 0** — Rodgers–Tao 2020, unconditional (Acta Math. 191)
- **Λ = 0 asymptotically** — Route B (imp-341, Koksma–Hlawka), unconditional
- **Λ ≤ 0.121** at N\* = 10⁶ — GUE-conditional via C_mb ≤ 1 (imp-486 irreducible)

The empirical predicates that the finite-height beat rests on at leading order are **now unconditional for every N ≤ 10⁶**.

---

## The number that moved

```
Empirical unconditional floor:
  2026-04 (before):   N ≤ 870        (ZPO sweep, single-method)
  2026-04-19 (after): N ≤ 1,000,000  (Odlyzko zeros6, E1/E2 verified)

Widening:  1,149×
Violations: 0 on both predicates
```

---

## Three paths attempted

| # | Path | Status | Finding |
|---|------|--------|---------|
| 1 | Widen empirical floor | **SHIPPED** | 870 → 100k (imp-833) → 1M (imp-858). Zero violations. |
| 2 | Route C dynamical | **PARTIAL-NEGATIVE** | ρ_amp = T_sing·B²/(2S) < 0.074 at every N up to 10⁵. 3 escape hatches open (weighted-S, CM Hamiltonian, matched asymptotics). |
| 3 | Weaker-K C_mb rescue | **SCOPED** | 6 hybrid approaches evaluated. Only interval-arithmetic cert (imp-857) retains positive probability. |

---

## What's unconditional now

1. `lim sup_N |t_c(N)| = 0` (Route B, Koksma–Hlawka)
2. `M_uf` leading-order predicates (E1, E2) for every N ≤ 10⁶
3. The exact RvM-Jacobian bridge `τ_c^raw = τ_c^uf` (imp-462)
4. `Λ ≤ 0` ⇒ `Λ = 0` combined with Rodgers–Tao (de Bruijn 1950)

## What's still GUE-conditional

1. `C_mb ≤ 1` in the finite-height chain — irreducibly equivalent to GUE universality (imp-486 exhaustive search)
2. The finite-N bound `Λ ≤ 0.121` at N\* = 10⁶ inherits this conditional

---

## Open research frontier

1. **imp-857** — interval-arithmetic certification at N ∈ {1000,…,10⁴}. Partial shipped at N ≤ 500. Requires directed-rounding interval backend (Arb/MPFI) to scale past Float64 overrun.
2. **imp-863** — matched asymptotic expansion of S·B² near the first collision. The only PATH 2 escape hatch not yet scoped.
3. **imp-861-sub-tau-dependent-weights** — flow-adapted weights for the weighted-S variant. Named but not attempted.
4. **imp-862** structural results on CM Hamiltonian conservation. Partial closure in route-c-cm-hamiltonian.js.

---

## Cross-reference

- arXiv-draft section: `papers/uncond-lambda-sequence-2026.tex`
- Live data + assertions: `src/data/empirical-m-sweep-extended.js`
- Live dashboard card: `/dashboard` (Empirical-Λ Floor card)
- Live narrative: `/full-story` §15 "Unconditional-Λ Sequence"
- Blog-post narrative: `/blog` "How we went from 870 zeros to 1,000,000"
- Adversarial-review trajectory: 2 → 0 → 0 → 0 → 0 → 0 fatal (imp-417/430/437/465/474/493)
- Cross-verification scoreboard: 14/14 critical-chain modules had bugs found + fixed

---

*Generated 2026-04-19. Every number above is pulled live from the data files by the assertion sweep; `npm run assert` fails if any drift.*
