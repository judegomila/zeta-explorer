#!/usr/bin/env python3
"""Campaign scoreboard. Pure Python, text/JSON only, re-runnable.
Reads : ../engine/IDEA_GRAPH.json (or ../engine/nodes/*.json), ../engine/outcomes/*.json,
        ./lanes.jsonl, optional ./frontier.json, ../push/verify-0107965/VERIFICATION_REPORT.md
Writes: ./scoreboard.json, ./SCOREBOARD.md
Definitions: METRIC.md. Never imports repo modules."""
import json, glob, os, re, itertools, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ENGINE = os.path.join(ROOT, "engine")
REPORT = os.path.join(ROOT, "push", "verify-0107965", "VERIFICATION_REPORT.md")
REQ = ["r1", "r2", "r3", "r4"]
CLOSE_WORDS = ("obstruct", "closed", "no-go", "nogo", "refuted", "dead", "restatement", "circular")

CALIBRATION = [
    {"name": "7/8 zero-free half-plane (Lean-checked)", "r1": True, "r2": True, "r3": True, "r4": False,
     "counted": True, "note": "known architecture; excluded from the headline"},
    {"name": "Weil / Pick / bridge identities", "r1": False, "r2": False, "r3": False, "r4": False,
     "counted": False, "note": "restatements (hold at all heights, also for controls); not counted"},
    {"name": "finite Lee-Yang stage theorem", "r1": True, "r2": False, "r3": True, "r4": False,
     "counted": True, "note": "R1 and R3 at stage level only; lost in the limit"},
]
FRONTIER = {
    "zeroFree": {"leanChecked": "7/8 = 0.875",
                 "claimed": "0.874886647",
                 "claimedDependsOn": "preprints Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835; "
                                     "manuscript Lemmas 14.3, 15.2, 18.1, 14.11 not checked; not in Lean"},
    "lambda": {"accepted": "0.2 (Platt-Trudgian)",
               "conditional": "0.116060",
               "conditionalDependsOn": "abscissa 0.87488665 (unrefereed) plus Raymond chain H2-H4 (tables not verified)",
               "raymondClaim": "0.107964910079"},
}

def load_json(p):
    try:
        with open(p) as f:
            return json.load(f)
    except Exception:
        return None

def truthy(v):
    if isinstance(v, str):
        return v.strip().lower() in ("true", "yes", "y", "1", "hold", "holds", "confirmed")
    return bool(v) and v is not None

def get(d, *keys, default=None):
    for k in keys:
        if isinstance(d, dict) and k in d and d[k] is not None:
            return d[k]
    return default

def as_list(v):
    if v is None: return []
    if isinstance(v, (list, tuple, set)): return list(v)
    if isinstance(v, dict): return list(v.keys())
    return [v]

# ---------- graph ----------
def load_graph():
    nodes, src = {}, "none"
    g = load_json(os.path.join(ENGINE, "IDEA_GRAPH.json"))
    raw = []
    if g is not None:
        src = "IDEA_GRAPH.json"
        n = g.get("nodes", g) if isinstance(g, dict) else g
        raw = [dict(v, id=get(v, "id", default=k)) for k, v in n.items() if isinstance(v, dict)] if isinstance(n, dict) else [x for x in n if isinstance(x, dict)]
    else:
        files = sorted(glob.glob(os.path.join(ENGINE, "nodes", "*.json")))
        if files: src = "nodes/*.json (%d files)" % len(files)
        for p in files:
            d = load_json(p)
            for x in (d if isinstance(d, list) else [d]):
                if isinstance(x, dict):
                    x.setdefault("id", os.path.splitext(os.path.basename(p))[0]); raw.append(x)
    for x in raw:
        nid = str(get(x, "id", "slug", "name", default=len(nodes)))
        nodes[nid] = {"tags": sorted({str(t).lower() for t in as_list(get(x, "tags", "tag", default=[]))}),
                      "status": str(get(x, "status", "state", default="")).lower()}
    return nodes, src

def record_tags(rec, nodes):
    tags = {str(t).lower() for t in as_list(get(rec, "tags", default=[]))}
    for nid in as_list(get(rec, "nodes", "nodeIds", "node_ids", "inputs", "ideas", default=[])):
        if isinstance(nid, dict): nid = get(nid, "id", "slug")
        tags |= set(nodes.get(str(nid), {}).get("tags", []))
    return tags

