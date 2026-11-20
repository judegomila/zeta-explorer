"""c22-record-r21-controls-map-lean-queue-engine: engine edits (round 22, record lane B).
(1) curated/mk_devices.py: block R22-record inserted before the line that appends the BR device rows:
    cell U4 -> closed on its second referee file; BR-2 device text narrowed to the dense remainder, set condition per E3.
(2) nodes/nodes-23.json: node br2-sparse-pole-lattice-regime-k (statement narrowed, set condition repaired);
    node twin-screen-ts (status proved for Lemma TS-1 (i) and the three reasons as statements; type tool -> role 'rigid').
Previous files: engine/scratch/mk_devices.pre-c22-record.py, engine/scratch/nodes-23.pre-c22-record.json. Idempotent."""
import json, os
B = 'tmp/research-2026-11-16'
LANE = 'c22-record-r21-controls-map-lean-queue-engine'
U4F = 'push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u4-second-order-archimedean-mixed-form/REFEREE2.md'
assert os.path.exists(os.path.join(B, U4F))
SET_COND = ("sum over p of abs(1 - alpha_p) p^-sigma finite for every sigma > 1/2 and infinite at 1/2 (regime (K) of the source lane); "
            "with abs(alpha_p) = p^(1/2) on S and alpha_p = 1 off S this is: S infinite and sum over S of q^-eps finite for every eps > 0")
SPARSE = ("Decided on the sparse side in round 21 (base-blind natural-boundary rows, no multiplicativity beyond the independence of the log q): "
          "Theorem W of push/c21-br2-sparse-pole-lattice-natural-boundary-or-twin (one independent referee, holds after erratum E1; second referee owed by c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11): "
          "if sum over S of (log q)^(-gamma) is finite for some gamma < 1, with any phases of alpha_q, then G has no meromorphic continuation across any point of Re s = 1/2, so there is no twin; "
          "Lemma P0 of push/c21-br2-relative-product-pole-lattice-census-server (one independent referee, holds): for alpha_q = +q^(1/2) on any infinite S of regime (K) the relative product decays faster than every power of delta at s = 1/2 + delta, so G is not meromorphic at 1/2; "
          "Lemma P1 (same lane): lacunary ratio of log q above 2 gives a natural boundary. Control CYC (norms Q^(2^k), alpha = -q^(1/2)) is meromorphic with dense local pole lattices: pole density is not the obstruction, multiplicative independence of the norms is.")
REMAINDER = ("Open remainder (the device as it now stands): S not covered by Theorem W, that is sum over S of (log q)^(-gamma) infinite for every gamma < 1 (in particular every S with sum over S of 1/log q infinite), "
             "with phases not all equal to +1; and the wider regime (K) with abs(alpha_p) < p^(1/2). Question: natural boundary on Re s = 1/2, or a twin (G != zeta with zeta's functional equation).")
NAME = ("PROPOSED, DECIDED ON THE SPARSE SIDE: BR-2, dense remainder of regime (K): relative Euler product with abs(alpha_q) = q^(1/2) and phases on a set S of primes "
        "with sum over S of q^-eps finite for every eps > 0 and sum over S of (log q)^(-gamma) infinite for every gamma < 1: natural boundary on Re s = 1/2 or a twin")
EVID = ("Proposed device type (entered by c21-record-engine-states-statement-o-v5-br-nodes, round 21); text narrowed to the dense remainder by " + LANE + " (round 22) on the round-21 lanes. "
        "Registered as a device type only so that generate.py can rank it. Set condition (repair E3 of the referee of the c21 record lane; the earlier text 'sum over S of p^-sigma finite for every sigma > 1/2 and infinite at 1/2' described regime 3): " + SET_COND + ". "
        + SPARSE + " " + REMAINDER + " On file for the remainder: Theorem C of push/c20-euler-shape-rigidity-infinite-modified-primes (two referee files): a twin in regime (K) has no off-line zero beyond zeta's, and a twin of finite order has a zero of G/zeta on the line; "
        "a method (integer radial exponent at every height of an interval against a constructed resonant height) is the subject of lane c22-br2-dense-remainder-integer-quantization, not reported when this text was written. "
        "Not a lead with a score: either outcome is an identification row or an on-line control. Not a statement about zeros of zeta. Entry conditions and the controls that must fail: fields entryConditions, controlsThatMustFail.")
