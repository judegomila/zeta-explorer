#!/usr/bin/env python3
"""Engine edits of lane c16-repair-owed-record-r15. Usage: patch_engine.py 1 | 2
stage 1: controls ZQ, SG, NR-q in curated/controls.json (build_graph.py is not edited); three closed device types for
         the round-15 rows; evidence of five round-14 device types carries the label restrictions.
stage 2: nodes/nodes-21.json (eleven silent-cell nodes), eleven open device types standing on them, pending list.
Each stage starts from the files as they are; anchors must occur exactly once. merge_outcomes.py is not run."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
stage = int(sys.argv[1])
LANE = 'c16-repair-owed-record-r15'
R14 = 'c15-referee-r14-independent-checkpoint'

def sub(path, anchor, new, count=1):
    t = open(path, encoding='utf-8').read()
    assert t.count(anchor) == count, (path, t.count(anchor), anchor[:70])
    open(path, 'w', encoding='utf-8').write(t.replace(anchor, new))

BG = os.path.join(ENG, 'build_graph.py')
MK = os.path.join(ENG, 'curated', 'mk_devices.py')
CT = os.path.join(ENG, 'curated', 'controls.json')

def q(s):
    return repr(s)

if stage == 1:
    # ---- control codes. NOT applied: adding NR-q, ZQ, SG to CONTROL_CODE_RE of build_graph.py (one line, NR-q before NR
    # for the same reason as NR-vec) is outside the edit scope of this lane (engine/curated only). No defeated-by cell
    # of the map names these codes today, so the graph is the same with and without the line (checked: first run of
    # stage 1 with the line, diff_baseline_after1.with-regex.json). Owed: the line, before a row names NR-q.
    c = json.load(open(CT, encoding='utf-8'))
    src = ('push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md sections 2, 4 and engine_control_proposal.json, with the corrections of '
           'REFEREE.md (independent pass, E1 to E5); map section 2 table rows ZQ, SG, NR-q and the note "Controls ZQ, SG, NR-q and Lemma L". Entered by ' + LANE)
    c['controls']['ZQ'] = dict(
        name='ZQ: zero-quartet multiplier twin zeta(s) m(s), m rational in s(1-s) of degree 0; two on-line zero pairs at +-g1, +-g2 exchanged for the quartet 1/2 +- eta +- i (g1+g2)/2',
        has="zeta's own functional equation exactly, at all heights; the simple pole at 1; order 1; N(T) for T > g2; every prime-power atom of log zeta (Euler product, GEOM, SIZE read on the atoms)",
        lacks='INT and SUPP (absolutely continuous signed density D with sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2); POS (forced with the pole clause: Lemma L)',
        kills="kills a device that reads zeta's functional equation with multiplicative structure on the prime-power atoms and not the absence of coefficient mass off log N; if GEOM and SIZE are read on ordinary coefficients the read set is an identification class and ZQ does not apply",
        kw=r'\bZQ\b|zero-quartet', status='construction and defect bound proved (re-derived by one independent referee); instances measured; second referee owed',
        source=src, scope='control for read sets containing FE of zeta without INT; conditional on the atom reading (referee E2); zeros at any prescribed 1/2 + eta, 0 < eta < 1/2')
    c['controls']['SG'] = dict(
        name='SG: real-zero twin zeta(s)(t^2 + b^2)/(t^2 - g1^2), t^2 = s(1-s) - 1/4; zeros 1/2 +- i g1 of zeta replaced by the real pair 1/2 +- b',
        has="zeta's own functional equation exactly; exact prime-power atoms; Lambda_SG <= Lambda (density -2 x^(-1/2)(cosh(b log x) - cos(g1 log x)) <= 0)",
        lacks='INT, SUPP, POS; real zero at 1/2 + b',
        kills='kills steps that use an upper bound for Lambda, or positivity of the atoms only, together with the functional equation',
        kw=r'\bSG\b|real-zero twin', status='proved (re-derived by one independent referee); measured at b = 0.3',
        source=src, scope='companion of ZQ; one-sided relaxation of POS with exact atoms')
    c['controls']['NR-q'] = dict(
        name='NR-q: T-NR at a base with no rational power, zeta(s)(q^(s-1/2) + c + q^(1/2-s)), q = 1 + sqrt 2, 2 < abs c < q^(1/2) + q^(-1/2)',
        has="zeta's own functional equation exactly; discrete frequencies; integer-frequency part equal to c zeta; Hecke relation at every rational prime on each coset q^j N",
        lacks='INT; GEOM, SIZE, POS at the one added generalised prime q; zeros on Re s = 1/2 +- arccosh(abs c/2)/log q',
        kills='kills steps that read the coefficients at integers only, or covariance at rational primes only, together with the functional equation',
        kw=r'\bNR-q\b|no rational power', status='proved (re-derived by one independent referee); measured at c = 2.1',
        source=src, scope='companion of ZQ; discrete relaxation of INT with GEOM kept at rational primes')
    json.dump(c, open(CT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    # ---- devices: docstring line, three closed types, restrictions in five evidence strings
    sub(MK, 'Edit this file, then run it, then build_graph.py."""',
        'Edited by ' + LANE + ' (round 16): three device types of round 15 added, closed on the independent referee pass of their lanes (window-fe-rigidity-growing-count-one-span: identification-type conclusions; fejer-section-prime-chain-growing-p; dictionary-dn-nonhomogeneous-pair-triple-sign-functionals: MEASURED, nine-class and six-class tiers, canonical tier NOT closed; no node); evidence of the five round-14 types carries the 30 label restrictions of ' + R14 + '; eleven open device types for the silent cells of the refereed checkpoint (U3, U2-POS, U4, U6 (a) to (g), U8), each standing on one node of nodes/nodes-21.json: classes on which the record is silent, not leads; PENDING: the three read-class entries and the two c6 entries that are cells U6 (c), (d) are now device nodes; four entries for running round-16 lanes and the cell U5 beyond a span. Previous file: scratch/mk_devices.pre-c16-repair.py.\nEdit this file, then run it, then build_graph.py."""')
    new_closed = [
     ('window-fe-rigidity-growing-count-one-span', 'closed', 'Window functional-equation rigidity with a number of windows growing with T, window heights inside one span [T, T + L] (class U5)',
      'lane c15-u5-window-count-threshold-translate-control (round 15, deepen, R4 direct). CLOSED for identification-type conclusions, on push/c15-u5-window-count-threshold-translate-control/REFEREE.md (independent pass; translate identity and Lemmas 1, 2, 4 re-derived; holds with corrections E1 to E4). The translate zeta(s + i alpha), alpha about 2 pi/log(T/2 pi), has relative functional-equation defect pi L/(T log(T/2 pi)) on the whole span (proved to leading order); it passes K contiguous unit windows up to max(eta T log(T/2 pi)/pi, sqrt(8 eta T)), the second term from the reflection translate found by the referee; above T^a for every a < 1 at fixed eta. Every translate has its zeros on the line: for conclusions about zero location the closure is MEASURED in a finite model only (free-prime unimodular products with an off-line model zero: about 24 + 0.36 K conditions; K = 128 passed at T = 1e6; float64, no certificate). No rigidity inequality found. Controls: WT passes; U passes in the finite model; the finite combination passes an absolute-tolerance test only. Open cell: window heights with ratio beyond 1 + eta log(T/2 pi)/pi read with more than pi(N) prime conditions (every statement found there is F = zeta on the window). Map row S12b',
      []),
     ('fejer-section-prime-chain-growing-p', 'closed', 'Sections of the prime chain with P = t^theta on the gamma one-port: Fejer-tapered sections, statement C(theta), sharp (J-expansive) sections (class U7)',
      "lane c15-u7-growing-section-twin-ladder-bridge (round 15, deepen, R4 direct). CLOSED as a restatement, on push/c15-u7-growing-section-twin-ladder-bridge/REFEREE.md (independent pass; Lemma 2, Theorem 1, Lemma 3, Proposition 4 re-derived; holds with corrections E1 to E5). L_F = sum over zeros of K_u(s - rho) with Re K_u >= 0: the tapered section is J-contractive on a half-plane for every P iff zeta has no zero there; the limit step is sound (Harnack, Vitali) and the stage inequality at unbounded P is map row P45, the target; classical in content (Fejer-smoothed form of Re xi'/xi > 0; Hinkkanen, Lagarias, recalled). With P = t^theta the statement is implied by RH and proved by the lane only for P up to about ((1/4) log t log log t)^2, where every sign twist satisfies it; the band-bound consequence is met by random sign chains. No proved step uses multiplicativity. Controls fail only through their zero sets or the absence of the identity: DH, sign chains, Liouville, random unimodular twists violate at theta >= 1; T-NR with c > 2 fails through the zeros of its factor; Dirichlet L-functions pass under GRH. Open cell: Proposition 5 (argued for one off-line pair; lane c16-ctheta-proposition5-power-sum). Map row Q30 (proposed by the lane as Q25, a label that was taken)",
      []),
     ('dictionary-dn-nonhomogeneous-pair-triple-sign-functionals', 'closed', 'Dictionary DN: sign functionals of a kernel pair or triple that are not homogeneous in each kernel (pointwise quotient and its dilation minors, second and third log differences, product kernel against the pointwise product) as separators from lifted control classes',
      'lane c15-nonhomogeneous-pair-triple-kernel-search (round 15, compute, heavy). CLOSED as MEASURED at the nine-class and six-class tiers only, finite scan with lane-defined lifts, on push/c15-nonhomogeneous-pair-triple-kernel-search/REFEREE.md (independent pass; holds with one count correction and five scope lines). 2,898,030 pair family-nodes (0 at T-train; 752 float64-undecided, all excluded: 360 by a reflection identity, 392 in balls), 1,598,273 quotient minors (0 one-signed on the 529 positives), 20,300 product nodes (0 at T-train; float64 only). Six-class tier {DH, T-NR, E_a, HEAT, U, THIN}: 0. The canonical tier {T-NR, E_a, HEAT} is NOT closed: 22,508 nodes at T-train, 0 hold out, 67,138 float64-undecided nodes (lane c16-dn-canonical-tier-ball-conversion); the FE tier is not closed either. Proved: backward heat with the same tau on both members is exactly blind to quotient and third log-difference functionals of kernels without polar terms (one lift). Open cells: HEAT with unequal tau; quotients at two different points; minors of order 4; Hermitian readings; product kernel with polar terms; Lemma J1\' (one derivation, no referee). Map row G41',
      []),
    ]
    block = ' # ---- round 15 lanes (entered by ' + LANE + '; each closed on the independent referee pass in the lane\'s REFEREE.md; no node)\n'
    for i, s, n, e, nodes in new_closed:
        block += ' (%s, %s, %s,\n  %s,\n  %s),\n' % (q(i), q(s), q(n), q(e), q(nodes))
    sub(MK, ']\nTARGET_FORMS = dict(', block + ']\nTARGET_FORMS = dict(')
    tail = ' Second independent referee ' + R14 + ' (holds with a scope line): label restrictions %s of its LABEL_RESTRICTIONS.md are entered in map row %s'
    sub(MK, "general gauges (argued). Map row G37'", "general gauges (argued). Map row G37." + (tail % ('18 to 22', 'G37')) + "'")
    sub(MK, "infinite pole sets in the cross Gram. Map row G38'", "infinite pole sets in the cross Gram. Map row G38." + (tail % ('8 to 12', 'G38')) + " (Lemma A exponent for 1/2 < sigma_0 <= 4/5; Lemmas A, B relative to Montgomery Theorem 12.1, recalled, not opened; identity TW for chi primitive; Lemma C for a finite set of characters)'")
    sub(MK, "(lane c15-edge-argument-strip-width-hecke-amplified). Map row G40'", "(lane c15-edge-argument-strip-width-hecke-amplified). Map row G40." + (tail % ('23 to 27', 'G40')) + "'")
    t = open(MK, encoding='utf-8').read()
    a = "Open cell: rank >= 2 non-Borel or metaplectic objects. "
    assert t.count(a) == 1
    i0 = t.index(a); i1 = t.index("',\n", i0)
    old = t[i0:i1]
    assert 'Map row G39' in old, old
    t = t[:i1] + (tail % ('13 to 17', 'G39')) + ' (Lemma E closes the LRS-type count in rank one, not every inequality on a rank-one object; Lemma 3 and Lemma E (iii) relative to an unopened source)' + t[i1:]
    open(MK, 'w', encoding='utf-8').write(t)
    sub(MK, "a referee ruling on the lifts (lane c15-referee-r14-independent-checkpoint). No map row (not among the rows owed to round 15)'",
        "the draw stage under the canonical lifts. Second independent referee " + R14 + " (holds with a scope line; LIFT_RULING.md; restrictions 1 to 7): the outcome is with the lane-defined lifts and holds on the grid stage with the canonical lifts T-NR, E_a, HEAT alone (recount; draws not recounted); 59 functionals reach T-train in the FE tier read per class; BLS, theta^w, BEU are lane-defined lifts and BEU is not an off-line control; the twist of a DH member keeps the functional equation iff chi_G^2(q_psi) = 1; Lemma J1 is for the same tau on both members and kernels without polar terms; the explanation of why no pair functional gains is argued. Map row G41 (with dictionary DN)'")
    print('stage 1 written')