def is_closing(rec):
    s = " ".join(str(get(rec, k, default="")) for k in ("verdict", "status", "outcome", "kind", "result")).lower()
    return any(w in s for w in CLOSE_WORDS)

def obstruction_kind(rec):
    return str(get(rec, "obstructionKind", "obstruction", "wall", "kind", default="unspecified")).lower()[:60]

# ---------- lanes ----------
def load_lanes():
    lanes, bad = [], 0
    p = os.path.join(HERE, "lanes.jsonl")
    if os.path.exists(p):
        for line in open(p):
            line = line.strip()
            if not line: continue
            try:
                d = json.loads(line)
                assert isinstance(d, dict)
            except Exception:
                bad += 1; continue
            h = get(d, "refereeHolds", "referee_holds", "holds")
            flags = get(d, "refereeFlags", "flags", default={}) or {}
            L = {"slug": str(get(d, "slug", default="?")), "round": get(d, "round", default=0),
                 "kind": str(get(d, "kind", default="")).lower(), "verdict": str(get(d, "verdict", default="")),
                 "refereed": h is not None, "holds": truthy(h) if h is not None else False,
                 "referees": int(get(d, "referees", "refereeCount", default=(1 if h is not None else 0)) or 0),
                 "aboutZeros": truthy(get(d, "aboutZeros", default=False)),
                 "restatement": truthy(get(d, "restatement", default=False)),
                 "knownArchitecture": truthy(get(d, "knownArchitecture", default=False)) or "7/8" in str(get(d, "architecture", default="")),
                 "brokenProved": int(get(d, "brokenProved", "provedBroken", default=0) or 0),
                 "lemmasDecided": int(get(d, "lemmasDecided", default=0) or 0),
                 "file": get(d, "file", default=""), "raw": d}
            for r in REQ:
                L[r] = truthy(get(d, r, default=get(flags, r, default=False)))
            L["score"] = sum(L[r] for r in REQ) if (L["holds"] and not L["restatement"]) else 0
            L["missing"] = [r.upper() for r in REQ if not L[r]] if L["score"] else [r.upper() for r in REQ]
            try: L["round"] = int(L["round"])
            except Exception: L["round"] = 0
            lanes.append(L)
    return lanes, bad

def part_AD(lanes):
    elig = [L for L in lanes if not L["knownArchitecture"] and L["score"] > 0]
    best = max(elig, key=lambda L: (L["score"], L["r4"], -L["round"]), default=None)
    refd = [L for L in lanes if L["refereed"]]
    three = [L for L in lanes if L["holds"] and L["referees"] >= 3]
    A = {"headline": {"bestScore": best["score"] if best else 0, "slug": best["slug"] if best else None,
                      "missing": best["missing"] if best else [r.upper() for r in REQ],
                      "file": best["file"] if best else None},
         "lanesWithR4Confirmed": [L["slug"] for L in elig if L["r4"]],
         "scoreHistogram": {str(k): sum(1 for L in lanes if L["score"] == k) for k in range(5)},
         "calibration": [dict(c, score=(sum(c[r] for r in REQ) if c["counted"] else None)) for c in CALIBRATION]}
    D = {"lanesRun": len(lanes), "lanesRefereed": len(refd),
         "refereeHoldRate": (round(sum(L["holds"] for L in refd) / len(refd), 3) if refd else None),
         "provedClaimsBroken": sum(L["brokenProved"] for L in lanes),
         "threeRefereeStatements": len(three),
         "threeRefereeStatementsAboutZeros": sum(1 for L in three if L["aboutZeros"]),
         "aboutZerosClaimsNotYetCounted": [L["slug"] for L in lanes if L["aboutZeros"] and not (L["holds"] and L["referees"] >= 3)]}
    return A, D

