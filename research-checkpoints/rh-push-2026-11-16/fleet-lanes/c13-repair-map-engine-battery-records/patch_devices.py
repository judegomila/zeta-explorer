"""Device entries of lane c13-repair-map-engine-battery-records in engine/curated/mk_devices.py: three device types of round 12,
each closed on the independent referee pass in the lane's REFEREE.md, with its named open cell; two evidence texts extended.
No entry for a round-13 lane. Previous file: engine/scratch/mk_devices.pre-c13-repair.py."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(HERE, '..', '..', 'engine', 'curated', 'mk_devices.py')
t = open(F, encoding='utf-8').read()
def rep(old, new):
    global t
    assert t.count(old) == 1, (t.count(old), old[:60])
    t = t.replace(old, new)
new = r'''
 # ---- round 12 lanes (entered by c13-repair-map-engine-battery-records; each closed on the independent referee pass in the lane's REFEREE.md)
 ('bost-connes-crossed-product-positivity', 'closed', 'Positivity in the Bost-Connes Hecke algebra C*(Q/Z) x N^x (KMS states, dual-system state, archimedean vector states with Poisson summation on e(r))',
  'lane c12-bost-connes-crossed-product-duality (round 12, explore). CLOSED at stage A for three classes of states, on push/c12-bost-connes-crossed-product-duality/REFEREE.md (independent pass; holds with corrections E1 to E6). Sigma-invariant states factor through C(Z^); the Galois-invariant KMS state reads finitely many local factors and the extremal KMS states at beta > 1 read L(beta, chi)/zeta(beta) with positivity of the coefficients only (E1); vector states read {L(s, chi)} with the mu_n and Poisson steps as identities and the inequality a square; Bochner positivity of the state holds only on lines sigma > 1; the Weil prime side is phi_{1/2}(H_g) (target, row P1). T-NR is Tr(D e^{-beta H}) with D >= 1 a fixed positive element of C*(Q/Z) and passes every step an inequality uses; E_a passes on A (x) A. Principle recorded (E3 wording): a device invariant under multiplication of the state by a positive element of C*(Q/Z) is passed by T-NR. Open cell: states outside the three classes (type II_infinity weights at beta <= 1; no candidate inequality on file). Map row D8. ',
  []),
 ('depth-aspect-height-transfer', 'closed', 'Depth-aspect exchange of height: characters mod p^k in place of the height twist n^(-it), so that a zero at height t is posed in a periodic family (R4 by transfer from the conductor aspect)',
  'lane c12-depth-aspect-height-transfer (round 12, explore). CLOSED for the termwise exchange step, on push/c12-depth-aspect-height-transfer/REFEREE.md (independent pass appended to the author check; Lemmas P, X, D re-derived, exact arithmetic and brute force; overstatements G1 to G5 narrowed). Lemma X: no character mod p^k is within 0.479/s of c n^(-it) on n <= N once N >= C_r p (p^k abs(t))^(1/r) and abs(t) >= t_r; integers below N give relations trivial p-adically and non-trivial at the real place. In the 7/8 format the depth characters are already targets and as rows they give Parseval. Zeta and every control fail the step identically (nothing separated). Open cell: a transfer that is not termwise (weighted sums special to the coefficients of the target), bounded heights below t_r in a written proof, and the range between log q and q^delta; no candidate on file. Map row Z35. ',
  []),
 ('x04-oval-hecke-fricke-loading', 'closed', 'Hecke operators T_{p^2}, U_2 and the Fricke involution w_4 loaded on theta restricted to the real oval of X_0(4) (real against complex isogenous points)',
  'lane c12-x04-oval-hecke-fricke-loading (round 12, combine). CLOSED for four forms (linear expressions in Hecke images of theta on the arc, dilation-covariant quadratic forms, single complex points, their second moment), on push/c12-x04-oval-hecke-fricke-loading/REFEREE.md (independent pass; holds with corrections E1 to E4). The summed complex isogenous points are dilates of theta; R_p + C_p = 1 + 1/p is the relation c(pm) = c(m), an identity; C_p Lambda is a T-NR twin and every twin lies in the dilation module of theta; <D_l, W> acts on a W-fixed vector through a commutative quotient; the second moment of the unsummed points is map row G16. T-NR and E_a pass every step. Open cell: a functional of the unsummed complex points that is neither linear nor a second moment (no candidate on file). Map row G33. ',
  []),
]
TARGET_FORMS = dict('''
rep("\n]\nTARGET_FORMS = dict(", new)
rep("Not covered: a cone other than R_+^G (lane c12-univ-pointwise-control-wcone); statements mixing several bridge objects. Map row Q28. ",
    "Not covered: statements mixing several bridge objects. The cell \"a cone other than R_+^G\" was run by lane c12-univ-pointwise-control-wcone (independent referee pass in its REFEREE.md): candidate (CW) on the cone K_F = {v >= 0, Fv >= 0} is closed (extreme rays at q = 5 with zeros off the line; the T-NR lift has every input); other F-adapted cones (non-polyhedral, or not containing v_+-) are not covered. Map rows Q28, Q29. ")
rep("Open cells kept in the evidence: backward heat at the phase-balance step (not run), the tied conductor family (argued only; lane c12-heat-tied-family-open-cell). Map row P53. ",
    "The two cells left open were run by lane c12-heat-tied-family-open-cell (round 12; one referee, second referee for its Lemmas S and T owed to lane c13-referee-r12-independent): backward heat fails (N2) at on-line zeros for six tau < 0 and forward heat tau >= 0.5 passes below 500; the tied conductor family V3b is closed for q = 5, 7, 13. Numeric screen of the lane corrected in ball arithmetic by c13-repair-map-engine-battery-records (DH and gamma-only windows; no verdict changed). Map row P53. ")
rep("Edit this file, then run it, then build_graph.py.\"\"\"",
    "Edited by c13-repair-map-engine-battery-records (round 13): three device types of round 12 added, each closed on the independent referee pass of its lane (bost-connes-crossed-product-positivity, depth-aspect-height-transfer, x04-oval-hecke-fricke-loading; no node); evidence of regular-rep-matrix-bridge and de-branges-positivity-family extended (previous file scratch/mk_devices.pre-c13-repair.py).\nEdit this file, then run it, then build_graph.py.\"\"\"")
open(F, 'w', encoding='utf-8').write(t)
print('mk_devices.py patched')
