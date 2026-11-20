# Zero-line certificate: every zero below height 2000

`scripts/experiments/zero-line-certificate.py` produces
`dist/zero-line-certificate.js` and `dist/experiments/zero-line-certificate.json`.
It uses Arb ball arithmetic (through python-flint): every evaluated value is a
ball that provably contains the true value, so the conclusions below do not
depend on sampling density or rounding.

## Statement

Let `t_1 < … < t_1517` be the heights of the zeros of ζ below 2000, each given
as an exact binary double, and `r_k` the listed radii. The first 25 pairs are
the tracked heights in `dist/math.js` with the trap radii from `trapDiscs` in
`dist/zero-traps.js`; the rest are listed in
`dist/experiments/zero-line-certificate.json`. Let
`D_k = { |s − (½ + i t_k)| ≤ r_k }`.

1. Each `D_k` contains exactly one zero of ζ, counted with multiplicity. That
   zero is on `Re s = ½` and is simple.
2. ζ has exactly 3034 zeros in the rectangle `[−1, 2] × [−2000, 2000]`: the
   1517 zeros of (1) and their complex conjugates. Hence every zero of ζ with
   `0 < Im s < 2000` is on the critical line and is simple.

## Why it holds

**One zero per disc.** ζ is holomorphic on `D_k` (its only pole is `s = 1`).
The script proves ζ ≠ 0 on the boundary circle and that the winding number of
ζ around it is exactly 1, so by the argument principle `D_k` holds exactly one
zero.

**On the line.** In `D_k` the factor `½ s(s−1) π^{−s/2} Γ(s/2)` has no zeros or
poles, so ζ and ξ have the same zeros there. ξ satisfies
`ξ(1 − s̄) = conj ξ(s)`, and `s ↦ 1 − s̄` maps `D_k` to itself, fixing exactly
the points of the critical line. An off-line zero would have a distinct mirror
zero in the same disc, giving two. So the single zero is on the line, and
multiplicity one means it is simple.

**Nothing else below 2000.** Around the rectangle the script proves ζ ≠ 0 on the
boundary and winding number 3033. The only pole inside is the simple pole at
`s = 1`, so the rectangle holds 3033 + 1 = 3034 zeros. The discs `D_k` and their
conjugates are 3034 pairwise disjoint discs inside the rectangle, each holding
one zero (`ζ(s̄) = conj ζ(s)`), so there are no others. Zeros of ζ with
`0 < Im s < 2000` have `0 ≤ Re s ≤ 1` and therefore lie in the rectangle.

## How a winding number is certified

The boundary is cut into pieces. For a piece `P` from `a` to `b`, the script
encloses `P` in a ball `B` and checks `Re( ζ(B) / ζ(a) ) > 0`. Then `ζ(P)`
stays in an open half-plane through `ζ(a)`, so the continuous change of
`arg ζ` along `P` equals the principal argument of `ζ(b)/ζ(a)`. Pieces that
fail the check are bisected. The summed change, divided by `2π`, is a ball
that must isolate a single integer.

## Scope

- `τ = 0` only. For the heat family the only interval record remains the
  first-zero witness in `experiments/zero-channel-bounds.json` (`|τ| ≤ 0.05`).
- A trap is shown as certified only when its centre and radius equal a recorded
  disc bit for bit, and only if the browser's own floating-point count also
  gives one.
- Centres beyond the app's 25 come from Arb's zero finder, which only proposes
  them; each disc is proved by its own winding number.
- Finite height. This reproduces, for the first 1517 zeros, a classical
  verification that has been carried far higher by others. It says nothing
  about zeros above height 2000 and is not a proof of the Riemann hypothesis.
- Height 2000 is the limit of the app's evaluator, so every zero the app can
  display is covered.
- The rigour rests on Arb's enclosures and on the script's logic; it has not
  been formalised in a proof assistant.

## Reproduce

```
python -m venv .venv && .venv/bin/pip install python-flint
.venv/bin/python scripts/experiments/zero-line-certificate.py
```

It takes about three minutes.

## Write-up and geometry check

`paper/zero-traps.tex` (PDF alongside) is a short note giving the full
argument: the trap lemma, how a winding number is certified, the three
computed facts and what must be trusted.

`scripts/experiments/check-certificate-geometry.py` verifies, in exact
rational arithmetic and with the standard library only, that the recorded
discs are pairwise disjoint and lie inside the upper half of the rectangle,
and that the recorded windings are consistent (1 per disc, 3033 for the
rectangle).