STATUS = ("proposed; sparse side decided in round 21 (Theorem W, Lemmas P0, P1; one independent referee each), dense remainder untested "
          "(lead BR of STRATEGY version 6, regime 2 = (K); an identification question, cannot score by itself)")
ENTRY = [
 "E1. Statement BR-2, dense remainder: abs(alpha_q) = q^(1/2) on a set S of primes (phases free), alpha_p = 1 off S (this drops abs(alpha_p) <= 1); " + SET_COND + "; and S outside the class of Theorem W: sum over S of (log q)^(-gamma) infinite for every gamma < 1. Outcome is one of: the product has Re s = 1/2 as a natural boundary; or a twin is constructed.",
 "E2. Known before work (Theorem C of the source lane, two referee files): a twin in regime (K) has no zero off the line beyond zeta's, and a twin of finite order has a zero of G/zeta on the line. A twin here is therefore an on-line control and cannot serve as an off-line control.",
 "E3. A natural-boundary proof is an identification-type row (score 0). The sparse subclass is closed: Theorem W (sum (log q)^(-gamma) finite, gamma < 1, any phases) and Lemma P0 (alpha_q = +q^(1/2), any infinite S). A second refereed obstruction of the same kind on the remainder closes regime (K) (ROUND_LOG round 22, stopping rules).",
 "E4. Any argument must fail for CYC (norms Q^(2^k), alpha = -q^(1/2): the product is 1 - w, entire) at a named step that reads the multiplicative independence of the norms; an argument that reads only the position or density of the local pole lattices, or the sizes of the factors, is refuted by CYC. The sign of the radial slope at pole points is not an invariant on k^3, k^2 sets (census lane, measured in Arb balls).",
 "E5. The numerical test (partial relative products in ball arithmetic; statistic: radial exponent at pole points and generic points of the line; rows CYC, a rational-dependence injection, DEL, THIN, HQ1, NWM) is MEASURED support only and is pre-registered (lane c22-br2-dense-census-cyc-nwm-server).",
 "E6. Limit, stated before work: nothing about zeros of zeta follows from either outcome. R4 is posed only in relative form (continuation of zeta/G to the line).",
 "E7. Stopping rule: two refereed obstructions of the same kind close the regime."]
SOURCES_ADD = [
 "push/c21-br2-sparse-pole-lattice-natural-boundary-or-twin/RESULT.md (Lemma P, Theorem W, control CYC) and REFEREE.md (independent pass: holds with erratum E1)",
 "push/c21-br2-relative-product-pole-lattice-census-server/RESULT.md (Lemmas P0, P1; census in Arb balls) and REFEREE.md (independent pass: holds)",
 "push/c21-record-engine-states-statement-o-v5-br-nodes/REFEREE.md, correction E3 (set condition)",
 "campaign/ROUND_LOG.md round 21 lessons and round 22 allocation (lanes 1, 2)"]
CTL_ADD = ["CYC (Beurling-type telescoping product, meromorphic, dense local pole lattices): must fail at a step that reads multiplicative independence of the norms",
           "V6 and THIN x V6 (non-multiplicative, unimodular, pass Landau positivity on F F*/zeta^2): any step marked 'multiplicativity essential' is run against them before a flag is entered (R1 test)",
           "NWM (zeta's functional equation, pole at 1 only, real frequencies, infinite order): any step that reads the functional equation and the pole clause without integrality or a growth bound"]
