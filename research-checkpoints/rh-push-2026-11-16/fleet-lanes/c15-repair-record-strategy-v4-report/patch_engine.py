#!/usr/bin/env python3
"""Round-15 engine edits (lane c15-repair-record-strategy-v4-report). Exact-string edits, each must match once.
1. build_graph.py: BLS, UNIV (and NR-vec, listed before NR so that 'NR-vec' is not read as T-NR) in CONTROL_CODE_RE.
2. curated/controls.json: control NR-vec.
3. curated/mk_devices.py: five closed device types of round 14; three evidence strings carry the label restrictions
   of c14-referee-r13-independent; PENDING: RS-1..RS-3 replaced by U-classes with no lane; the Lax-Phillips proposal
   moves to devices."""
import json, sys, os
E = sys.argv[1]

def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new, tag in pairs:
        assert s.count(old) == 1, (path, tag, s.count(old))
        s = s.replace(old, new)
    open(path, 'w', encoding='utf-8').write(s)

# 1 ---------------------------------------------------------------------------------------------
edit(os.path.join(E, 'build_graph.py'), [(
 "CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(DH|HEAT|",
 "CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(NR-vec|BLS|UNIV|DH|HEAT|", 'regex')])

# 2 ---------------------------------------------------------------------------------------------
cp = os.path.join(E, 'curated', 'controls.json')
c = json.load(open(cp, encoding='utf-8'))
assert 'NR-vec' not in c['controls']
c['controls']['NR-vec'] = dict(
 name="NR-vec: local-vector control on the double cover of SL_2. For F a weight-1/2 Hecke eigenfunction of level 4 with coefficients b(m) and q an odd prime: f_q = (F_0 - F x chi_q)/2, F_0 = F - (1/q) sum_{j mod q} F(z + j/q); coefficients b(m) 1[(m/q) = -1]",
 has="the automorphic representation of F; the T_(p^2) eigenvalues of F for p not dividing 2q; vanishing of every square-index coefficient at the cusp infinity, at every parameter; zero constant term at infinity",
 lacks="level 4 (it has level 4q^2); the Hecke relation at q",
 kills="kills a device that reads theta-orthogonality as vanishing of the square-index coefficients of one vector at one cusp (it holds at every parameter, with no zero of zeta)",
 kw=r"\bNR-vec\b|local-vector control",
 status="coefficient statement elementary (re-derived by one independent referee); level relative to Shimura 1973 Lemma 3.6 (not opened)",
 source="push/c14-theta-orthogonal-metaplectic-eigenobject/RESULT.md Lemma V and engine_device_proposal.json, with the definition repaired by REFEREE.md (independent pass, correction 2: the principal twist is replaced by F - (1/q) sum F(z + j/q)); map section 2 note NR-vec and row G39. Entered by c15-repair-record-strategy-v4-report",
 scope="control for weight-1/2 (metaplectic) Hecke eigen-objects on Gamma_0(4); not a Dirichlet-series control; not computed as a function")
