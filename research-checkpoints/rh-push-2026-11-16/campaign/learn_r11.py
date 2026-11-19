#!/usr/bin/env python3
"""Round 11 learn step. Idempotent. The eight c11 lanes self-registered a lanes.jsonl line before their referee ran
(refereeHolds null/false). This step replaces each such line in place with the refereed record (lane metadata kept),
writes engine/outcomes/<slug>.json and the engine/outcomes.json entries. Device states in engine/curated are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round11_records.json")))
NR = "not run: "
META = {
 "c11-rs1-twist-modulus-reciprocity": dict(kind="explore", engv="closed", title="RS-1: twist-modulus reciprocity of twisted second moments",
  obstruction="Stage A. J_p(s;a) = 1 - sum_chi |F(s,chi)A_chi(s) - 1|^2: for X >= p-1 with free weights sup_a J = 1 - #{chi: F(s,chi) = 0} (zero-one law, a restatement). The reciprocity (three-term identity at s = 1, odd characters, distinct odd primes) moves the twist into the modulus but reads only periodicity and the functional equation of the twists; the target's s <-> 1-s is read in 0 steps. T-NR's twisted second moments are a nine-term combination of zeta's at every s, so T-NR passes steps S0 to S4 and its S5 is false at its off-line zeros. Not established: E_a pass for candidate (C), centre statements (Conrey, Young, Bettin not opened), DH row.",
  defeat=["T-NR (passes every step; proved at s = 1)", "window translate (passes by substitution)", "E_a with real a (passes on its central line; not established for candidate (C))", NR+"DH, heat, THIN, U, Beurling"]),
 "c11-rs1-regular-rep-matrix-bridge": dict(kind="explore", engv="closed", title="RS-1: matrix Dirichlet series over the regular representation of (Z/q)^* with the bridge square",
  obstruction="Stage A, for the displayed candidates (K), (E), (Q), (H) only. Every bridge object built from M_q lies in commutative C[G] and is a direct sum over characters (Lemma S). The vector 1 is in the cone and is the chi_0 eigenvector, so each cone-quantified statement restricts at v = 1 to a scalar statement about zeta; for (K) and (E) that is H_c^zeta >= 0, which is RH (Lemma P). (Q) at threshold o(1/phi) is a restatement. Entry positivity is character orthogonality and ends at s = 1; the functional-equation matrix has negative entries. Not a theorem that no inequality on M_q exists (cone-preservation forms not examined).",
  defeat=["E_a matrix lift (keeps entry positivity, Euler product, functional equation, periodicity; off-line zeros on the Perron direction)", "T-NR matrix lift (same)", "THIN, U, DEL (keep positivity and the Euler product)", "DH is outside the device (weight not in C[G])"]),
 "c11-rs3-debranges-positivity-family": dict(kind="explore", engv="closed", title="RS-3: de Branges shift positivity and its variants",
  obstruction="Stage A. The entire-function condition implies zeros on the line and cos Delta_h >= 0 at every zero (Delta_h = sum over other zeros of arctan(h/(gamma_n - gamma'))); the weight form implies Delta_h = 0 mod 2 pi at every boundary zero. False for zeta: zero 34 at h = 1 (Conrey-Li, reproduced); weight form fails at the first zeros for h = 1, 0.25, 0.1 (measured). The (a,h) weight family is false for every conclusion half-plane sigma_0 <= 1 relative to Bohr (recalled). V1a = T3 and V2 = G6 are restatements. No Euler-product step. Not established: every-h failure in the entire-function form, tied conductor family V3b, attribution of the failure to the Euler product.",
  defeat=["the hypothesis is false for zeta itself", "lattice-zero function (satisfies all hypotheses and necessary conditions)", "DH on-line zeros fail like zeta (no separation)", NR+"backward heat at the zeta-failing step"]),
 "c11-ff-genus2-probe-jk": dict(kind="deepen", engv="closed", title="F_q[T] probe signal on genus 2 and 3 targets",
  obstruction="F_q[T] model, squarefree conductors of degree 5 and 7, N <= 3. S_cop(k) is a polynomial in L_1..L_N, the same for genus 2 and 3, linear in Frobenius traces only at N = 1. At N = 1, 0 <= S^2 <= (g/2)(-D.D)/q is Cauchy-Schwarz inside the symmetric block of the graph-class form; ratio anywhere in [0,1], no lower bound. The symmetric block reads only reality of alpha + q/alpha; the Weil bound sits in the antisymmetric block, which the signal does not meet. Registered outcome (b). J_k itself not computed (answer is for S_cop inside the round-8 law).",
  defeat=["fakes with real off-line root pairs (pass 96 of 96; referee 288 of 288 and 160 of 160 new)", NR+"DH-type model weight, heat, THIN, U, E_a, T-NR, Beurling"]),
 "c11-del-device-read-confirm": dict(kind="combine", engv="partial", title="DEL control against the device table: read sets confirmed",
  obstruction="Record lane. Corrected DEL table: 10 or 11 pass / 23 or 24 (c10 said 14 / 20). No closed device whose read set omits both the functional equation and periodicity lacks a passing control. Devices with no control passing every step (coherent-set-large-sieve, landau-siegel-mechanism, selberg-operator, and circularity closures) read periodicity or are not attacks. A read set containing the exact integer count is passed by E_a and is an identification under residue 1 (Lemma J). In degree one the functional equation gives periodic coefficients up to a height translate (relative to Kaczorowski-Perelli, not opened), so no control with Euler product, unimodular parameters and zeta's functional equation without periodic twists exists among ordinary Dirichlet series.",
  defeat=["not applicable (record lane)", "central-value-squares form: every control passes it at height t (Lemmas W1, W2)"]),
 "c11-ff-row-energy-four-part": dict(kind="compute", engv="closed", title="F_7[T] completed-row energy: registered exact decomposition at two sizes with seeded classes",
  obstruction="F_7[T], N = 6, d = 2, exact. The squarefree-n part D of the cube term is 0.569/0.603 of the diagonal at lam = 9, 3.9e-5/3.0e-5 at lam = 10, 0 at lam = 11, 2.798/2.980 at lam = 12: the registered constant 1.5 is exceeded at (6,12,2). Lemma M: the mean of |Tf|^2 over unimodular cube coefficients is q^2 sum_m nu(m)|S_0(m)|^2 (companion energy times a count). Random multiplicative-sign and free-sign vectors give D of the same size as the targets. Not established: unboundedness in lam; total row energy at (6,12,2); independent reproduction of the (6,10,2) full-row figures.",
  defeat=["random multiplicative signs (24 seeds, D of the same size: no separation)", "free unimodular signs (24 seeds, same)", NR+"DH-type model weight, heat, E_a, T-NR, Beurling"]),
 "c11-frontier-nth-order-sieve": dict(kind="deepen", engv="closed", title="Part B: de Faveri n-th order large sieve (n = 6) on rows Z12, Z6, Z5, Z14; Ji ledger replay",
  obstruction="Part B, relative to de Faveri 2610.04045 Theorem 1.1 (unrefereed; n = 6 coverage matching not checked) and the unrefereed 7/8 manuscripts. Replacing (KD)^(2/3) by the n = 6 bound changes no figure: Z12 count option 7/6 - delta is above R at every class (proved); Z6 Q^0.75 against Q^(1/2 - eta); Z5 Gram exponent 1/6 = the cap; Framework A on the Poisson dual has exponent 2 at every order; reduced LP floor 13/15 unchanged. The manuscripts use the sextic sieve only in the preliminary 11/12 stage (margin -1/24 unchanged). Abscissa stays 0.8748866470. Ji 2611.16665 has no P_a^(1/6)-type term and no r = 6 statement.",
  defeat=["THIN, U and sign twists pass the sieve inequality (arbitrary coefficients)", "not a control question otherwise (part B figure)"]),
 "c11-repair-del-referee-record": dict(kind="repair", engv="partial", title="Record repair: second referee of DEL, Statement O v3, map rows",
  obstruction="Record lane, no attack. DEL_b: Lambda_F >= 0 and a simple real zero at b in (1/2,1), relative to a short-interval prime theorem (Huxley 1972; primary text not opened). Tier E enclosure width depends on the explicit pi - li bound used (4% against a factor 73 to 165). Statement O v3 is a separate file; the c9 file is unchanged pending an independent reader. Map 180 to 182 rows.",
  defeat=["not applicable (repair lane)"]),
}
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
old = [json.loads(l) for l in open(lp) if l.strip()]
bys = {d["slug"]: i for i, d in enumerate(old)}
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
OD = os.path.join(ROOT, "engine", "outcomes")
for r in recs:
    m = META[r["slug"]]; holds = bool(r["refHolds"])
    sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
    prev = old[bys[r["slug"]]] if r["slug"] in bys else {}
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=1)
    L.setdefault("heavy", r["slug"] == "c11-ff-row-energy-four-part")
    if L.get("heavy") is None: L["heavy"] = False
    for k, dv in (("restatement", False), ("knownArchitecture", False), ("brokenProved", 0), ("lemmasDecided", 0), ("nodes", []), ("tags", [])):
        L.setdefault(k, dv)
    L["brokenProved"] = 0   # referees report no PROVED step broken in round 11
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    out = {"slug": r["slug"], "round": 11, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
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
    e["note"] = "round 11, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
tmp = lp + ".tmp"
with open(tmp, "w") as f:
    for d in old: f.write(json.dumps(d, ensure_ascii=False) + "\n")
os.replace(tmp, lp)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", len(old), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng))
