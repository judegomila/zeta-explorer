# REFEREE: semilocal-sonine (second pass, 2026-11-20/21)

Verdict on the first reviewer's verdict: not faulted on substance. "confirmed" stands, now on stronger evidence than the
first pass had. Scores unchanged (arbitrariness 2, importance 2, known-in-different-form). Details and one sharpening below.

## 1. What the first pass did and did not test
The first pass tested three pieces separately: (i) the log-weighted kernel has multiplier 2theta' - m_p (40-digit, independent);
(ii) the si double sum equals a truncated Delta-quadrature; (iii) the assembled multiplier is >= 0 on a grid, mismatched variants
are not. Its Galerkin replay is the repository code path (not independent; the reviewer says so). None of these evaluates the
left side Tr(theta(f) P Phat_S P) itself. Positivity plus failing controls is a necessary-condition test, not a test of equality.

## 2. Independent end-to-end test (new; scripts in referee/)
For g(r) = r^a e^{-pi r^2}, f = g*g^* = (Gamma(a)/2) pi^{-a} (rho/(1+rho^2))^a (Schwartz-type, not compactly supported):
  LHS = ||P F_S P theta(g)||_HS^2 = int d*mu int_1^oo |F_S eta_mu(w)|^2 dw,  eta_mu(x) = x^{-1/2} g(x/mu) 1_{x>=1},
  F_S eta(w) = (1/2) sum_{n>=0} etahat(2^n w) - (1/2) etahat(w/2),
computed on the Fourier side: etahat in closed form (complex erfc, Arb 400 bits), dyadic Gauss-Legendre in w resolving
arguments up to 2^M, analytic endpoint asymptotics beyond (diagonal terms only; cross terms O(4^-M)), GL in log mu on [0.25, 80]
plus power tail. No si() formula, no Delta/Sigma decomposition, no repository code. (lhs.py, drive.py)
  RHS = (1/2pi) int |ghat|^2 (2theta' - m_2) dt + 2 int_1^oo f(rho) delta_S(rho) d*rho, own delta_S (scipy sici, expm1 near
resonances), graded mesh at every 2^k. (rhs.py)

Pipeline control, S = {oo} (published CC 2021 identity), a = 5/2: LHS 3.491159660e-4, RHS 3.491159654e-4 (diff 6e-13).

S = {oo, 2}, a = 5/2:  W_oo = -1.65771989e-2, W_2 = -4.58976614e-3 (t-space and rho-space agree to 1e-18), D_S = 2.16633450e-2.
  LHS: M=8 4.963805644e-4, M=10 4.963800530e-4, M=11 4.963800275e-4
  RHS: inner subdivision 4 / 16 / 48 per dyadic panel: 4.963799253e-4 / 4.963803059e-4 / 4.963799806e-4
  |LHS - RHS| ~ 5e-11 .. 3e-10 = 1e-7 .. 6e-7 of L, 2e-9 .. 1.4e-8 of D_S.
S = {oo, 2}, a = 3/2:  LHS (M=8, 10) 1.97639692e-3, 1.97639529e-3; RHS (inner 6, 12) 1.97639900e-3, 1.97639280e-3; agreement ~2.5e-9 (1.3e-6 of L).

So the identity (with Phat_S = F_S^{-1} 1_{[1,oo)} F_S) holds numerically end to end for two test functions; the remainder
D_S is 44x (a=5/2) and 56x (a=3/2) larger than L, so the test is sensitive to delta_S at the 1e-8 level.

Trap found in my own run (reported because it bears on the repository numerics): with one 12-point GL panel per dyadic
shell near each spike the D_S quadrature returns 4.96331e-4 for the RHS, wrong by 4.9e-8 (1e-4 of L), stable under every other
refinement. delta_S carries oscillations at all dyadic frequencies in every shell (terms cos(2 pi 2^n(rho-2^k))/(2 pi 2^n (rho - 2^k))^2);
they must be resolved or the error does not decay. The first reviewer's and the repository's deltahat_S values (0.0652 vs
0.0650-0.0653, resonance defect 1.6e-3 vs 1.96e-3) differ at the 1e-4..1e-3 level; the quoted digits of Lhat_S beyond ~3 are
not established by either. Sign of Lhat_S is not in doubt (it is forced by the HS-norm form once the identity holds).

