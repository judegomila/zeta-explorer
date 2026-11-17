# REFEREE: r3-higher-rows-dual (2026-11-16)

Verdict of the note: precise obstruction, no abscissa. Referee result: **the obstruction verdict survives; the claim as
labelled does not hold in full.** Two PROVED-rel steps of Theorem A are not confirmed by the sources cited for them, and
one MODEL row contradicts the note's own Corollary B1(d). No abscissa is affected: 7/8 and 0.874886647 (both
unrefereed) stand. RH open.

## What was checked

| item | method | outcome |
|---|---|---|
| dFDH arXiv:2607.07911v2 (6.8), (6.9), (6.12), (6.14)-(6.16), Thm 1.1, 1.2, (1.8), (8.4) | read in `dl/2607.07911v2.txt` | quoted correctly |
| Lemma 5.8 of the 7/8 manuscript (5.36) | read `~/lean-deps/qrh-verify/paper.txt` 2549-2567 | exponent O/2 + max{M-O, 2M-O-N}; square-root iff M <= N. Matches section 2. Consistent with a = 2: reflected length 2M-N |
| class map e* = -e-2 mod n, (R') | read `cubic-r2-conductor-verdict.md` 2.2, 2.4 | n = 4, e = 3: e* = 3, clean case e = n-1, exponent 3. Confirmed. n = 10, e = 6: e* = 2, main 6, secondary up to 9. Consistent |
| Lemma Q3 / Q2(e): c_a = mu gamma_1 xi equals alpha gamma_2 xi gamma_{-1} | algebra | confirmed |
| Theorem B, coprime pairs | re-derived: g(psi; k) = conj psi(k) g(psi), CRT factorisation, g(conj chi) = chi(-1) conj g(chi); c_a conj g(chi_a) = mu xi sqrt(N a); prefactor (Q/N(aa')) sqrt(N a N a') = Q/Z | confirmed |
| Cor B1(d), B2 amplifier exponents, next-step threshold 25/12, ranges q >= 2 and q <= 2/5 | exact arithmetic | all confirmed (1-1/(2r); 1/2+(2-q)(1-1/r)/2; (E-1/3)/2 < 7/8 iff E < 25/12; q/(3q-1) >= 2 iff q <= 2/5) |
| Theorem C | (HK)^(1-1/n) D^(2/n) = D^2 with HK = D^2; n = 4 term K^(3/4) D^(1/2) | confirmed |
| Gauss sums of composite a | own brute-force sum over residues mod a, own Euclidean reduction and Euler-criterion symbol, 12 random composites (2-3 prime factors, split and inert) | agree with `ms4.py` to 2e-15 |
| `ms4.py 12500` rerun (local, 4 s) | compared with the Z = 12500 block of the 2e5 run | identical to 3 decimals on all complete bins |
| `ms5.py 15000` rerun (local, 7 s) | compared with `run/ms5_60000.log` | MU, L columns identical at Z = 3750, 15000 |
| table values 0.913/0.918/5.45/0.219, 0.986+-0.012 | read from logs | as stated |

## Errors and gaps

1. **Theorem A(i),(ii) are cited for the wrong series.** dFDH (6.8)-(6.16) treat the untwisted psi(delta, s; u). The
   absorbed dual T is the class-3 series with the Groessencharacter twist alpha(a) = a/|a| (and gamma_2, xi). The
   preprint contains no Groessencharacter-twisted series (checked by search). So "PROVED-rel dFDH + Suzuki" holds for
   the column K3, not for T. For T the functional equation rests on the nonspherical Eisenstein theory, which
   `cubic-r2-conductor-verdict.md` 2.3 itself marks "CITED, not read"; the absence of a pole for T is not Suzuki's
   (6.15) (it would follow from the theta function being spherical, which is not written). Correct label for T:
   PROVED-rel general theory (not read). Same remark for xi of nontrivial conductor (level changes; Suzuki's relations
   are for level lambda^4).
2. **Theorem A(iv) (r = 5, exponent 6) cannot be confirmed.** No source was read; the order-10 Gauss sums were not
   computed; `ms5.py` measures the Moebius side only, which carries no information on the individual exponent. The
   task's question "true dual exponent for order 5" is answered by recall only. Label: RECALLED.
3. **"No a = 2 reflection exists" is stronger than what is shown.** What is shown: the Kubota functional equation at
   index m^3 has index factor N(m)^3 and class 3 reflects to class 3. Non-existence of any other shorter
   representation is not proved. (It is very likely; see referee observation below.)
4. **MODEL row "GRH level" is not the best consequence of its own input.** By Cor. B1(c),(d) the balanced Moebius
   moment gives 1-1/(2r) directly: 0.875 (r = 4) and 0.9 (r = 5). The table prints 0.8906 and 0.9259 because the runB
   constraint set (M + ell <= 1) excludes the Framework-A configuration. The summary line "MODEL r = 4: GRH-level input
   0.8906" should read 0.875 (a tie with 7/8, still above 0.874886647 by 1.1e-4). r = 3 is unaffected (0.8333 both ways).
5. **"Alone yields only 1-1/(2r)" is one-directional.** Proved: (b) implies the half-plane. Not proved: that (b)
   cannot give more. Heuristic support only (a zero of L(s, xi') at beta contributes Z^(1/r+2 beta) to MS_mu, which
   is compatible with (b) exactly when beta <= 1-1/(2r)).
6. **Theorem B equivalences.** The off-diagonal is signed and the Poisson weight vhat(k sqrt Q/(aa')) is not separable,
   so "(a) iff (b) up to Z^eps" is valid only for hypothesis classes closed under twists N(a)^(it) (a/|a|)^j and all
   smooth weights (as Prop Q1 states its hypothesis). Dual variable runs over lambda^(-2) O, not O (harmless periodic
   twist, not mentioned). Non-coprime pairs, ramified prime: not written. Cor. B2 needs the error Z^2 with no eps-loss
   in the diagonal; it is the least supported statement. No numerical test of Theorem B was made although T and MU
   were both computed; the saved data cannot test it (both off-diagonals are below noise).
7. **Theorem C scope.** It bounds from below any coefficient-blind estimate applied to the Poisson-dual side. It says
   nothing new about the direct side (there the rows u = t^n already make the sieve norm >= J D). The statement is
   correct in that scope; "exactly D^2" is a lower bound on such estimates, relative to an unrefereed preprint for
   n = 3, 4 and to a conjecture for n >= 5.
8. **Measurement power.** RND-level mean square at rows ~ length is the generic outcome; it excludes an excess of the
   polar size (Z^(1/4)) but not an exponent excess below about 0.01-0.02, as the note says. T has xi = 1 only.

## Referee observation (supports a_FE = 3 for the untwisted class, not reported in the note)

In `run/ms4_200000.log` the K3 column has a dip well below RND at small rows: R = 0.38 at N(m) in (96,192] for
Z = 12500; 0.34 at (192,384] for Z = 50000; 0.35 at (768,1536] for Z = 200000. Dip position N ~ 140, 270, 1100 against
Z: N^(3/2)/Z = 0.13, 0.09, 0.18, i.e. the feature moves as Z ~ const * N(m)^(3/2) (slope of log N against log Z
about 0.7 over the factor 16, against 0.5 for conductor N^2 and 1 for N^4 on the same reading). Three points, wide
bins, 30-260 rows each: MEASURED, rough. The T column shows no such feature (0.92-0.93 in the same bins), so the data
give no direct evidence on the individual conductor of the alpha-twisted class.

## A way around the obstruction (named as requested; none is in hand)

* The lower bound in Theorem B, MS_T >= (Q/Z) K^(1/r) |Inv_1(Z)|^2, is an identity for rows over a full lattice ball.
  For r = 4 and xi' of the form chi o N it is already met at the tie level relative to the manuscript
  (Inv_1 << Z^(7/8) gives K^(1/4) Z^(7/4) = Z^2 at K = Z). So at q = 1, r = 4 the repeated rows do not obstruct;
  the open part is the non-fourth-power rows k, i.e. a large-sieve inequality for the Moebius vector against the
  quartic family with the polar direction removed. dFDH's extremal vectors are class-1 Gauss sums; the correlation
  of the absorbed vector with them is again mu x Hecke (Inv_k), so a "sieve with explicit polar term" would be
  circular unless the polar term is controlled in mean rather than pointwise. This is the only opening seen; it is
  the same statement as the note's "coefficient-specific estimate", restricted to non-power rows.
* r = 3 over Q(omega) (balanced cubic Moebius moment, E < 25/12): correctly identified in the note as the only order
  where the balanced statement alone is below 7/8. Heath-Brown/BGL give 7/3 and dFDH Thm 1.1 shows that is sharp for
  blind methods. Open.

## Surviving statement

No abscissa. For r = 4 over Q(i): the untwisted class-3 quartic Kubota series has a functional equation with index
factor N(m)^3 and no pole (PROVED-rel dFDH, unrefereed, and Suzuki as quoted there); for the alpha-twisted absorbed
dual the same exponent is PROVED-rel theory not read. r = 5 exponent 6: RECALLED. Theorem B (PROVED-sketch, coprime
part re-derived): the balanced absorbed moment and the balanced Moebius moment of the order-r family are exchanged by
Poisson; either implies zero-freeness in Re s > 1-1/(2r) for Hecke L-functions of K (7/8 for r = 4, a tie; 9/10 for
r = 5; 5/6 for r = 3) and follows from GRH. Theorem C (arithmetic confirmed; rel dFDH for n = 3, 4): coefficient-blind
estimates of the Poisson dual are trivial at every amplifier length. Measurements reproduced at smaller scale.
MODEL values 0.810 / 0.849 require Cor. B2 (perfect orthogonality for q < 1), for which nothing is known; the MODEL
value under the balanced input is 0.875 (r = 4), not 0.8906.
