# REFEREE2: c14-joint-pair-design-ratio-vortex-cross-bridge

Independent referee, 2026-11-19; verdicts formed before the lane's REFEREE.md was opened. Not a statement about
zeros of zeta.

## Verdict: HOLDS WITH SCOPE LINE

Scope line (exact): "Lemma A is PROVED-rel a density theorem that was recalled and not opened, with the exponent
theta(sigma) = 3(1 - sigma)/(2 - sigma) valid for 1/2 <= sigma <= 4/5 only; for sigma_0 > 4/5 the hypothesis is
theta' > 2(1 - sigma_0)/sigma_0 (second range as recalled) or theta' > 1/2 (monotonicity). Identity TW is proved
for chi primitive, c supported on (m, q) = 1; its second display (conductor term log q, gamma kernel) is for chi
even. Lemma C is for a finite set of characters, with p0 depending on the set."

## Lemma C (PROVED): holds

Re-derived. With D(s) = 1 + c p0^(1/2) p0^(-s) + p0 p0^(-2s), the coefficients of zeta D twisted by a completely
multiplicative chi are those of L(s, chi) D_chi(s), D_chi(s) = 1 + c chi(p0) p0^(1/2-s) + chi(p0)^2 p0^(1-2s). If
chi(p0) = 1 then D_chi = D and the ratio of the pair is L(s, chi)/zeta(s) identically. Zeros of D: p0^(1/2-s) = x,
x + 1/x = -c, x real negative; inside the open strip and off the line iff 2 < c < p0^(1/2) + p0^(-1/2). A prime
p0 = 1 mod lcm of the conductors exists (Dirichlet).
Check (`ref2_checks.json` item2; s = 3 + 2i; chi the real character mod 5): p0 = 11, c = 2.5: abs(ratio - L/zeta)
= 1.7e-7 at 2,000 terms and 1.7e-9 at 20,000 terms (the truncation rate); p0 = 3 (chi(3) = -1), c = 2.2: 0.309 at
both truncations, as the lemma says (D_chi != D). Zero of D for (11, 2.5): Re s = 0.789.
Scope: the statement "every functional of finitely many ratios takes the same value" is about the coefficientwise
pair lift; a lift that twists zeta and leaves D fixed is not a twist of zeta D.

## Identity TW (PROVED): holds

Re-derived. For integers n >= 1, m, m' <= M with n m' != m: abs(log(n m'/m)) >= log(1 + 1/M) (if n m' > m the
ratio is at least (m+1)/m; if n m' < m it is at most (m-1)/m). So (g_c * g_c~)(log n) = norm(phi)^2 sum_{m = n m'}
c_m conj(c_m'), and for the twisted coefficients the summand gains chi(n m') conj(chi(m')) = chi(n) when
(m', q) = 1. If (n, q) > 1 both sides vanish because c is supported on (m, q) = 1. Hence P_chi(g_c) =
P_zeta(g_(c chi)).
Check (item2, M = 6, a C-infinity bump of half-width log(7/6)/2, random complex c; chi real even mod 5 and chi
complex odd mod 7): P_chi(g_c) and P_zeta(g_(c chi)) agree to all printed digits (defect 0.0) with (grid 4,001,
n <= 40) and with (grid 16,001, n <= 120); max over n of abs(auto_twisted(log n) - chi(n) auto(log n)) <= 1e-17;
auto(log n) = 0 for every n > M; norm(g_c)^2 = norm(phi)^2 norm(c)^2 to 3e-15.
Scope: the second display of (TW) is stated for chi even; the identity of prime sides holds for both parities.
The step is an identity (line 11 of Statement O, mode (I)) and holds for every F whose twist has an explicit
formula; the lane says so.

## Lemma A (PROVED-rel): holds with the scope line

The proof (average the comparison over X_q, bound by the sum over all characters, integer on the left) is
correct. The exponent: theta(1/2) = 1, theta(4/5) = 1/2 = 2(1 - 4/5)/(4/5), so the two ranges match at 4/5; the
first formula used above 4/5 would give 0.273 at sigma = 0.9 against 0.222 from the second range: it is not what
the theorem gives there and must not be printed without the range. At sigma_0 = 1/2 the hypothesis theta' > 1
cannot be met (at most phi(q) characters). The source (Montgomery, Topics in Multiplicative Number Theory, Theorem
12.1) was not opened by me either: two searches with generic terms returned the book record and no text of the
theorem. My recollection of it agrees with the lane's (log powers 9 and 14, uniform in q >= 1, T >= 2). Label
stays PROVED-rel, "recalled twice, not opened".
Lemma B rests on the same theorem; same label.

## Other statements read

- Cross Gram rank (3.2): the Cauchy-matrix argument is correct for finite simple pole sets. Holds as stated.
- First lemma (2.2): log Q = log L - log zeta; holds.
- Section 2.6 table, DH row: MEASURED on five moduli; the sentence "controls with the functional equation ... fail
  link 2 and never link 1 in its q^theta' form" is ARGUED for E_a and undecided for DH (the lane says so). No flag
  depends on it.

## Label restrictions

1. Lemma A: add the range; map row G38 must not print "theta' > 3(1-sigma)/(2-sigma)" without "sigma <= 4/5".
2. TW: "chi even" on the second display.
3. Lemma C: "finite set of characters; p0 depends on the set".

## Comparison with the lane's REFEREE.md (read afterwards)

It makes the same restriction on Lemma A. No disagreement.