c['about'] += " NR-vec added by c15-repair-record-strategy-v4-report (round 15); BLS, UNIV and NR-vec are in CONTROL_CODE_RE of build_graph.py from that lane on."
json.dump(c, open(cp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

# 3 ---------------------------------------------------------------------------------------------
R14 = 'c14-referee-r13-independent'
NEW = r'''
 # ---- round 14 lanes (entered by c15-repair-record-strategy-v4-report; each closed on the independent referee pass in the lane's REFEREE.md; no node)
 ('laxphillips-hecke-norm-outside-l2', 'closed', 'Hecke-built norms outside weighted L2 on Lax-Phillips resonance states: solid norms, Hecke-sup norm, L^q with q < 2, Hecke-invariant zero-mode space',
  'lane c14-laxphillips-hecke-norm-outside-l2 (round 14, explore, R4 direct). CLOSED at stage A for four named norm families, on push/c14-laxphillips-hecke-norm-outside-l2/REFEREE.md (independent pass; every PROVED step re-derived; holds with seven items, three requiring rewording). (a) Solid norms: the space contains the constants and the full-space operator norm of T_p reads 0 <= beta <= 1 only; on the mean-zero subspace the eigenvalue bound is implied by admissibility, by EIS-w (referee repair). (b) Hecke-sup norm: finite on an eigenvector iff abs(Re mu) <= theta (the conclusion); dominated by a wave-growth norm defined for every Lax-Phillips triple (Lemma Q after a typing repair; one-directional). (c) L^q, q < 2: admissibility implies the bound. (d) Zero mode O(y^(1/2+delta)): reads phi(w) = 0; the device is Zagier\'s horocycle criterion. Multiplicativity enters as an identity the wave group satisfies without Hecke operators. Controls: EIS-w passes (a) to (c); a non-arithmetic or abstract triple passes (b); T-NR, E_a and BLS pass at model level (BLS not run against M_B). Open cells: non-solid norms outside the four families; invariant subspaces smaller than the mean-zero subspace; general gauges (argued). Map row G37',
  []),
 ('joint-pair-ratio-crossgram-twist-transfer', 'closed', 'Joint functionals of the pair (zeta, L(chi)): ratio L(chi)/zeta (winding, Littlewood, Nevanlinna), cross bridge Gram of (S_zeta, S_chi), twist-transfer Weil form',
  'lane c14-joint-pair-design-ratio-vortex-cross-bridge (round 14, explore, stage A). CLOSED, on push/c14-joint-pair-design-ratio-vortex-cross-bridge/REFEREE.md (independent pass; all PROVED steps confirmed; holds with corrections E1 to E5). Ratio: a multiplier common to both members cancels, so T-NR at a prime p0 = 1 mod q has identical ratios for any finite set of characters (Lemma C); the comparison of window counts needed by Lemma A is equivalent to the target (Lemma A relative to the conductor-aspect density theorem as recalled, exponent on [1/2, 4/5] only). Cross Gram: identities for any pair of unitary symbols; BLS passes. Twist-transfer: prime sides cancel exactly for narrow bumps (identity TW), the difference is archimedean; DH (q = +-1 mod 5), T-NR, E_a pass. The general form (every pair functional consuming the twist relation) is argued. DH twists measured in float64 (no enhancement at the off-line zero; background rate 0.07 to 0.10 per box). Open cells: functionals not homogeneous in each kernel, triples with the group law (lane c15-nonhomogeneous-pair-triple-kernel-search); infinite pole sets in the cross Gram. Map row G38',
  []),
 ('lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal', 'closed', 'Luo-Rudnick-Sarnak exponent count on a rank-one eigen-object attached to a zero (weight-1/2 Eisenstein series on Gamma_0(4) at 1/4 + rho/2, theta-orthogonality in place of cuspidality; any cover, any vector)',
  'lane c14-theta-orthogonal-metaplectic-eigenobject (round 14, explore, R4 direct). CLOSED at stage A at the generic-parameter control, on push/c14-theta-orthogonal-metaplectic-eigenobject/REFEREE.md (independent pass; Lemmas 1, 1\', E (i), (ii) re-derived; holds with four corrections). The square-index row vanishes at zeros of zeta by Lemma 1\' (every A(n^2, s) carries zeta(2s - 1/2)/zeta(4s - 1)); it is not the single condition b(1) = 0 (the Hecke relation is for odd p; counter-example at the 2-adic zero u = 1 + i pi/ln 2). The vanishing removes the first-moment series and no polar term of the second-moment series. Rightmost Rankin-Selberg pole 1 + abs(beta - 1/2), gamma pole abs(beta - 1/2), difference 1: an inequality true for every beta. Lemma E: an eigenfunction of moderate growth with non-real eigenvalue on a finite-volume rank-one quotient is not square-integrable (classical); difference 1 for it relative to the regularised Rankin-Selberg method (Zagier 1981, not opened; exponents measured at five parameters). Controls: the generic parameter (EIS-w in weight 1/2) passes every step; NR-vec (repaired definition) has a vanishing square row at every parameter; E_a, WT covariant; BLS passes; T-NR and DH paper statements. Open cell: rank >= 2 non-Borel or metaplectic objects. Map row G39',
  []),
 ('catalogued-x2-inequality-torus-parameter-eigenobject', 'closed', 'Catalogued inequalities consuming a Hecke eigen-relation at every prime (twelve entries of the literature) applied to an eigen-object with torus parameter indexed by a zero',
  'lane c14-x2-step-catalogue-zero-indexed-objects (round 14, combine, paper). CLOSED, on push/c14-x2-step-catalogue-zero-indexed-objects/REFEREE.md (independent pass; every PROVED item re-derived; holds with five errors of bookkeeping or overstatement). No entry has all hypotheses met by a zero-indexed object at a zero in the open strip. Lemma T: for a torus parameter the rightmost pole minus the rightmost local or gamma pole equals 1 for every parameter and every r. Proposition E: the Eisenstein-series proof of zeta(1 + it) != 0 is the one entry met in full, at Re rho = 1; in the strip the missing hypothesis is xi(2 - rho) = 0. For the weight-1/2 object only the Jacquet-Shalika entry is met exactly when beta = 1/2; six entries fail at every parameter. Controls: EIS-w and E_a pass every entry the first two objects pass; BLS passes what the resonance vector passes; T-NR, BLS, DH rows are typings, not runs. Catalogue: five entries opened in notes, seven recalled, no primary source opened. Open cells: completeness of the catalogue; isobaric sums with cuspidal data (argued); a quantitative edge argument (lane c15-edge-argument-strip-width-hecke-amplified). Map row G40',
  []),
 ('dictionary-dj-joint-pair-sign-functionals', 'closed', 'Dictionary DJ: sign functionals of a kernel pair (F, F twisted by chi), homogeneous in each kernel (mixed dilation minors of orders 2 to 4, Hermitian minors and forms, Turan cross expressions; at most three real parameters), as separators from nine lifted control classes',
  'lane c14-joint-zeta-twist-noncone-search (round 14, compute, heavy). CLOSED as MEASURED, finite search on the registered grid and draws, with lane-defined lifts of the control classes and the normalisation Re omega > 0. On push/c14-joint-zeta-twist-noncone-search/REFEREE.md (independent pass; holds with four corrections R-1 to R-4). Of 38,101,627 functionals on 833 pairs, 4,266,644 are one-signed on the 529 training positive pairs; none rejects a training pair of each of the nine lifted control classes (most: 8 classes, 1,692 rows). FE tier: 0 survivors read per member, 0 on held-out. Lemma J1 (proved): the Turan-ratio functional without polar terms has the same sign on a backward-heat pair as on (zeta, chi). The twist keeps the functional equation for T-NR, HEAT, BLS, E_a and for 5 of 28 DH members (measured). Open cells: functionals not homogeneous in each kernel (quotients, logarithms), triples (lane c15-nonhomogeneous-pair-triple-kernel-search); a referee ruling on the lifts (lane c15-referee-r14-independent-checkpoint). No map row (not among the rows owed to round 15)',
  []),
]
TARGET_FORMS = dict('''
PEND_OLD_START = " dict(name='Read set RS-1 (STRATEGY v3 section 4.0)"
mp = os.path.join(E, 'curated', 'mk_devices.py')
s = open(mp, encoding='utf-8').read()
# new devices
assert s.count("\n]\nTARGET_FORMS = dict(") == 1
s = s.replace("\n]\nTARGET_FORMS = dict(", NEW.rstrip('\n').replace("\n]\nTARGET_FORMS = dict(", "") + "\n]\nTARGET_FORMS = dict(")
# evidence restrictions (6, 8, 10)
for old, new, tag in [
 ("For the two-variable affine kernel the same closure is argued, not proved.",
  "For the two-variable affine kernel the same closure is argued, not proved (second referee " + R14 + ": the statement that the inequality carries no constraint on numerator zeros is proved for the rank-one inequality (I) and OPEN for the affine inequality (I_aff); pairs are non-real, or real with even multiplicity).", 'kac'),
 ("The target enters by division. The Euler product is read twice: absolute convergence of 1/F right of 1 (edge Re w = 1, partial sums x^(1/2+eps), inequality (I-1); T-NR satisfies it)",
  "The factorisation and the orbit statement are exact for the kernel H_- only; H_+ carries a subtracted term alpha^+_(1,1/2)(s/2) (second referee " + R14 + ", restrictions 7 to 9). The target enters by division in both. The Euler product is read twice: absolute convergence of 1/F right of 1 (edge Re w = 1, partial sums x^(1/2+eps), inequality (I-1); T-NR satisfies it)", 'fourier'),
 ("the inequality reads beta <= 7/4. LRS needs",
  "the inequality reads beta <= 7/4, relative to the reconstructed threshold (second referee " + R14 + ", restriction 10). LRS needs", 'lrs'),
]:
    assert s.count(old) == 1, (tag, s.count(old))
    s = s.replace(old, new)
# pending
i = s.index(PEND_OLD_START); j = s.index(" dict(name='Density (family) quadratic forms")
assert s[i:j].count('dict(name=') == 3
PNEW = (
 " dict(name='Read class U3 (STRATEGY v4 section 4.0; checkpoint draft, unrefereed): identification classes ({FE, INT} at conductor 1; degree one with FE, INT and the Euler-product axiom; {POS, GEOM at every rational prime, INT}); the record is silent, no control lies in the class; not a lead. No lane (c15-control-with-zeta-fe-classes-u1-u2 addresses U1 and U2 and may change what R3 means here)', lane=None, state='open'),\n"
 " dict(name='Read class U6, cells (e), (f), (g) (STRATEGY v4 section 4.0; checkpoint draft, unrefereed): Bost-Connes states outside the three classes of row D8; functionals of unsummed complex isogenous points that are neither linear nor a second moment (row G33); scattering inequalities that are not truncated-norm positivity or that use the archimedean vector, and the affine kernel (row D9). The record is silent; not a lead. No lane. Cells (a), (b) closed in round 14 (rows G39, G40, G37); cells (c), (d) are the two c6 entries below', lane=None, state='open'),\n"
 " dict(name='Read class U8 (STRATEGY v4 section 4.0; checkpoint draft, unrefereed): single-object kernel sign conditions beyond the searched range of rows G36 and P55 (order above 4, more than three parameters, nodes outside [-2.6, 2.6], other kernels or normalisations); the record is silent; not a lead. No lane', lane=None, state='open'),\n")
s = s[:i] + PNEW + s[j:]
old = " dict(name='Lax-Phillips Hecke norms outside the weighted-L2 family', lane=None, state='open'),\n"
assert s.count(old) == 1
s = s.replace(old, "")
# docstring
old = "Edit this file, then run it, then build_graph.py.\"\"\""
assert s.count(old) == 1
s = s.replace(old, "Edited by c15-repair-record-strategy-v4-report (round 15): five device types of round 14 added, each closed on the independent referee pass of its lane (laxphillips-hecke-norm-outside-l2: four named norm families; joint-pair-ratio-crossgram-twist-transfer; lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal; catalogued-x2-inequality-torus-parameter-eigenobject; dictionary-dj-joint-pair-sign-functionals: MEASURED, finite search; no node); evidence of three round-13 types carries the label restrictions of c14-referee-r13-independent; PENDING: the read-set proposals RS-1 to RS-3 are replaced by one entry per read class U1 to U8 that has no lane (U3, U6 cells (e) to (g), U8; U1, U2, U4, U5, U7 have round-15 lanes), and the Lax-Phillips proposal moved to devices (previous file scratch/mk_devices.pre-c15-repair.py).\n" + old)
open(mp, 'w', encoding='utf-8').write(s)
print('patched')