U4_EVID = (" Round 22 (record lane " + LANE + "): state set to CLOSED on the second referee file " + U4F + " (Lemma S, Proposition M and K3-M hold, re-derived; one wording correction, the T-NR clause of K3-M; the stage-A stop stands). "
           "Scope, as that file states: the closure is of the reads tried (first order, group law, quadratic, joint phase, second-order mixed form; STRATEGY section 3.1 items 56, 59, 66); Lemma S and Propositions M, C cover window vectors with bounded norm(h_0')/norm(h_0) and polynomial words, not inverses, determinants or theta' >= 1; "
           "the stage-A failures of E_a, fixed-q twins, DH and HEAT remain ARGUED; THIN (b = 0.75) and DEL (b = 0.55, 0.75) with zeta's Arch imposed fail step S3 at explicit windows (2e7-height float64 scan on the server, selected windows re-evaluated at 30 digits, not ball arithmetic; rerun in balls owed by c22-w1-u4-windows-del09-heat-limit-ball-server); DEL at b = 0.9 is not decided. "
           "The companion census lane c20-mixed-form-control-census-server has one referee. The earlier sentence of this field 'Set the state here when that file holds' is discharged by this edit. Not a statement about zeros of zeta.")
block = (
 "# ---- " + LANE + " (round 22, record lane B). Previous file: scratch/mk_devices.pre-c22-record.py.\n"
 "# (1) Cell U4 -> closed on its second referee file (on disk; asserted below). (2) BR-2 device text narrowed to the dense\n"
 "# remainder; set condition repaired per E3 of the referee of the c21 record lane. BR-3 is closed by the planner (R22_STATE).\n"
 "_R22_U4F = " + repr(U4F) + "\n"
 "assert os.path.exists(os.path.join(HERE, '..', '..', _R22_U4F)), 'referee file missing: ' + _R22_U4F\n"
 "R22_CELL_STATES = {'silent-cell-u4': 'closed'}\n"
 "R22_CELL_EVIDENCE = {'silent-cell-u4': " + repr(U4_EVID) + "}\n"
 "assert set(R22_CELL_EVIDENCE) <= {c[0] for c in CELLS}\n"
 "CELLS = [(i, R22_CELL_STATES.get(i, s), n, e + R22_CELL_EVIDENCE.get(i, ''), nodes) for i, s, n, e, nodes in CELLS]\n"
 "_BR2 = 'br2-sparse-pole-lattice-regime-k'\n"
 "R21_NAMES[_BR2] = (" + repr(NAME) + ", " + repr(EVID) + ")\n"
 "PROPOSED[_BR2] = dict(PROPOSED[_BR2], status=" + repr(STATUS) + ", entryConditions=" + repr(ENTRY) + ",\n"
 "    sources=[s for s in PROPOSED[_BR2]['sources'] if 'the planner' not in s] + " + repr(SOURCES_ADD) + ",\n"
 "    controlsThatMustFail=PROPOSED[_BR2]['controlsThatMustFail'] + " + repr(CTL_ADD) + ")\n"
 "assert str(PROPOSED[_BR2]['status']).startswith('proposed')  # generate.py: no penalty waiver for a proposed type\n"
 "# ---- end of block " + LANE + "\n")
p = os.path.join(B, 'engine/curated/mk_devices.py')
s = open(p, encoding='utf-8').read()
anchor = "D += [(i, R22_STATE.get(i, 'open'), R21_NAMES[i][0], R21_NAMES[i][1], [i]) for i in sorted(R21_PROPOSED)]\n"
assert s.count(anchor) == 1
if LANE + ' (round 22, record lane B)' not in s:
    s = s.replace(anchor, block + anchor)
    hdr = "Edit this file, then run it, then build_graph.py."
    assert s.count(hdr) == 1
    s = s.replace(hdr, hdr + "Edited by " + LANE + " (round 22): block R22-record. Cell U4 cell -> closed on its second referee file (scope in the evidence); BR-2 device text narrowed to the dense remainder with the set condition of regime (K) (E3). ")
    open(p, 'w', encoding='utf-8').write(s)
    print('mk_devices.py: block inserted')