def part_B():
    F = json.loads(json.dumps(FRONTIER))
    ov = load_json(os.path.join(HERE, "frontier.json"))
    if isinstance(ov, dict):
        for k, v in ov.items():
            if isinstance(v, dict) and isinstance(F.get(k), dict): F[k].update(v)
            else: F[k] = v
    status = "VERIFICATION_REPORT.md not yet written; status: claimed, unverified"
    if os.path.exists(REPORT):
        txt = open(REPORT, errors="replace").read()
        m = re.search(r"(?im)^[#>*\s-]*\**\s*(overall\s+)?(verdict|status|conclusion)\b[^\n]*(\n[^\n#]+)?", txt)
        status = ("from VERIFICATION_REPORT.md: " + re.sub(r"\s+", " ", m.group(0)).strip(" #>*-")[:400]) if m \
            else "VERIFICATION_REPORT.md exists; no verdict/status line found (read the file)"
    F["lambda"]["raymondStatus"] = status
    return F

def part_C(nodes, src, lanes):
    tags = sorted({t for n in nodes.values() for t in n["tags"]})
    fam = {frozenset(p): [] for p in itertools.combinations(tags, 2)}
    recs, unparsed = [], 0
    for p in sorted(glob.glob(os.path.join(ENGINE, "outcomes", "*.json"))):
        d = load_json(p)
        if d is None: unparsed += 1; continue
        for r in (d if isinstance(d, list) else [d]):
            if isinstance(r, dict): recs.append(("outcome:" + os.path.basename(p), r, truthy(get(r, "refereed", "refereeHolds", default=True))))
    for L in lanes:
        recs.append(("lane:" + L["slug"], L["raw"], L["holds"]))
    n_out = sum(1 for s, _, _ in recs if s.startswith("outcome:"))
    for src_id, r, refereed in recs:
        ts = sorted(record_tags(r, nodes))
        closing = is_closing(r) and refereed
        for p in itertools.combinations(ts, 2):
            k = frozenset(p)
            if k in fam: fam[k].append((closing, obstruction_kind(r)))
    closed = tried = 0
    for k, v in fam.items():
        kinds = {}
        for c, kind in v:
            if c: kinds[kind] = kinds.get(kind, 0) + 1
        if any(x >= 2 for x in kinds.values()): closed += 1
        elif v: tried += 1
    node_closed = sum(1 for n in nodes.values() if any(w in n["status"] for w in CLOSE_WORDS))
    return {"graphSource": src, "nodes": len(nodes), "nodesMarkedClosed": node_closed, "tags": len(tags),
            "families": len(fam), "familiesClosed": closed, "familiesTriedNotClosed": tried,
            "familiesOpenUntried": len(fam) - closed - tried,
            "outcomeRecords": n_out, "outcomeFilesUnparsed": unparsed,
            "openLemmasDecided": sum(L["lemmasDecided"] for L in lanes)}

def history(lanes):
    rows = []
    for rd in sorted({L["round"] for L in lanes}):
        cum = [L for L in lanes if L["round"] <= rd]
        A, D = part_AD(cum)
        rows.append({"round": rd, "lanesThisRound": sum(1 for L in lanes if L["round"] == rd), "lanesCumulative": len(cum),
                     "bestScore": A["headline"]["bestScore"], "bestSlug": A["headline"]["slug"],
                     "missing": A["headline"]["missing"], "holdRate": D["refereeHoldRate"],
                     "provedBroken": D["provedClaimsBroken"], "threeReferee": D["threeRefereeStatements"],
                     "lemmasDecided": sum(L["lemmasDecided"] for L in cum)})
    return rows

