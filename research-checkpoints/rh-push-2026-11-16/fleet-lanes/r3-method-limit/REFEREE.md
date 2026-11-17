# REFEREE: r3-method-limit (adversarial, 2026-11-16)

Scope: RESULT.md, tiers.py/.log, tiers2.py/.log, checked against the manuscript (`~/lean-deps/qrh-verify/paper.txt`)
and Liu II (`../bypass-78/dl/2610.26835.txt`). Independent re-solve: a separate LP (scipy HiGHS, formulas typed from
Liu II sec. 15.1 and (14.7), not from tiers.py), plus hand checks in rationals. Nothing here concerns zeros.

Outcome: the PROVED scalar steps and all tabulated LP values are confirmed. One summary claim is false as stated
(TRO6 and the 13/15 floor). One hypothesis label is overstated ((GEO) lx >= l), and the 5/6 statement depends on it.

## Confirmed

1. Transcription. Liu II sec. 15.1 has C(s) = s - 5/6 + lx/3 + l/6, equal to s - 1 + lx/2 + h/6 with h = 1 - lx + l
   (manuscript (10.3) agrees). B_low, G, k_J, k_K, k_P match Liu II sec. 15.1 verbatim. L0, L_K, L0' = L0 - b/12
   match Liu II sec. 15.3 and (15.1). E(delta, x) is Liu II (14.7) at d = h with theta = 0, K = R = 1 - delta,
   g = delta x. H0 - B = -1/4 + b/6 + 5l/4 on the balanced line M + l = 1 (re-derived by hand) = Liu II C_0.
2. Theorem 1. B = e_low - (C(s) - s) from Prop. 2.1 (low target Z^{C(sigma_0)+omega}); with e_low >= lx/2 this is
   B >= 1 - h/r, and h <= 1 iff lx >= l. Second form: lx + max(0,b)/2 >= M/2, so B >= 1 - 1/r + (M - 2l)/(2r).
   Both correct. Sanity: Part I (h = 1/2) gives 11/12; manuscript (h = 13/16, b = 1/8) gives 7/8.
3. 13/15 certificate. (4/15) L0 + (2/5) L0' + (2/15) L_K + (1/5) H0 = 13/15: constant term and the three
   coefficients checked by hand in rationals; weights positive, sum 1. Liu II's own dual (17/30, 1/30, 2/5 on
   L0, L_K, L_J) also checked = 13/15.
4. LP values, independent solver: 13/15 (source; GRH counts; J removed; P removed; free geometry), 31/36 (K removed),
   23/27 (only P), 5/6 (only J; k = 0 with any G; G = 0 with source k), 1 - 1/r and 1 - 4/(5r) for r = 3, 4, 8,
   and the free-geometry runs F1, Q2. All agree with tiers.log to 7 digits. Attainment at lx = ly = l = t checked by
   hand: E(0) = 1/2 - t, E(2/3, 1/2) = 1/6 - 2t/3. l_min = 8 - 9B re-derived by hand.
5. bypass-78 price_list.log rows 8, 1d, 2a, 1c quoted correctly.

## Errors