# nodes
np_ = os.path.join(B, 'engine/nodes/nodes-23.json')
d = json.load(open(np_, encoding='utf-8'))
for n in d['nodes']:
    if n['id'] == 'br2-sparse-pole-lattice-regime-k':
        n['name'] = "Proposed, decided on the sparse side: BR-2, dense remainder of regime (K): natural boundary on the critical line or a twin"
        n['statement'] = ("Proposed device type; an identification question. Relative Euler product with abs(alpha_q) = q^(1/2) (phases free) on a set S of primes and alpha_p = 1 off S. Set condition: " + SET_COND + ". "
                          "The local factor at q in S has poles on the lattice 1/2 + i(theta_q + 2 pi k)/log q (the reading of the prime torus and of the zero channels in the geometric program). "
                          + SPARSE + " " + REMAINDER + " On file for the remainder (two referee files): Theorem C: a twin in regime (K) has no zero off the line beyond zeta's, and a twin of finite order has a zero of G/zeta on the line. "
                          "A natural-boundary proof is an identification-type row (score 0); a twin is an on-line control. Not a statement about zeros of zeta.")
        n['source'] = (n['source'].split('; text narrowed')[0] + "; text narrowed to the dense remainder and set condition repaired (E3) by push/" + LANE +
                       " on push/c21-br2-sparse-pole-lattice-natural-boundary-or-twin and push/c21-br2-relative-product-pole-lattice-census-server (one independent referee each)")
        for t in ('natural-boundary', 'beurling'):
            if t not in n['tags']:
                n['tags'].append(t)
    if n['id'] == 'twin-screen-ts':
        n['status'] = 'proved'
        n['usesMultiplicativity'] = 'no'
        n['heightUniform'] = 'no'
        n['statement'] = ("A filter, not a device and not a lead; a tool applied to a device, statistic or combination before a lane is launched. File: push/c21-twin-screen-ts/TWIN_SCREEN.md (92 typed rows; one independent referee, holds with corrections J1 to J7). "
                          "What the status 'proved' covers: (a) Lemma TS-1 (i), elementary: for N = zeta/G = sum c(n) n^-s with c(1) = 1, a_G(n) = 1 for all n < P if and only if c(n) = 0 for 2 <= n < P; for an Euler product this is c(p^k) = 0 for p^k < P; neither the functional equation nor the Euler product is needed (one independent referee). "
                          "(b) The three reasons as statements with their own referee files. Reason 1, window scalar (Lemma S of c20-u4-second-order-archimedean-mixed-form, two referee files): on window vectors at height t the archimedean side is a scalar up to 8 log t / t, so a form pairing the prime side below P with the gamma side is the first-order band form times a scalar. "
                          "Reason 2, twin invisibility at a stage (K3-M, two referee files, with Theorem A of the euler-shape lane, two referee files): every form reading Lambda(n), n < P, with the gamma side takes the same value for zeta and for twins modified at a prime q >= P (HQ1, HQ3, HQ4 at q >= P; HQ2 at q^2 >= P). "
                          "Reason 3, stage-level tests are not arithmetic (Lemma E, one referee; Theorem C of the line-2 lane, two referee files): zero-free finite stages exist for Davenport-Heilbronn, and a non-Euler series with off-line zeros passes Pick positivity to any order on bounded node ranges. "
                          "What it does not cover: the typing of the 92 rows is a reading of the record, not a theorem; the three reasons cover 7 device types in full and 5 in part of 56 typed rows (referee J1 to J3), so the screen is not a sufficient launch filter alone, and each row carries the kind of its closing row (fixed control, identity, restatement). "
                          "Lemma TS-1 (ii) to (iv) are relative to Theorems A and C of the euler-shape lane. Rule (STRATEGY version 6, section 2): from round 22 no lane is launched before its row of TS exists; a row to which one of the three reasons applies is not launched; a row marked 'none of the three' is a candidate of the inverse-explore slot. Not a statement about zeros of zeta.")
        n['source'] = ("push/c21-twin-screen-ts (TWIN_SCREEN.md, RESULT.md, REFEREE.md with the independent pass I-1 to I-3); campaign/STRATEGY.md section 2 (twin screen rule); "
                       "entered by push/c21-record-engine-states-statement-o-v5-br-nodes; status and statement set by push/" + LANE + " (round 22) so that build_graph.py assigns the role 'rigid' (type tool, status proved) and generate.py can pool the node as the tool of move M3")
json.dump(d, open(np_, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('nodes-23.json written')
