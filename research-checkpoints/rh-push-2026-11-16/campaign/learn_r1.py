#!/usr/bin/env python3
"""Round 1 learn step: writes lanes.jsonl lines, engine/outcomes/<slug>.json, updates engine/outcomes.json."""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round1_records.json")))
META = {
 "c1-pd-log-strip": dict(kind="explore", tags=["euler-product","explicit-formula","zero-free"], restatement=True, okind="restatement-of-rh",
   title="Positive-definiteness of log zeta(sigma+iu) left of Re s = 1",
   obstruction="The compensated positivity CP(sigma) is equivalent to 'no zeros with Re s > sigma'; the direction CP => zero-free uses only the prime-free half-line x < 0. Raw positive-definiteness fails for every sigma < 1. The PD kernel ends at the pole on the diagonal, so there is no transport in sigma (three named mechanisms fail; no general no-transport theorem).",
   defeat=["sign-positive twists (pass)","Beurling (pass)","E_a = zeta(s+a)zeta(s-a) (passes for sigma > 1/2+a, measured)","six controls assessed structurally, not run"]),
 "c1-shear-hecke-fricke": dict(kind="explore", tags=["shear","hecke","klein","bridge"], restatement=True, okind="multiplicativity-identity-not-inequality",
   title="Sheared Hecke commutator at tau -> 0 with Fricke involution",
   obstruction="[V_n, G_tau] = G_tau(exp(tau l(u+l)/4) - 1)V_n; the eigen-defect order in tau is 1 iff coefficients are completely multiplicative at p, else 0, and no higher order exists. The statement is an identity (multiplicativity at p), not an inequality. w_4 on the X_0(4)(R) arc is u -> -u (evenness only). The sheared prime expansion converges on the critical line only for tau < 0, where the conclusion is false (carry to tau = 0 is heuristic, Rodgers-Tao).",
   defeat=["completely multiplicative sign twists (order 1, same as zeta)","zeta(s+0.3) (order 1)","unimodular twist (order 1)","Beurling (order 1)","backward heat (tau < 0 side is where the expansion converges)"]),
 "c1-multidelay-bohr-section": dict(kind="explore", tags=["passive","torus","euler-product"], restatement=False, okind="restatement-of-rh",
   title="Joint multi-delay (Bohr torus) inner sections of the prime chain",
   obstruction="Within the unipotent chain family a block of prime sections has rank-one additive J-defect, so joint contractivity is the scalar inequality Re U_P <= Re G and twists are torus translations. For finite P no positive-real function of several prime delays can be split off xi'/xi (Theorem B). The sharp section fails at fixed sigma < 1 for large Q (pole term). The Fejer-tapered section is an explicit-formula identity equivalent to RH that uses no multiplicativity. Open: infinite P, general J-inner linear-fractional sections, DH analogue.",
   defeat=["sign and unimodular twists (torus translations; fail at the same prime as zeta at sigma = 1/2 in the sharp section)","tapered section separates zeta from twists only as an RH-equivalent identity; separation is window-dependent at sigma = 0.6"]),
 "c1-leeyang-chain-closure": dict(kind="deepen", tags=["lee-yang","finite-stage"], restatement=False, okind="kernel-positivity-shared-with-controls", lemmasDecided=1,
   title="Closure of pair-ferromagnet chains inside the Lee-Yang class",
   obstruction="The closure of pair-ferromagnet laws is a proper subclass of the Lee-Yang class (n >= 5: FK cone; limit sense: GHS), but the separating conditions (GHS, FK cone) are kernel-side positivity that Phi and the DH kernel both satisfy, so they carry no zero information. Whether membership of Phi in the closure is strictly stronger than RH is not established. R1 holds at stage level only.",
   defeat=["DH (GHS holds, measured)","unimodular twist U (passes every stage)","sign twists (pass every stage)","Beurling (passes every stage)","E_a and T-NR (pass heat-coupled stage at small log M; T-NR passes at q = 29, c = 2.5)"]),
 "c1-missing-controls": dict(kind="repair", tags=["control","heat-flow"], restatement=False, okind="filter-repair",
   title="Controls not run in earlier lanes",
   obstruction="Filter repair, no attack. Every missing control gave the inferred outcome; no mechanism passes a control in full. Sign twists pass the DH-failing coefficient steps exactly and fail at the functional-equation step. Fixed shifted pairs are not interlacing partners of Xi (relative to Selberg CLT and Bohr-Jessen, cited). Not done: Ritz run of K[t] for the heat family; a TW twist with a zero in 7/8 < Re s < 1; height-dependent shifts.",
   defeat=["not applicable (the lane runs controls: TW+, TW-, backward heat at tau = -0.1, -0.5, -2, DH theta kernel)"]),
 "c1-leeyang-krein-limit": dict(kind="combine", tags=["lee-yang","de-branges","finite-stage","hankel"], restatement=False, okind="restatement-of-rh",
   title="Lee-Yang stages and a Krein-space limit",
   obstruction="Rank Gamma_- is lower semicontinuous under bounded weak-* convergence, but in the self-dual conductor normalisation every stage symbol tends to the constant -1 on Re z > 0 for zeta and every unimodular twist, so the chain carries no information. With gamma factor and pole renormalisation the stage has one right-half-plane pole per stage zero (measured), liminf rank infinite. In the strip topology the limit step is Hurwitz plus local boundedness of pole-renormalised Euler stages, which is equivalent to the zero-free statement (von Koch). The Lee-Yang inequality gives a stage bound weaker than the trivial one.",
   defeat=["unimodular twist U (same stage behaviour; fails only at the open step)","random unimodular twists (same pole counts, measured)"]),
 "c1-spinor-hecke-primitive": dict(kind="combine", tags=["spinor","hecke","weil","moebius"], restatement=False, okind="function-independent-congruence", brokenProved=1,
   title="Joint Hecke-primitive tests in the bridge energy H_c",
   obstruction="For a finite set S of primes, jointly S-primitive tests are dense (L^2 and Q) in the test class, so the infimum of Q/norm^2 over primitive tests equals the infimum over all tests: the restriction neither helps nor costs. The Gram matrix of dilations does not contain the function's coefficients. All-prime Hecke sums lie in the radical of the zero sum. Referee does not hold the result as written (Lemma 3(a) domain: inverse of M_S does not preserve compact support; 'this is P10 itself' not established).",
   defeat=["DH, Liouville twist, random signs, E_a, T-NR: sign of the minimum eigenvalue unchanged by the primitive restriction (float64, measured)"]),
 "c1-window-sdp-scaling": dict(kind="compute", tags=["pick","explicit-formula","certificate"], restatement=False, okind="linear-in-zero-measure-prime-blind",
   title="Windowed semidefinite coupling of Pick positivity with the explicit formula",
   obstruction="The real-node Pick matrix is linear in the zero measure, on-line pairs add PSD terms, and the LMI never contains the primes; so the joint window SDP equals the explicit-formula LP (delta*_joint = delta*_EF, T in 1e2..1e6, K <= 24; grid-certified on five node families, node-uniform statement open at (100,24)). No exclusion for L <= L*/2 at any height. Untested: an LMI whose on-line terms are not sign-definite (sector matrices P+-B).",
   defeat=["DH (accepted at its true quartet)","sign-twisted primes (same kind of exclusion sets)"]),
}
ENGV = {"precise-obstruction": "closed", "partial-result": "partial"}
os.makedirs(os.path.join(ROOT, "engine", "outcomes"), exist_ok=True)
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
have = set()
if os.path.exists(lp):
    for l in open(lp):
        try: have.add(json.loads(l)["slug"])
        except Exception: pass
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op))
by = {o["slug"]: o for o in eng}
with open(lp, "a") as f:
    for r in recs:
        m = META[r["slug"]]
        holds = bool(r["refHolds"])
        sc = (sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds and not m["restatement"] else 0)
        if r["slug"] not in have:
            L = dict(r); L.update(kind=m["kind"], refereeHolds=holds, referees=1, restatement=m["restatement"],
                             knownArchitecture=False, brokenProved=m.get("brokenProved", 0),
                             lemmasDecided=m.get("lemmasDecided", 0), obstructionKind=m["okind"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 1, "kind": m["kind"], "nodes": [], "tags": m["tags"],
               "verdict": r["verdict"], "survivingClaim": r["surviving"], "obstruction": m["obstruction"],
               "obstructionKind": m["okind"], "controlsThatDefeat": m["defeat"], "score": sc,
               "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
               "refereeHolds": holds, "referees": 1, "aboutZeros": bool(r["aboutZeros"]),
               "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"]}
        json.dump(out, open(os.path.join(ROOT, "engine", "outcomes", r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
        e = by.get(r["slug"])
        if e is None:
            e = {"slug": r["slug"], "nodes": [], "tags": m["tags"], "title": m["title"], "path": "push/" + r["slug"]}
            eng.append(e); by[r["slug"]] = e
        e["verdict"] = ENGV[r["verdict"]] if holds else "open"
        e["tags"] = sorted(set(e.get("tags", [])) | set(m["tags"]))
        e["note"] = "round 1, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold as written", m["obstruction"][:300])
tmp = op + ".tmp"
json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
