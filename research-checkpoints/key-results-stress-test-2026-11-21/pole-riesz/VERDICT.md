# pole-riesz: verdict (2026-11-20)

Claim as listed: "The pole of zeta forces Riesz-type truncations to fail."

## Statement the material supports

Let k >= 1 be an integer, M = N+1, L = log M, w_n = (1 - log n/L)^k, D_N(s) = sum_{n<=N} w_n n^-s,
A_N = D_N - k! M^(1-s)/((1-s)^(k+1) L^k), G(s) = s(s-1)/2 pi^(-s/2) Gamma(s/2), F_N(s) = G(s)A_N(s) + G(1-s)A_N(1-s).

1. Certified (Arb interval Newton in the lane; replayed here with independent mpmath code): for k = 2 and N = 630, 1000, 1250, 1500, 4000
   F_N has a zero with Re s > 1/2 near height 875729722967011/1024 = 8.55 * 10^11 (N = 1250: Re s = 0.541482496858).
   Also replayed: N = 300 at height 10^1006.99 (Re s = 0.503137471799) and N = 284 at height 10^2989.455 (Re s = 0.50041199238), winding number 1.
   The lane lists further certified zeros (k = 2: N = 292 .. 4000 at other heights; k = 3: N = 5000, 10000), not replayed.
2. Certified signs: f_{k,N}(1/2) = sum_{n<=N} w_n lambda(n) n^-1/2 is positive at N = 36, 291, 2183, 16237 and negative at N = 37, 292, 2184,
   16238 for k = 1, 2, 3, 4, with f_{k,N}(0.99) > 0: the Bohr lift of D_N has a real zero in (1/2, 0.99) at the Liouville torus point.
   Float64: negative for all N from the threshold to 3 * 10^6, k = 1..6.
3. Argued in the lane's notes, not refereed, constants not tracked, N_0(k) not effective: for every integer k >= 1 and N >= N_0(k),
   F_N has infinitely many zeros off the critical line (Perron asymptotic L f_N(1 - w/L) -> zeta(2)(k - w), Hurwitz, Kronecker + Rouche).
4. Lean (no sorry): only sum lambda(n) n^-s = zeta(2s)/zeta(s) on Re s > 1, its limit 0 at s = 1 and its negativity on (1/2, 1).
   These are classical; items 1-3 are not formalised.

## What the headline gets wrong

- "The pole of zeta" is shorthand. The pole-correction term of the section plays no role: removing it leaves the certified zeros unchanged to
  12 digits. The operative fact is that zeta(2s)/zeta(s) vanishes at s = 1, i.e. the divergence of sum 1/p. An entire L-function fails the
  same way (chi_4 torus: Liouville sum negative from N = 375). A finite set of primes does not fail persistently (P <= 31: never negative;
  P = 97: negative only for 576 <= N <= 1680).
- "Riesz-type" is narrower than the effect. Sharp, k = 1/2, (1-x^2)^2, C-infinity bump and cos^2 cut-offs in x = log n/log(N+1) all show the
  same real zero at the Liouville point (float64, N up to 3 * 10^6).
- "Fail" means: the FE-symmetrised sections are not real-rooted at very large height (found: >= 8.55 * 10^11 for k = 2; 10^2989 at N = 284).
  It says nothing about zeros of zeta, and the property is shared by every unimodular completely multiplicative twist, so it does not
  distinguish zeta from controls. Below height about 2 pi N the sections track xi and no failure is reported.

Weaker true statement: "For log-Riesz weights of integer order k >= 1, the functional-equation-symmetrised sections of zeta have zeros off the
critical line for the stages listed (certified), and for all large stages by an unrefereed argument; the cause is a torus (Bohr-Kronecker)
effect at the Liouville twist, common to all unimodular twists, and is the same mechanism as Turan-Haselgrove-Montgomery for sharp partial sums."

## Replay
See NOTES.md sections 2-3; scripts liou.py, zero_check.py, controls.py, small2.py and their .out files in this folder. All through memcap 8 GB.

## Literature
Turan 1948; Haselgrove 1958; Montgomery 1983; Montgomery-Vaughan 2001; Spira 1966-68; Gonek-Montgomery 2013; Platt-Trudgian 2016;
Mossinghoff-Trudgian and Humphries on sum lambda(n) n^-alpha. The mechanism is classical. The specific log-Riesz, FE-symmetrised statement
with zeros in (1/2, 1) was not found in four general searches; this was a short search, not a survey.

## Scores
Arbitrariness 3. The mechanism is not tied to the chosen weights (all cut-offs tried fail), which lowers arbitrariness; but the object
(F_N with cut at N+1, this pole term, integer k), the thresholds 37/292/2184/16238, the height 8.55e11 and the "first stage 284" are
artefacts of the family and of the search, and the causal label "pole" is a framing choice.
Importance 2. It closes one internal candidate route (real-rootedness of Riesz sections + Hurwitz). No consequence for RH or for bounds on
the de Bruijn-Newman constant. A specialist would recognise it as an instance of the Turan/Bohr mechanism and of the Spira/Gonek-Montgomery
picture, and would expect the outcome.

Status: certified instances (interval arithmetic) plus an unrefereed general argument. Verification: confirmed for the instances replayed;
the general theorem was checked only numerically for consistency.