if stage == 2:
    CP = 'push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md'
    ST = 'campaign/STRATEGY.md section 4.0 (version 5)'
    pre = 'Silent cell of the refereed checkpoint: a read class on which the obstruction record neither defeats nor supports a device. Not a lead; no lane has a registered reason to expect a crossing here. '
    def node(i, name, body, tags):
        # the cell U6 (d) is recorded by the checkpoint as carrying no use of multiplicativity
        return dict(id=i, type='open-direction', name=name, statement=pre + body + ' No statement about zeros of zeta.', status='conjectural',
                    usesMultiplicativity=('no' if i.startswith('silent-u6d') else 'unknown'), heightUniform='unknown', source=CP + '; ' + ST + '; entered by push/' + LANE, tags=tags)
    NODES = [
     node('silent-u3-identification-relaxation', 'Silent cell U3: identification classes, tested by relaxing one input',
          "Read sets: {zeta's own functional equation, ordinary Dirichlet series} (Hamburger); degree one with the functional equation, an ordinary series and the Euler-product axiom (Kaczorowski-Perelli); {positivity of Lambda, unimodular parameters at every rational prime, ordinary series}; {functional equation, pole at 1 only, Lambda_G >= Lambda} (Lemma L). No control can lie in such a class, and the record holds identifications there and no inequality. U1 {FE, GEOM} and the SIZE branch of U2 are cells of it. Entry test for a device: its decisive step must fail when one input is relaxed inside a family where the conclusion is false, at a named step with the size it needs: ZQ (ordinary series relaxed continuously), SG (positivity relaxed one-sidedly), NR-q and T-NR in Laurent form (ordinary series relaxed discretely), U, THIN, DEL (functional equation), WT (functional equation at all heights), E_a (unimodular parameters), sign twists (positivity). A step that is only an identification scores 0. Round-16 lane: c16-qa-filter-silent-cells-geometric-nodes (paper filter).",
          ['functional-equation', 'identification', 'euler-product', 'rigidity']),
     node('silent-u2-pos-fe-positivity-rigidity', "Silent cell U2-POS: zeta's functional equation with Lambda_G >= 0 and exact atoms (lemma POS-FE)",
          "Read set: {zeta's own functional equation, pole at 1 only, finite order, -G'/G a Laplace-Stieltjes transform of a non-negative measure}. Neither constructed nor excluded: a G not proportional to zeta with these properties would be a control and close the cell; a proof that G = c zeta would be an identification (cell of U3, score 0); only a quantitative form (a measure bounded below by -eps times a reference measure forces every zero within f(eps) of the line) would be a non-identity statement, and ZQ shows the dependence cannot be better than eps of order eta^2 + d^2 for an absolutely continuous defect. Known: with Lambda_G >= Lambda the conclusion G = c zeta holds (Lemma L, relative to Landau's theorem), and the pole clause is necessary (referee control G_+ with real poles in (0, 1)). First controls: ZQ, SG, G_+, NR-q. Round-16 lane: c16-pos-fe-u2-positivity-rigidity.",
          ['functional-equation', 'positivity', 'landau', 'explicit-formula']),
     node('silent-u4-joint-functionals-not-scaling-invariant', 'Silent cell U4: joint functionals of zeta and twists outside the five closed types',
          "Read set: a functional of zeta and its twists that is not (i) a function of finitely many ratios L(chi)/zeta, (ii) a Gram or Hankel-block form of the pair of unitary symbols, (iii) a twist-transfer Weil form, (iv) a sign functional of dictionary DJ, (v) invariant under a common pointwise scaling of the members. Examples left: quotients at different points, a logarithm of one member alone, kernels with polar terms, triples read through the group law at several points. State: dictionary DN closed as measured at the nine-class and six-class tiers; the canonical tier {T-NR, E_a, HEAT} is undecided at float64 (67,138 nodes); Lemma J1' has one derivation and no referee. Lift rules for any search: LIFT_RULING.md (T-NR, E_a, HEAT canonical). First controls: T-NR at a split prime, backward heat with equal and unequal tau, E_a. Round-16 lane: c16-dn-canonical-tier-ball-conversion (compute).",
          ['theta', 'turan', 'noncone', 'euler-product']),
     node('silent-u6a-rank2-nonborel-metaplectic-eigenobject', 'Silent cell U6 (a): Hecke eigen-objects with parameter rho in rank >= 2, non-Borel or metaplectic',
          "Read set: an inequality on an eigen-object attached to a zero outside rank one. Closed already: the LRS-type count in rank one for any cover, level and vector (pole minus gamma pole equals 1; relative to an unopened source for the pole position); the twelve catalogued inequalities for torus parameters; isobaric sums with cuspidal data are argued closed, not proved. A device that reads theta-orthogonality must fix the level or read the Whittaker functional on the whole representation (control NR-vec) and must use the factor zeta(u) in every square-index coefficient. No candidate object is on file. First controls: EIS-w, BLS, NR-vec.",
          ['automorphic', 'metaplectic', 'hecke', 'rankin-selberg']),
     node('silent-u6b-nonsolid-laxphillips-norms', 'Silent cell U6 (b): Lax-Phillips norms outside the tested families',
          "Read set: a Hecke-built norm on resonance states that is non-solid and outside the Hecke-sup, L^q and zero-mode families, or a norm on an invariant subspace smaller than the mean-zero subspace. Closed already: solid norms, the Hecke-sup norm, L^q with q < 2, the zero-mode space (the four families of row G37 in the obstruction table). No candidate norm is on file. First controls: EIS-w, BLS, an abstract Lax-Phillips triple.",
          ['lax-phillips', 'hecke', 'scattering', 'resonance']),
     node('silent-u6c-gl3-cover-global-whittaker-constants', 'Silent cell U6 (c): global Whittaker constants of a genuine cusp form on the double cover of GL(3)',
          "Read set: the global constants relating Whittaker coefficients of a genuine cusp form on the double cover of GL(3) (item 18 of section 6 in the obstruction table file; the local data are closed, row Z23). Unchanged since round 6: no computation of such constants is on file. Former pending entry of lane c6-gl3-cover-epsilon-cocycle.",
          ['metaplectic', 'automorphic', 'hecke']),
     node('silent-u6d-rank2-compact-squares-without-hecke-rule', 'Silent cell U6 (d): rank >= 2 compact-at-infinity squares without a Hecke rule',
          "Read set: a positive square on a rank >= 2 compact-at-infinity carrier with no Hecke rule. Unchanged since round 6; as stated it carries no use of multiplicativity (requirement R1 absent). Former pending entry of lane c6-square-intertwiner-weyl.",
          ['hidden-square', 'automorphic', 'krein-square']),
     node('silent-u6e-bost-connes-states-outside-d8', 'Silent cell U6 (e): states of the Bost-Connes system outside the three classes of row D8',
          "Read set: a positivity or inequality statement on a state of the Bost-Connes system that is not in one of the three classes closed in row D8 of the obstruction table. A device whose read set is invariant under multiplication of the state by a positive element of C*(Q/Z) is passed by T-NR. Unchanged; first control T-NR.",
          ['bost-connes', 'positivity', 'hecke']),
     node('silent-u6f-isogenous-points-nonlinear-functionals', 'Silent cell U6 (f): functionals of the unsummed complex isogenous points that are neither linear nor a second moment',
          "Read set: a functional of the individual complex isogenous points of the Hecke correspondence on the real oval of X_0(4) (the carrier of row G33 in the obstruction table) that is neither linear nor a second moment. Unchanged; first control T-NR.",
          ['hecke', 'klein', 'automorphic']),
     node('silent-u6g-scattering-exact-normalisation-affine-kernel', 'Silent cell U6 (g): scattering inequalities reading an exact normalisation, the archimedean factor or f(z) = f(1 - z); rank above one; the two-variable affine kernel',
          "Read set: an inequality on a scattering coefficient that reads its exact normalisation, the archimedean factor, or the relation f(z) = f(1 - z) for f with M = f(z)/f(z+1); or scattering data in rank above one; or the two-variable affine kernel left argued in row D9 of the obstruction table. Closed already: Schur, bounded-analytic and Pick conditions on a zero-type coefficient (control BLS). First controls: EIS-w, BLS, ZQ. Round-16 lane: c16-u6g-scattering-fe-rank2-bridge-stage-a (explore).",
          ['scattering', 'eisenstein-series', 'maass-selberg', 'bridge']),
     node('silent-u8-kernel-conditions-beyond-searched-range', 'Silent cell U8: single-object kernel sign conditions beyond the searched range',
          "Read set: a sign condition on the theta-normalised kernel of one object with order above 4, more than three parameters, nodes outside [-2.6, 2.6], or another normalisation (beyond the searched range of rows G36 and P55 in the obstruction table). Excluded from the cell by proved statements: minors on one lattice (T-NR with c >= 2 passes); Polya-frequency orders of the xi-kernel (E_a passes); monomial inequalities with non-negative quadratic weight for kernels without polar terms (backward heat inherits them; one derivation, no referee). A search in this cell follows the pre-registration rules of the compute lanes and the canonical lifts T-NR, E_a, HEAT.",
          ['theta', 'total-positivity', 'noncone', 'turan']),
    ]
    json.dump(dict(about='Silent cells of the refereed checkpoint (push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md, one referee) with the round-15 outcomes of campaign/STRATEGY.md section 4.0 version 5. Classes on which the record is silent; not leads. Written by push/' + LANE + '/patch_engine.py', nodes=NODES),
              open(os.path.join(ENG, 'nodes', 'nodes-21.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    ev = 'Silent cell %s of ' + CP + ' (one referee) with the round-15 outcomes (' + ST + '). OPEN in the sense "no row or lane closes it"; the record is silent, this is not a lead. %s'
    cells = [('u3', 'U3', 'No control can lie in an identification class; a device is tested by the relaxation family (ZQ, SG, NR-q, T-NR, U, THIN, DEL, WT, E_a, sign twists).'),
             ('u2-pos', 'U2-POS', 'Lemma POS-FE neither proved nor refuted; lane c16-pos-fe-u2-positivity-rigidity.'),
             ('u4', 'U4 (residual)', 'Five types closed (map rows G38, G41); canonical tier of dictionary DN undecided; lane c16-dn-canonical-tier-ball-conversion.'),
             ('u6a', 'U6 (a)', 'Rank one closed (rows G35, G39, G40); no candidate object in rank >= 2 on file.'),
             ('u6b', 'U6 (b)', 'Four norm families closed (row G37); no candidate norm on file.'),
             ('u6c', 'U6 (c)', 'Unchanged since round 6 (lane c6-gl3-cover-epsilon-cocycle); local data closed by row Z23.'),
             ('u6d', 'U6 (d)', 'Unchanged since round 6 (lane c6-square-intertwiner-weyl); no use of multiplicativity as stated.'),
             ('u6e', 'U6 (e)', 'Three classes of states closed (row D8); first control T-NR.'),
             ('u6f', 'U6 (f)', 'Linear functionals and second moments closed (row G33); first control T-NR.'),
             ('u6g', 'U6 (g)', 'Schur, bounded-analytic and Pick conditions closed (BLS; row D9 rank one); lane c16-u6g-scattering-fe-rank2-bridge-stage-a.'),
             ('u8', 'U8', 'Three proved exclusions (one unrefereed); rows G36, P55.')]
    block = ' # ---- silent cells of the refereed checkpoint (entered by ' + LANE + '; one node each in nodes/nodes-21.json; open = the record is silent, not a lead)\n'
    for (key, label, extra), n in zip(cells, NODES):
        block += ' (%s, %s, %s,\n  %s,\n  %s),\n' % (q('silent-cell-' + key), q('open'), q(n['name']), q(ev % (label, extra)), q([n['id']]))
    sub(MK, ']\nTARGET_FORMS = dict(', block + ']\nTARGET_FORMS = dict(')
    t = open(MK, encoding='utf-8').read()
    i0 = t.index('PENDING = [\n'); i1 = t.index(']\nout = dict(', i0)
    old = t[i0:i1]
    assert old.count('dict(name=') == 8, old.count('dict(name=')
    keep = [l for l in old.split('\n') if l.startswith(" dict(name='Density (family)") or l.startswith(" dict(name='Model vertices") or l.startswith(" dict(name='Non-locality step 4")]
    assert len(keep) == 3
    new = ["PENDING = [",
           " dict(name='Hecke amplifiers with T < N on truncated Eisenstein data (tried-not-closed part of the amplified edge argument of c15-edge-argument-strip-width-hecke-amplified: argued only; for T >= N the amplified inequality is implied by the unamplified one)', lane='c16-amplifier-below-truncation-eisw-compute', state='open'),",
           " dict(name='Statement C(theta) for Fejer sections with P = t^theta: Proposition 5 (zeros within c_theta/log gamma of the line) with several off-line zeros (map row Q30; argued for one pair)', lane='c16-ctheta-proposition5-power-sum', state='open'),",
           " dict(name='Canonical tier {T-NR, E_a, HEAT} of dictionary DN (67,138 float64-undecided nodes) and the draw stage of dictionary DJ under the canonical lifts (map row G41: not closed)', lane='c16-dn-canonical-tier-ball-conversion', state='open'),",
           " dict(name='Cell U5 beyond a span: window conditions at heights with ratio beyond 1 + eta log(T/2 pi)/pi reading more than pi(N) prime conditions (map row S12b; every statement found there is F = zeta on the window). No lane; no node', lane=None, state='open'),"] + keep
    t = t[:i0] + '\n'.join(new) + '\n' + t[i1:]
    open(MK, 'w', encoding='utf-8').write(t)
    print('stage 2 written: %d nodes' % len(NODES))