def main():
    nodes, src = load_graph()
    lanes, bad = load_lanes()
    A, D = part_AD(lanes)
    D["laneLinesUnparsed"] = bad
    out = {"generated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%MZ"),
           "A_requirements": A, "B_frontier": part_B(), "C_coverage": part_C(nodes, src, lanes),
           "D_reliability": D, "history": history(lanes)}
    with open(os.path.join(HERE, "scoreboard.json"), "w") as f:
        json.dump(out, f, indent=1)
    B, C, h = out["B_frontier"], out["C_coverage"], A["headline"]
    yn = lambda b: "yes" if b else "no"
    md = ["# Campaign scoreboard", "", "Generated %s by scoreboard.py. Definitions: METRIC.md. Four parts, reported separately; there is no combined number." % out["generated"], "",
          "## A. Requirement score (referee-confirmed R1..R4)", "",
          "Headline (best mechanism that is not the 7/8 architecture): **%d of 4**%s; missing: %s." % (
              h["bestScore"], (" (`%s`)" % h["slug"]) if h["slug"] else " (no qualifying lane yet)", ", ".join(h["missing"]) or "none"),
          "Lanes with R4 confirmed: %s." % (", ".join(A["lanesWithR4Confirmed"]) or "none"),
          "Lanes by score 0/1/2/3/4: %s." % " / ".join(str(A["scoreHistogram"][str(k)]) for k in range(5)), "",
          "Calibration:", "", "| known result | R1 | R2 | R3 | R4 | score | note |", "|---|---|---|---|---|---|---|"]
    for c in A["calibration"]:
        md.append("| %s | %s | %s | %s | %s | %s | %s |" % (c["name"], *(yn(c[r]) if c["counted"] else "-" for r in REQ),
                                                           c["score"] if c["counted"] else "not counted", c["note"]))
    md += ["", "## B. Frontier numbers", "",
           "- Zero-free abscissa, Lean-checked: %s" % B["zeroFree"]["leanChecked"],
           "- Zero-free abscissa, claimed: %s (depends on: %s)" % (B["zeroFree"]["claimed"], B["zeroFree"]["claimedDependsOn"]),
           "- Lambda, accepted: %s" % B["lambda"]["accepted"],
           "- Lambda, conditional: %s (depends on: %s)" % (B["lambda"]["conditional"], B["lambda"]["conditionalDependsOn"]),
           "- Lambda, Raymond claim: %s. Status: %s" % (B["lambda"]["raymondClaim"], B["lambda"]["raymondStatus"]), "",
           "## C. Search coverage", "",
           "- Graph source: %s" % C["graphSource"],
           "- Nodes: %d (marked closed in graph: %d); tags: %d" % (C["nodes"], C["nodesMarkedClosed"], C["tags"]),
           "- Combination families (tag pairs): %d; closed: %d; tried, not closed: %d; open and untried: %d" % (
               C["families"], C["familiesClosed"], C["familiesTriedNotClosed"], C["familiesOpenUntried"]),
           "- Outcome records read: %d (files unparsed: %d)" % (C["outcomeRecords"], C["outcomeFilesUnparsed"]),
           "- Open lemmas decided this campaign: %d" % C["openLemmasDecided"], "",
           "## D. Reliability", "",
           "- Lanes run: %d (refereed: %d; unparsed lines: %d)" % (D["lanesRun"], D["lanesRefereed"], D["laneLinesUnparsed"]),
           "- Referee hold rate: %s" % ("n/a" if D["refereeHoldRate"] is None else "%.1f%%" % (100 * D["refereeHoldRate"])),
           "- PROVED claims broken by referees: %d" % D["provedClaimsBroken"],
           "- Statements with three-referee confirmation: %d (about zeros of zeta: %d)" % (D["threeRefereeStatements"], D["threeRefereeStatementsAboutZeros"]),
           "- Claims about zeros not yet counted (fewer than three referees hold): %s" % (", ".join(D["aboutZerosClaimsNotYetCounted"]) or "none"), "",
           "## History by round (cumulative)", "",
           "| round | lanes (round) | lanes (cum) | best score | best lane | missing | hold rate | PROVED broken | 3-referee | lemmas decided |", "|---|---|---|---|---|---|---|---|---|---|"]
    for r in out["history"]:
        md.append("| %s | %d | %d | %d | %s | %s | %s | %d | %d | %d |" % (r["round"], r["lanesThisRound"], r["lanesCumulative"], r["bestScore"],
                  r["bestSlug"] or "-", ",".join(r["missing"]) or "-", "n/a" if r["holdRate"] is None else "%.0f%%" % (100 * r["holdRate"]),
                  r["provedBroken"], r["threeReferee"], r["lemmasDecided"]))
    if not out["history"]: md.append("| (no lanes recorded) | | | | | | | | | |")
    with open(os.path.join(HERE, "SCOREBOARD.md"), "w") as f:
        f.write("\n".join(md) + "\n")
    print("scoreboard: nodes=%d families=%d lanes=%d best=%d/4 -> scoreboard.json, SCOREBOARD.md" % (C["nodes"], C["families"], D["lanesRun"], h["bestScore"]))

if __name__ == "__main__":
    main()