E1 (false as stated). "TRO6 does not move 13/15." The certificate puts weight 4/15 on L0, which is the polar
   branch G >= b/12. With G = max(0, (1 - eta) b/12, b - ly/2), source k, ideal high side (same LP):

   | eta | 0 .. 0.5 | 0.6 | 0.8 | 0.9 | 1 |
   |---|---|---|---|---|---|
   | infimum | 13/15 | 0.86469 | 0.86084 | 0.85897 | 6/7 = 0.857143 |

   At eta = 1 the point (lx, ly, l) = (2/7, 4/7, 1/7) has B_low = 5/6 + 1/42 = 6/7 and H0 = 6/7 (hand check), with
   M + l = 1; same value with GRH counts and with free geometry. RESULT section 5 item 4 contradicts itself: it
   quotes 0.8586 < 13/15 for eta = 1 in the present system. Correct statement: TRO6 with eta <= 1/2 (tested; the
   threshold is near 1/2) leaves 13/15; full TRO6 (eta = 1, P_a^2/Y' kept) gives 6/7. The tier table also shifts:
   at eta = 1, removing the K-loss alone already gives 5/6 (not 31/36), at (1/3, 2/3, 1/3).
   tiers2.py defines `system_eta1` for exactly this case and never calls it (dead code); the case was not run.

E2 (overstated label, load-bearing). (GEO) "lx >= l" is labelled PROVED-rel manuscript (12.5), Prop. 15.3. The
   manuscript only works at one fixed geometry (lx - d >= 3/16 holds there); Def. 10.1 requires lx, ly > 0, l >= 0,
   h > 0, nothing more; the proof of Prop. 15.3 needs Q, Y' >= 1. Liu II sec. 15.1 explicitly relaxes
   "lx, ly > l > 0, b > 0" to "M, ly, l >= 0" on "the nonempty range of the defining theta sum", and sec. 15.3
   discusses "b <= 0 or lx <= l". So lx >= l is a modelling hypothesis, not a source constraint. The source-grounded
   form is M >= 2l (and ly >= l), i.e. Theorem 1's second form, and that form needs the polar term.
   Consequence: "TRO6 does not move 5/6" holds only under strict lx >= l. Under M >= 2l, ly >= l, k = 0 and TRO6
   at eta = 1 (G = max(0, b - ly/2)) the LP has no floor: 2/3 at box 4 with (2, 4, 3), search bound at box 16.
   So under the weaker geometry the 5/6 floor is carried by exactly the term TRO6-natural would remove.
   Section 8 does not list hypothesis (iii) among the weakest steps; it should be first.

E3 (unremarked inconsistency). F1, F2, Q2 and the eta = 1 run above return B < 1/2. No valid estimate system can:
   zeros on the critical line exist. So the reduced ideal system (k = 0 outside lx >= l) is not merely
   "heuristically circular" there; if the reduced high side is faithful, k = 0 at l > lx is false. RESULT reports
   "no floor at all" without drawing this. It means "infimum under the most optimistic inputs" is not well defined
   without deciding which range conditions (GEO, K, P) are true lower bounds. The headline "exactly 5/6" is the
   value for one choice: K, P, J idealised away, lx >= l kept.

E4 (minor). "Liu II h = 0.794": from bypass-78 row 0, h = 1 - 0.3719 + 0.1671 = 0.7952 (and 1 - h/6 + b/12
   = 0.87489 only with 0.7952). H0 as a necessary constraint is valid only for ly <= h (for ly > h the left
   contour beats w = 1/2); harmless for the certificate because ly > h forces M + l > 1 + 2l and L_K > 11/12.

## Dependence on unrefereed inputs

Everything is relative to: manuscript Prop. 2.1, (10.3), (10.5), Prop. 15.3; Liu II Prop. 2.5 / sec. 15.1 direct
majorant on the relaxed range (Liu II itself says it "goes beyond" Liu I Prop. 22.2), (14.7), sec. 15.3. Xu-Sang is
not used by any step. The r != 6 rows are a transplant (MODEL), not checked against a source.

## A way around the obstruction (inside the model)

Theorem 1 is conditional on (iii). The route it leaves open: rescaled X-length below 1 with nonempty row range
(l > lx, M >= 2l), reflected-row mean square without range loss, and TRO6 at eta = 1. Then B_low = 5/6 - l/18 on
ly = 2 lx = 4l/3 and the ideal high side is satisfied. This is option (b) of Theorem 3 with shorter marks than the
table states when the polar term is removed. Whether k = 0 can hold there is the open point (E3 suggests not for
large l); no source bound decides it for 1/3 < l near 1.

## Surviving claim

Relative to the unrefereed manuscript and Liu II: (1) B >= 1 - h/r whenever the low estimate is at or above
Z^{lx/2} [PROVED scalar]; hence B >= 5/6 for r = 6 under lx >= l, or under M >= 2l with the polar term kept.
(2) 13/15 is a floor for the source low side with any counts and without the J-loss, valid for partial TRO6
(eta <= 1/2); full TRO6 moves it to 6/7. (3) Tier values 31/36, 23/27, 5/6 as tabulated, for source G.
(4) 5/6 is the infimum of the reduced ideal system only with lx >= l imposed as a modelling hypothesis; it is not
shown to be the limit of the method family. (5) 1/2 needs h = r/2. No abscissa below 0.874886647 is proved.

Verdict: precise obstruction holds in the corrected form above. Checker scripts: /tmp/ref_r3/chk.py, chk2.py
(not kept in the repo).