Convention check: with the module's literal definition Phat_S = F_S P_1 F_S (band-limiting) the mu-integral of
int_0^1 |F_S eta_mu|^2 tends to ||g||^2 per unit log mu and diverges. The first reviewer's error item 1 is correct.

## 3. Literature (my own searches: 5 web queries; read arXiv:2611.13129 sections 8.1-8.2 from the PDF; CC 2021 text)
- arXiv:2611.13129 (Andrews, Connes, La Gatta, Nov 2026), Thm 8.1, attributed to Connes 1999 and Connes-Marcolli (2008) Lemma 2.35 /
  Thm 2.36: for h = f*f^*, theta(h)(1 - P - Phat) on L^2(X_S)^{K_S} is trace class and sum_{v in S} W_v(h) = -Tr theta(h)(1-P-Phat)
  = -(1/2) Tr theta(h) u^*[H,u], any finite S. This is the same exact scale-1 semilocal formula; the repository identity is that
  formula with the Connes-Consani 2021 Prop 2.2 split into a positive compressed trace and a remainder. Lemma 8.2 there gives the
  dependence on the cutoff scales (-log(tw) h(1)). Lemma 8.6: semilocal kappa_n = O(n^{-1/2}), sum kappa_n^2 = oo, i.e. Tr(P Phat_S P)
  diverges logarithmically, which is the rho = 1 spike of delta_S. Order-1/2 infinitesimal: Connes-Consani, Quasi-inner functions and
  local factors (arXiv:2008.10974), Thm 4.4 (cited there; I did not open that PDF).
- Trace-class input for S: confirmed only through the quotation in 2611.13129 ("the proof of Theorem 2.36 shows hhat (1/2)u^{-1} dbar u
  is trace class for every Schwartz h"); the Connes-Marcolli book itself was not opened by either reviewer.
- Not found by me either: the explicit si double sum for delta_S at S = {oo,2}; log singularities at rho = 2^k, k >= 1, with
  slope 2^{k/2}/2. Search was not exhaustive. Classical keywords (Li, Nyman-Beurling, de Bruijn-Newman, Pick, Krein) are not relevant
  to this object; it lives entirely in the Connes semilocal framework.
- Priority note: the repository module is dated 2026-09-23, before 2611.13129, but the formula is in the 2008 book; no novelty claim follows.

## 4. Scores
- Arbitrariness 2 (kept). Fixed once S and cutoff scale 1 are chosen; holds for every p and for twisted factors. The split L_S vs D_S
  moves with the cutoff scale. The 96.7% / 99.71% "saturation" figures and mu_max depend on scale, basis and support and would
  score 4 on their own; they are not part of the identity.
- Importance 2 (kept; 1 is defensible). An expert in this area would recognise the published formula. It constrains nothing: no
  positivity past support ln 2, nothing about RH or Lambda. What remains is an explicit kernel for one case.
- Status: derivation in notes (formal manipulation of a divergent cosine-series kernel) + published trace-class theorem + numerical
  end-to-end check. No Lean, no interval certificate.

## 5. One-line (says no more than is established)
For the places {infinity, 2}, the known scale-1 semilocal trace formula splits as a positive compressed trace equal to the two local
Weil terms plus an explicit remainder with logarithmic singularities at powers of 2; this was checked numerically end to end and gives
no new positivity.

## 6. Files
referee/lhs.py, referee/drive.py, referee/rhs.py, referee/*.json (outputs), referee/dl/acl2611.{pdf,txt}. All runs under scripts/memcap.sh 8.
