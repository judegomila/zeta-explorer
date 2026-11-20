#!/usr/bin/env python3
"""Round 13 learn step. Idempotent. Lines self-registered by lanes (campaign/lanes.jsonl, push/<slug>/lanes_line.json or
push/<slug>/lanes.jsonl) are replaced in place by the refereed record (lane metadata kept); writes engine/outcomes/<slug>.json
and the engine/outcomes.json entries; applies push/c13-referee-r12-independent/referee_updates.json to the round-12 lines
(one added referee per lane, marker secondReferee). Device states in engine/curated are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round13_records.json")))
NR = "not run: "
META = {
 "c13-kacmoody-eisenstein-affine-weyl-shift": dict(kind="explore", engv="closed", title="Borel Eisenstein series on the loop group of SL_2 (affine Weyl shift)",
  obstruction="Stage A. Coefficients are chain products of M(u) = xi(u)/xi(u+1) at u = z+kc, kc-z; in the chamber 0 < Re z < Re c every denominator argument has Re > 1 and strip arguments occur only as numerator zeros (relative to the recalled Garland / Fleig-Kleinschmidt-Persson normalisation, sources not opened). Rank-one Maass-Selberg positivity for all T >= 1 is equivalent to N = z(1-S)/(1+S) being Nevanlinna in z^2 (proved) and is preserved under Blaschke factors over non-real conjugate pairs anywhere in Re z > 0 (proved), so it gives no constraint on numerator zeros. Scope: rank-one proved; closure for the two-variable affine Gram kernel argued, not proved.",
  defeat=["T-NR with c > 2 (a convergent Blaschke product; passes every analytic step)", "BLS (new Blaschke control at the scattering level; passes)", "DH passes the formal inequality at computed heights (to 122; measured)", "formal E_a fails on grids (measured; no separation needed, the device is closed by T-NR and BLS)"]),
 "c13-fourier-interpolation-zero-nodes": dict(kind="explore", engv="closed", title="Fourier interpolation with zero nodes (Radchenko-Viazovska, Bondarenko-Radchenko-Seip)",
  obstruction="Stage A. The BRS kernel is (F*(s)/F*(w)) x A_k(w,s) with A_k independent of the target (relative to arXiv:2005.02996); bases of one gamma class form one orbit under symmetric multipliers G(s)/G(w) (Lemma M, identity). The construction uses a Dirichlet series and a functional equation; the Euler product enters only through |mu| <= 1, which stops at Re w = 1. Off-line nodes move the partial-sum exponent from 1/4 to beta/2 < 1/2, compatible with the one non-identity inequality (exponent 1/2). 'Partial-sum exponent kappa implies no zero with Re rho > 2 kappa' is proved-rel in that direction only.",
  defeat=["T-NR (passes every step; Lemma T; truncation-height step argued)", "window translate (passes)", "DH and theta^w (pass in a smaller function class; (I-1) fails for DH without stopping the construction)", "E_a open at the gamma-class step (no kernel constructed for Gamma_R(s+a)Gamma_R(s-a))"]),
 "c13-lrs-twist-amplification-zero-representation": dict(kind="explore", engv="closed", title="Luo-Rudnick-Sarnak twist amplification on E*(z, rho/2)",
  obstruction="Stage A. At xi(rho) = 0 the completed Rankin-Selberg function has one simple pole pair, but at P = 2 - beta; the gamma pole read by the mechanism is at 1 - beta, so pole minus parameter is 1 for every beta. The vanishing forced there is the trivial zero L(0,chi) = 0 of even chi, an identity for every parameter. The inequality reduces to beta <= 7/4 (vacuous; exponent count reconstructed, paper not opened). Same for Borel Eisenstein data of any rank at regular parameters. Open cell without a candidate: non-Borel Hecke eigen-object with parameter rho, entire twists and pole strictly left of 2 - beta.",
  defeat=["Eisenstein series at a generic parameter (E_a, EIS-w): passes every step with the same output", "window translate: passes", NR+"T-NR and DH (no Hecke eigen-object; not formulable)"]),
 "c13-tnr-invariance-prefilter-noncone-census": dict(kind="combine", engv="closed", title="T-NR invariance pre-filter (Lemma P) and census of non-cone inequality types",
  obstruction="Pre-filter and census. Lemma P: T-NR with c > 0 satisfies every hypothesis of type S1 (linear identities), S2 (dilation-invariant convex cone conditions on objects linear in F) and S3 (conditions at primes other than p0); exclusions X1-X5. Device table: 13 of 37 types carry a T-NR record, 0 disagreements. Lemma L: T-NR weights totally positive iff c >= 2. Lemma E: the xi-kernel of E_a inherits every Polya-frequency order. Census of 12 non-cone types: no entry fails both T-NR and E_a at an unconditional input of zeta that another control does not pass; order-4 theta-kernel minors fail both in measurement but theta^(1/2), theta^(1/3), theta^3 pass. Edrei-Thoma local total positivity closed as a device.",
  defeat=["T-NR (cone conditions, lattice-aligned minors, Edrei-Thoma for c >= 2)", "E_a (translation-type determinantal conditions on the xi-kernel; Edrei-Thoma)", "theta^w for w = 1/2, 1/3, 3 (order-4 theta-kernel minors)"]),
 "c13-bilinear-reciprocity-height-antibridge": dict(kind="combine", engv="closed", title="Bettin reciprocity at height t for the bilinear pair, read as an antibridge J-form",
  obstruction="Decisive test. The reciprocity is Voronoi summation for E(z, 1/2+it): the height is a spectral parameter, zeta's functional equation enters only through the gamma kernel, arguments are tied at (s+j, s-j); no kernel in two heights and no Hermitian pair at t != 0. J-form entries (q/pi)^(1/2) Z_chi(t) Z_chi(-t) are real with sign (-1)^(zero count in the window), fixed by the argument principle whether or not zeros are on the line. The only one-sided statement is squares on real characters (identity). Mixed-weight cone statement (Theorem 4(d)) measured on q = 5, 7 only.",
  defeat=["T-NR (multiplies every entry by a positive number; passes every step)", "E_a with real a (every entry is a Hermitian square; positivity is E_a's property, not zeta's)", "DH (pair entries real exactly for q = +-1 mod 5)"]),
 "c13-noncone-kernel-separator-search": dict(kind="compute", engv="closed", title="Search for a non-cone sign functional of the theta-normalised kernel separating L-functions from the control battery",
  obstruction="Registered question, outcome 'none' (MEASURED, finite search). Dictionary D (minors of orders 2-4 of K(u_i + log n_j); Turan-type expressions, also Hecke-compensated; kernels with and without polar terms; at most 3 real parameters): 12,994,697 functionals x 290 objects; none is one-signed on zeta and the characters q <= 13 and opposite on a battery member of every control class. Of 629,432 functionals one-signed on the positives, 0 reject battery DH and 400 reject backward heat. The positive condition itself does not hold out (held-out L-functions q 14-40 opposite at mean rate 0.287). Lemma H proved for order-2 expressions. Not run: Hermitian forms for complex kernels, orders above 4, functionals reading zeta and a twist jointly.",
  defeat=["battery DH (same sign as zeta on every one-signed functional)", "backward heat (rejected by 400 of 629,432; Lemma H for order 2)", "E_a, EIS-w, theta^w (keep the Polya-frequency sign pattern more often than character kernels)", "T-NR does not pass D1 (pass fraction 0.646) but no functional separates it together with every other class"]),
 "c13-repair-map-engine-battery-records": dict(kind="repair", engv="partial", title="Record repair: corrected c11-rs3 screen, battery D1 20 of 20, HEAT list completed, map 186 -> 191 rows",
  obstruction="Record lane, no attack. c11-rs3 screen recomputed in 320-bit balls: 31 of 54 minima and 2 of 54 fail counts change, no verdict changes. D1 20 of 20 against the corrected record (a reproduction of one changed number, not a blind test); D2-D5 not rerun. HEAT tau = -0.5 list 294 pairs, box counts balance; measured, not certified. Corrected files sit in the lane only.",
  defeat=["not applicable (repair lane)"]),
 "c13-referee-r12-independent": dict(kind="repair", engv="partial", title="Independent second referee of five round-12 statements",
  obstruction="Record lane, no attack. All five statements hold, four in a narrower form: Lemma X needs |t| >= t_r and threshold C_r p^ceil(k/r)|t|^(1/r); Bost-Connes product-measure / 'no zeta' statements for the Galois-invariant KMS state only; the complex-point T-NR twin has c < -2 with zeros outside the strip; Lemmas S, T given Conrey-Li Theorem 2; UNIV relative to the survey's Theorem 7, U4 argued. Not refereed: depth-lane point G1, UNIV part (b), heat cell 1.",
  defeat=["not applicable (referee lane)"]),
}
LEM = {"c13-kacmoody-eisenstein-affine-weyl-shift": 1, "c13-fourier-interpolation-zero-nodes": 1, "c13-lrs-twist-amplification-zero-representation": 4,
       "c13-tnr-invariance-prefilter-noncone-census": 3, "c13-bilinear-reciprocity-height-antibridge": 4, "c13-noncone-kernel-separator-search": 1,
       "c13-repair-map-engine-battery-records": 0, "c13-referee-r12-independent": 0}
DEFTAGS = {"c13-referee-r12-independent": ["record", "referee", "control", "t-nr", "universality", "bost-connes", "depth-aspect"]}
def lane_line(slug):
    d = os.path.join(ROOT, "push", slug)
    for fn in ("lanes_line.json", "lanes.jsonl"):
        p = os.path.join(d, fn)
        if os.path.exists(p):
            t = open(p).read().strip()
            try: return json.loads(t)
            except Exception:
                try: return json.loads(t.splitlines()[-1])
                except Exception: pass
    return {}
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
old = [json.loads(l) for l in open(lp) if l.strip()]
bys = {d["slug"]: i for i, d in enumerate(old)}
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
OD = os.path.join(ROOT, "engine", "outcomes")
for r in recs:
    m = META[r["slug"]]; holds = bool(r["refHolds"])
    sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
    prev = dict(lane_line(r["slug"]))
    if r["slug"] in bys: prev.update(old[bys[r["slug"]]])
    prev.pop("resultFile", None)
    if isinstance(prev.get("lemmasDecided"), list): prev["lemmasList"] = prev.pop("lemmasDecided")
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=1, round=13)
    L["heavy"] = r["slug"] == "c13-noncone-kernel-separator-search"
    for k, dv in (("restatement", False), ("knownArchitecture", False), ("nodes", []), ("tags", []), ("obstructionKind", "")):
        if L.get(k) is None: L[k] = dv
    if not L["tags"]: L["tags"] = DEFTAGS.get(r["slug"], [])
    if not isinstance(L.get("lemmasDecided"), int) or not L.get("lemmasDecided"): L["lemmasDecided"] = LEM[r["slug"]]
    L["brokenProved"] = 0   # referees report no PROVED step broken in round 13
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    out = {"slug": r["slug"], "round": 13, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
           "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": L.get("obstructionKind", ""),
           "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
           "refereeHolds": holds, "referees": 1, "aboutZeros": bool(r["aboutZeros"]),
           "refereeNote": r["errors"] + " - [truncated in the learn-step input; full text in REFEREE.md]",
           "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"],
           "refereeFile": os.path.join(os.path.dirname(r["file"]), "REFEREE.md"),
           "launchedNodes": [n for n in nodes if not n.startswith("out-")], "engineVerdict": m["engv"]}
    json.dump(out, open(os.path.join(OD, r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
    e = by.get(r["slug"])
    if e is None:
        e = {"slug": r["slug"], "path": "push/" + r["slug"]}; eng.append(e); by[r["slug"]] = e
    e.update(nodes=nodes, launchedNodes=out["launchedNodes"], tags=tags, title=m["title"], refereeHolds=holds,
             aboutZeros=bool(r["aboutZeros"]), lesson=r["lesson"], verdict=m["engv"])
    e["note"] = "round 13, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
# second referees on round-12 lanes
up = json.load(open(os.path.join(ROOT, "push", "c13-referee-r12-independent", "referee_updates.json")))
applied = []
for u in up.get("updates", []):
    s = u.get("slug")
    if s not in bys: continue
    L = old[bys[s]]
    if not L.get("secondReferee"):
        L["referees"] = int(L.get("referees") or 0) + int(u.get("independentRefereesAdded") or 0)
        L["secondReferee"] = {"by": up.get("by"), "outcome": u.get("outcome"), "narrowerForm": u.get("narrowerForm"),
                              "downgrades": u.get("downgrades", []), "upgrades": u.get("upgrades", []), "report": u.get("report")}
    fp = os.path.join(OD, s + ".json")
    if os.path.exists(fp):
        o = json.load(open(fp))
        o["referees"] = L["referees"]; o["secondReferee"] = L["secondReferee"]
        json.dump(o, open(fp, "w"), indent=1, ensure_ascii=False)
    applied.append((s, L["referees"]))
tmp = lp + ".tmp"
with open(tmp, "w") as f:
    for d in old: f.write(json.dumps(d, ensure_ascii=False) + "\n")
os.replace(tmp, lp)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", len(old), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng), "second referees:", applied)
