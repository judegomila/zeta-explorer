#!/usr/bin/env python3
"""generate.py: propose combination moves from IDEA_GRAPH.json and rank them.

A candidate is a pair or triple of live nodes forming a typed move:
  M1  rigid structure  x  arithmetic input (multiplicativity)  x  limit / crossing mechanism
  M2  measured phenomenon  x  mechanism that would explain it  x  control it must fail on
  M3  open lemma  x  proved tool  x  arithmetic or crossing partner
  M4  flow functional  x  prime-side input  x  crossing mechanism or DH-separator
  P2  under-used node  x  arithmetic partner (pair)

Score = requirement coverage + under-used bonus + cheap first test + cohesion
        - closed-row penalties - control-wall penalties.
The score is a heuristic for ordering reading; it is not a verdict on any candidate.

Rules added by lane c4-repair-map-engine-r3 (campaign round 4; switch off with --no-r4-rules):
  R4-device  hard (changed by c5-repair-engine-map-r4): devices come from curated/devices.json through
             build_graph.py (node field 'device', states closed / floored / open). A candidate with a
             closed device node is rejected; a candidate needs at least one open or floored device.
             The keyword role 'crossing' no longer exists.
  blind      hard: every arithmetic member is target-blind algebra (ENGINE_LOG batch 2, lanes 8, 9).
  covariant  hard: no member carries an ingredient that changes under s -> s+1-b, F -> 1/F
             (control RZ_b; ENGINE_LOG batch 2, lane 10).
  object     penalty: no two members share an object (declared object tag or a graph edge).

Rules changed by lane c8-repair-engine-map-r7 (campaign round 8):
  family     a closed family matched only through the text of an open device node does not reject the candidate.
  reuse      the 3-point penalty 'reuses a node of closed lane' is not taken when the shared node is an open device;
             the lanes are listed in one note.

Run:  python3 generate.py --top 40
      python3 generate.py --top 40 --node discriminant-gradient-flow
      python3 generate.py --top 20 --move M2 --theme flow
Standard library only.
"""
import argparse
import hashlib
import json
import os
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
GRAPH = os.path.join(HERE, 'IDEA_GRAPH.json')
OUT = os.path.join(HERE, 'CANDIDATES.json')

THEMES = {
    'flow': {'heat-flow', 'lambda', 'collision', 'burgers', 'vortex', 'zero-channel', 'verified-height'},
    'positivity': {'weil', 'pick', 'de-branges', 'toeplitz', 'suzuki-screw', 'hankel', 'bridge', 'antibridge',
                   'shear', 'twin-ladder', 'hidden-square', 'passive', 'lee-yang', 'jensen', 'total-positivity',
                   'volterra', 'li'},
    'prime-chain': {'euler-product', 'hecke', 'explicit-formula', 'moebius', 'landau', 'sieve-parity', 'primorial'},
    'zero-free': {'zero-free', 'large-sieve', 'mollifier', 'theta', 'metaplectic', 'density'},
    'statistics': {'pair-correlation', 'mean-value', 'proportion'},
    'nyman': {'route-m', 'nyman-beurling', 'cotangent-sum', 'coprime-sum', 'gram'},
    'geometry': {'torus', 'klein', 'twistor', 'spinor', 'hodge', 'function-field', 'trace-formula', 'route-i',
                 'prolate', 'transfer-operator', 'automorphic'},
}
FE_SIDE = {'weil', 'pick', 'de-branges', 'theta', 'bridge', 'antibridge', 'twin-ladder', 'heat-flow', 'lambda',
           'toeplitz', 'suzuki-screw', 'hankel', 'shear', 'explicit-formula', 'trace-formula', 'jensen', 'li',
           'nyman-beurling', 'route-m', 'zero-channel', 'vortex', 'klein', 'hodge'}
MEAN_VALUE = {'mean-value', 'pair-correlation', 'mollifier', 'large-sieve', 'density', 'proportion'}
FLOW_FUNCTIONAL_RE = re.compile(r'monoton|gradient|decreas|nondecreas|convex|exact|identity|lyapunov|majoriz', re.I)

SIZE_RE = re.compile(r'tempered|ramanujan|unimodular local|size normali|\|alpha_p\| ?= ?1|satake|conductor-normalised|'
                     r'exponent 1/2\b|square-root cancel', re.I)
NONLIN_RE = re.compile(r'rankin|sym\^|symmetric (square|power)|convolution square|\|[A-Za-z_]+\|\^2 ?(>=|is)|hidden square|'
                       r'L\(s, ?f x f\)|bilinear in Lambda|quadratic in Lambda|3-4-1|tensor', re.I)
# ---- rules of lane c4-repair-map-engine-r3 ---------------------------------------------------
DEVICE_TAG = 'crossing-device'
# a 'crossing' member on this side is not a device for R4: flow-stable statements hold for backward heat,
# Lambda-bound machinery restates verified height (map section 5, item 1; ROADMAP device table: 'monotone
# flow functional: forward-only')
LAMBDA_SIDE = {'heat-flow', 'lambda', 'verified-height', 'collision', 'burgers'}
# mean-value devices are closed by MV-CAP (ROADMAP device table: 'convexity / mean value: closed')
MV_SIDE = {'mean-value', 'pair-correlation', 'proportion', 'route-m', 'cotangent-sum', 'coprime-sum'}
# finite certificates and formal replays restate verified height (map section 5, item 1)
CERT_SIDE = {'certificate', 'lean'}
# tags too frequent or too generic to count as a shared object (method, format or status tags)
GENERIC_TAGS = {'euler-product', 'explicit-formula', 'lambda', 'heat-flow', 'zero-free', 'mean-value', 'large-sieve',
                'mollifier', 'density', 'lean', 'certificate', 'control', 'visualization', 'verified-height',
                'information', 'finite-stage', 'target-blind', DEVICE_TAG}
# ENGINE_LOG batch 2: 'Target-blind algebra (Gauss-sum identities, reflections, gradings) is the same for every
# control and cannot be an attack by itself'
TARGET_BLIND_RE = re.compile(r'gauss[- ]sum (identit|relation|table)|hasse-davenport|davenport-hasse|stickelberger|'
                             r'reflection (identity|formula|principle)|second reflection|\bgrading|\bgraded\b|'
                             r'modulus class|hecke grade|reciprocity law|cubic reciprocity|residue symbol identit|'
                             r'spin sign|symmetry transport', re.I)
TARGET_DEP_RE = re.compile(r'zeta|\bxi\b|Lambda\(n\)|von mangoldt|m[o\xf6]bius|\bmu\(|L\(s|L-function|dirichlet (series|polynomial)|'
                           r'\bzeros?\b|prime sum|theta coefficient|coefficients? of the (target|row)|target row|'
                           r'exceptional term', re.I)
# ENGINE_LOG batch 2, lane 10: 'A candidate must contain a step that is not covariant under shift and reciprocal
# (sign of Lambda, or position of pole and symmetry line)'
NONCOV_RE = re.compile(r'Lambda(_\w+)? ?(\(n\))? ?>= ?0|positiv|non-?negativ|\bpsd\b|\bpoles?\b|functional[- ]equation|'
                       r'symmetry line|critical line|self-dual|gamma factor|\bxi\b|\bXi\b|completed|Re ?s ?= ?1/2|'
                       r'reflection s ?(<->|->) ?1 ?- ?s|\bintegers\b|poisson summation', re.I)
# Tags of prime-side identities and size statements, the class RZ_b passes. The rule fires only when every
# declared tag of every member lies in this set and no member text names a non-covariant ingredient; any other
# declared tag (a kernel, a symmetry line, the integers, zeros) is taken as a possible non-covariant step.
PRIME_SIZE_TAGS = {'euler-product', 'large-sieve', 'mollifier', 'mean-value', 'density', 'moebius', 'primorial',
                   'sieve-parity', 'hecke', 'smooth-numbers', 'control', 'lean', 'certificate', 'finite-stage',
                   'zero-free', 'landau', 'information'}

INT_RE = re.compile(r'integers|additive|sawtooth|fractional part|poisson summation|lattice|gcd|farey|dedekind sum|'
                    r'cotangent|lcm', re.I)

MOVES = {
    'M1': 'rigid structure x arithmetic input x crossing mechanism',
    'M2': 'measured phenomenon x explaining mechanism x control it must fail on',
    'M3': 'open lemma x proved tool x arithmetic or crossing partner',
    'M4': 'flow functional x prime-side input x crossing mechanism or DH-separator',
    'P2': 'under-used node x arithmetic partner',
}
# Score weights. Changed by the strategy review after campaign round 5 (STRATEGY.md v2, 2026-11-18); the
# previous values are in the comments and in scratch/generate.before-strategy-v2.py.
#   heightUniform  was 2 (+1 arithmetic): the label is a reader label carried by 58 of the top 60, and no referee
#                  confirmed R2 in 50 lanes. Now 0 (+1 arithmetic).
#   underused      was up to 4 (2 per explicit, 1 per auto): explore lanes on under-used nodes scored 0 in every
#                  round, and the former rank 1 owed 4 points to it. Now up to 2 (1 per explicit, 0.5 per auto).
#   crossing       floored device was 2: three independent order-2 lanes returned the 5/6 floor (round 5). Now 1.
#   controls       separator was 2: the only referee-confirmed flags and the held partial results came from lanes
#                  with a recorded control separation. Now 3.
#   size / nonlinear keyword parts were 1 each: keyword matches with no outcome behind them. Now 0.5 each.
# Changed again by the strategy review after campaign round 10 (STRATEGY.md v3, 2026-11-19); previous file:
# scratch/generate.before-strategy-v3.py.
#   crossing       open device was 3: every open device node that headed the list in rounds 8 to 10 ((E-K), (E-H),
#                  function-field vertex, map-open-1, map-open-4) was closed one or two rounds later with score 0;
#                  the bonus followed the planner's last choice and did not lead it. Now 2.
#                  floored device was 1: 27 of the top 60 of round 10 stood on the floored 7/8 device; three lanes
#                  on it (TRO6 lead 17) found no saving and such lanes cannot change the headline. Now 0 (the
#                  candidates still pass the hard filter and are listed; they are part-B work).
#   cohesion       cap was 2: in rounds 9 and 10 every partner placed by tag overlap (shared tag 'theta',
#                  'function-field') was discarded by the planner as kernel-only or unrelated. Cap now 1.
WEIGHTS = {
    'uniformLabel': 0, 'uniformArith': 1,
    'underExplicit': 1, 'underAuto': 0.5, 'underCap': 2,
    'deviceOpen': 2, 'deviceFloored': 0,
    'separator': 3, 'controlNamed': 1,
    'sizeKeyword': 0.5, 'nonlinKeyword': 0.5, 'integersKeyword': 1,
    'cohesionCap': 1.0,
}
PER_ANCHOR = 14     # partners kept per anchor node
THIRD = 8           # third members tried per pair


def load():
    if not os.path.exists(GRAPH):
        sys.exit('IDEA_GRAPH.json not found: run python3 build_graph.py first')
    g = json.load(open(GRAPH, encoding='utf-8'))
    return g


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--top', type=int, default=40)
    ap.add_argument('--node', help='only candidates containing this node id')
    ap.add_argument('--move', choices=sorted(MOVES), help='only this move type')
    ap.add_argument('--theme', choices=sorted(THEMES), help='only this theme')
    ap.add_argument('--per-node', type=int, default=2, help='max appearances of one node in the output')
    ap.add_argument('--per-family', type=int, default=6, help='max candidates per (move, theme) family')
    ap.add_argument('--per-device', type=int, default=12,
                    help='max appearances of one curated device node in the output (the list has few open devices)')
    ap.add_argument('--dump-all', help='also write every scored candidate to this file')
    ap.add_argument('--dump-rejected', help='write up to 25 sample candidates per rejection reason to this file')
    ap.add_argument('--no-r4-rules', action='store_true',
                    help='switch off the c4 rules (R4-device, target-blind, shift-reciprocal, shared-object penalty)')
    args = ap.parse_args()

    g = load()
    node = {n['id']: n for n in g['nodes']}
    idf = g['meta']['tagIdf']
    rows = {n['row']: n for n in g['nodes'] if n['id'].startswith('row-')}
    outcomes_path = os.path.join(HERE, 'outcomes.json')
    outcomes = json.load(open(outcomes_path, encoding='utf-8')) if os.path.exists(outcomes_path) else []
    fam_path = os.path.join(HERE, 'closed_families.json')
    families = json.load(open(fam_path, encoding='utf-8')) if os.path.exists(fam_path) else []
    for f in families:
        f['re'] = [re.compile(p, re.I) for p in f['all']]
        f['unless_re'] = re.compile(f['unless'], re.I) if f.get('unless') else None

    incoming_uses = Counter(e['target'] for e in g['edges'] if e['type'] == 'uses')
    compose = defaultdict(dict)
    for e in g['edges']:
        if e['type'] == 'composes-with':
            compose[e['source']][e['target']] = e
            compose[e['target']][e['source']] = e

    def tags(n):
        return set(n['tags']) | set(n.get('tagsInferred', []))

    live = [n for n in g['nodes'] if 'wall' not in n['roles'] and n['origin'] in ('corpus', 'map')
            and 'surrogate' not in n['roles']]
    T = {n['id']: {t for t in tags(n) if idf.get(t, 0) >= 0.8} for n in live}
    R_ = {n['id']: set(n['roles']) for n in live}
    by_tag = defaultdict(list)
    for n in live:
        for t in T[n['id']]:
            by_tag[t].append(n['id'])

    # auto under-used: corpus node from the result modules / renderer / sibling repos with no map row,
    # no incoming 'uses' edge and a single provenance record
    auto_under = set()
    for n in live:
        if n['origin'] == 'corpus' and not n['rows'] and incoming_uses[n['id']] == 0 \
                and len(n.get('provenance', [])) == 1 and set(n['sourceKinds']) & {'imp', 'zv', 'sib'}:
            auto_under.add(n['id'])
    explicit_under = {n['id'] for n in live if 'underused' in n['roles']}

    def sw(a, b):
        return sum(idf[t] for t in T[a] & T[b])

    # ---- c4 rules: crossing device, shared object -------------------------------------------------
    DECL = {n['id']: set(n['tags']) for n in live}                 # reader-declared tags only
    linked_pairs = set()
    for e in g['edges']:
        if e['type'] in ('uses', 'special-case-of', 'restates'):
            linked_pairs.add((e['source'], e['target']))
            linked_pairs.add((e['target'], e['source']))

    def device_kind(i):
        """'open', 'floored', 'closed' or None: state of the curated device (curated/devices.json)."""
        d = node[i].get('device')
        return d['state'] if d else None

    def is_target_blind(i):
        if 'target-blind' in DECL[i]:
            return True
        t = node[i].get('name', '') + ' ' + node[i].get('statement', '')
        return bool(TARGET_BLIND_RE.search(t)) and not TARGET_DEP_RE.search(t)

    def shared_object(a, b):
        if (a, b) in linked_pairs:
            return 'edge'
        common = (DECL[a] & DECL[b]) - GENERIC_TAGS
        return sorted(common)[0] if common else None

    def partners(a, pool, k):
        seen = {}
        for t in T[a]:
            for b in by_tag[t]:
                if b != a and b in pool and b not in seen:
                    w = sw(a, b)
                    if b in explicit_under:
                        w += 1.5
                    if b in compose[a]:
                        w += 1.0
                    seen[b] = w
        return [b for b, _ in sorted(seen.items(), key=lambda kv: (-kv[1], kv[0]))[:k]]

    pool = lambda *need, no=(): {n['id'] for n in live if all(r in R_[n['id']] for r in need)
                                 and not any(r in R_[n['id']] for r in no)}
    A = pool('arith')
    RIG = pool('rigid', 'uniform', no=('arith',))
    C = {n['id'] for n in live if device_kind(n['id']) in ('open', 'floored')}
    P = pool('phenomenon')
    E = pool('explainer')
    L = pool('lemma')
    TOOL = pool('rigid')
    S = pool('separator')
    F = {n['id'] for n in live if T[n['id']] & THEMES['flow'] and 'rigid' in R_[n['id']]
         and FLOW_FUNCTIONAL_RE.search(n['name'] + ' ' + n['statement'])}
    U = explicit_under

    raw = {}

    def put(move, members, roles, control=None):
        ids = tuple(sorted(set(members)))
        if len(ids) != len(members):
            return
        key = (ids, control)
        if key in raw:
            return
        raw[key] = dict(move=move, ids=list(members), roles=dict(zip(members, roles)), control=control)

    # M1
    for a in sorted(A):
        for r in partners(a, RIG, PER_ANCHOR):
            third = set(partners(a, C, THIRD)) | set(partners(r, C, THIRD // 2))
            for c in sorted(third - {a, r}):
                put('M1', [r, a, c], ['rigid', 'arithmetic', 'crossing'])
    # M2
    for p in sorted(P):
        for e in partners(p, E, PER_ANCHOR):
            arith = 'arith' in R_[p] or 'arith' in R_[e]
            flowy = bool((T[p] | T[e]) & THEMES['flow'])
            fe = bool((T[p] | T[e]) & FE_SIDE)
            if not arith:
                ctl = 'ctl-HEAT' if flowy else 'ctl-DH'
            else:
                ctl = 'ctl-DH' if fe else 'ctl-TW-'
            put('M2', [p, e], ['phenomenon', 'mechanism'], control=ctl)
    # M3
    for l in sorted(L):
        for t in partners(l, TOOL, PER_ANCHOR):
            third = set(partners(l, A | C, THIRD)) | set(partners(t, A, THIRD // 2))
            for x in sorted(third - {l, t}):
                put('M3', [l, t, x], ['open lemma', 'tool', 'arithmetic' if x in A else 'crossing'])
    # M4
    for f in sorted(F):
        for a in partners(f, A, PER_ANCHOR):
            third = set(partners(a, C | S, THIRD)) | set(partners(f, S, THIRD // 2))
            for x in sorted(third - {f, a}):
                put('M4', [f, a, x], ['flow functional', 'arithmetic', 'separator' if x in S else 'crossing'])
    # P2
    for u in sorted(U):
        for a in partners(u, A, PER_ANCHOR * 2):
            put('P2', [u, a], ['under-used', 'arithmetic'])

    # ------------------------------------------------------------------ scoring
    reject = Counter()
    independent = Counter()     # c4 rules counted independently of the order of the checks
    rejected_samples = defaultdict(list)
    r4_rules = not args.no_r4_rules

    def rej(reason, c):
        reject[reason] += 1
        if args.dump_rejected and len(rejected_samples[reason]) < 25:
            rejected_samples[reason].append(dict(move=c['move'], ids=c['ids'], control=c['control']))
    scored = []
    row_tags = {r: set(n['tags']) for r, n in rows.items()}

    for (ids, control), c in raw.items():
        members = [node[i] for i in c['ids']]
        mid = c['ids']
        roles = [R_[i] for i in mid]
        alltags = set().union(*[T[i] for i in mid])
        parts = {}
        notes = []

        # hard rejections
        arith_m = [i for i in mid if 'arith' in R_[i]]
        if not arith_m and c['move'] != 'M2':
            rej('no member uses multiplicativity (DH passes)', c)
            continue
        if not arith_m and all('flow-stable' in r for r in roles):
            rej('all members flow-stable and none arithmetic (backward heat passes)', c)
            continue
        common_rows = set.intersection(*[set(m['rows']) for m in members]) if members else set()
        if common_rows:
            rej('all members attached to one closed row', c)
            continue
        prim = [re.search(r'imp-\d+', m.get('source', '')) for m in members]
        prim = [p.group(0) for p in prim if p]
        if len(prim) == len(members) and len(set(prim)) == 1:
            rej('all members from one module', c)
            continue
        if any(set(o.get('nodes', [])) and set(o['nodes']) <= set(mid) and o.get('verdict') in ('closed', 'refuted')
               for o in outcomes):
            rej('contains a combination closed in outcomes.json', c)
            continue
        # c2-repair: a closed lane is reproduced when two of its nodes (minimal closed set or launched set) recur
        if any(o.get('verdict') in ('closed', 'refuted') and
               len((set(o.get('nodes', [])) | set(o.get('launchedNodes', []))) & set(mid)) >= 2 for o in outcomes):
            rej('shares two nodes with a closed lane (nodes or launchedNodes)', c)
            continue
        if any(set(o.get('nodes', [])) and set(o['nodes']) == set(mid) for o in outcomes):
            rej('already launched (outcomes.json)', c)
            continue
        joint = ' '.join(m['id'] + ' ' + m.get('name', '') + ' ' + m.get('statement', '') + ' ' + ' '.join(m.get('tags', []))
                         for m in members)
        fam_hit = [f for f in families if all(r.search(joint) for r in f['re'])
                   and not (f['unless_re'] and f['unless_re'].search(joint))]
        # c8-repair: a closed family must not be matched by the text of an open device node alone. The text of
        # map-open-1 ('h = r/2', 'double covers') and of ff-order2-vertex-probe ('ORDER-2', tag theta) matches both
        # groups of fam-order2-theta-rows, which rejected every candidate containing them (841 + 2,209 in the
        # round-8 planner rerun). The curated device list is the authority on the state of a device; a family
        # applies to a candidate with an open device only if a member that is not an open device matches one of
        # its groups (the partner supplies part of the closed combination).
        open_dev_ids = [i for i in mid if device_kind(i) == 'open'] if r4_rules else []
        if fam_hit and open_dev_ids:
            rest = ' '.join(m['id'] + ' ' + m.get('name', '') + ' ' + m.get('statement', '') + ' ' + ' '.join(m.get('tags', []))
                            for m in members if m['id'] not in open_dev_ids)
            kept = [f for f in fam_hit if any(r.search(rest) for r in f['re'])]
            if len(kept) < len(fam_hit):
                independent['closed family matched by the open device text alone (exempt)'] += 1
            fam_hit = kept
        if fam_hit:
            rej('closed family: ' + fam_hit[0]['id'], c)
            continue
        dev_all = [(i, device_kind(i)) for i in mid]
        closed_dev = [i for i, k in dev_all if k == 'closed']
        dev = [(i, k) for i, k in dev_all if k in ('open', 'floored')]
        if r4_rules:
            # (c1) target-blind arithmetic: every arithmetic member is algebra that is the same for every control
            blind = [i for i in arith_m if is_target_blind(i)]
            if arith_m and len(blind) == len(arith_m):
                independent['target-blind'] += 1
                rej('only arithmetic step is target-blind algebra (same for every control)', c)
                continue
            # (c2) covariance under shift and reciprocal: RZ_b passes unless some member carries the sign of Lambda,
            # the pole, the symmetry line (functional equation) or the integers
            decl_all = set().union(*[DECL[i] for i in mid])
            is_cov = bool(decl_all) and decl_all <= PRIME_SIZE_TAGS and not NONCOV_RE.search(joint)
            for flag, label in ((is_cov, 'shift-reciprocal covariant'), (not dev, 'no crossing device')):
                if flag:
                    independent[label] += 1
            if is_cov:
                rej('covariant under shift and reciprocal (RZ_b passes every step)', c)
                continue
            # (a0) a member is a device closed by a map row or a refereed lane (curated/devices.json)
            if closed_dev:
                independent['closed device'] += 1
                rej('contains a closed device: ' + node[closed_dev[0]]['device']['type'], c)
                continue
            # (a) requirement R4: at least one member is an open or floored device of the curated list
            if not dev:
                rej('no open or floored crossing device (curated/devices.json)', c)
                continue
        # cohesion: at least two member pairs share a tag (one for pairs)
        pairs = [(x, y) for k, x in enumerate(mid) for y in mid[k + 1:]]
        linked = [p for p in pairs if T[p[0]] & T[p[1]]]
        if len(linked) < min(2, len(pairs)):
            rej('members not connected by shared objects', c)
            continue

        # requirement 1: multiplicativity, all primes together
        all_primes = [i for i in arith_m if 'few-primes' not in R_[i]]
        parts['multiplicativity'] = 2 if all_primes else (1 if arith_m else 0)
        if arith_m and not all_primes:
            notes.append('arithmetic member uses a restricted set of primes')
        # requirement 2: uniform in height
        uni = [i for i in mid if 'uniform' in R_[i]]
        parts['heightUniform'] = (WEIGHTS['uniformLabel'] if uni else 0) + \
            (WEIGHTS['uniformArith'] if any(i in arith_m for i in uni) else 0)
        # requirement 3: fails for controls for a structural reason
        sep = [i for i in mid if 'separator' in R_[i]]
        parts['controls'] = (WEIGHTS['separator'] if sep else 0) + (WEIGHTS['controlNamed'] if control else 0)
        # crossing mechanism
        cross = [i for i, _ in dev]
        # WEIGHTS: open device, floored device (the 7/8 type); 0 without the rules
        parts['crossing'] = (WEIGHTS['deviceOpen'] if any(k == 'open' for _, k in dev)
                             else (WEIGHTS['deviceFloored'] if dev else 0)) if r4_rules else 0
        # under-used
        ue = [i for i in mid if i in explicit_under]
        ua = [i for i in mid if i in auto_under and i not in explicit_under]
        parts['underused'] = min(WEIGHTS['underCap'], WEIGHTS['underExplicit'] * len(ue) + WEIGHTS['underAuto'] * len(ua))
        # cheap first test
        cheap = any(m.get('status') in ('measured', 'certified') or m['type'] == 'tool' for m in members)
        named = any(m['type'] in ('open-lemma', 'conjecture') for m in members)
        parts['cheapTest'] = (1 if cheap else 0) + (1 if named else 0)
        # cohesion and breadth
        parts['cohesion'] = round(min(WEIGHTS['cohesionCap'], sum(sw(x, y) for x, y in linked) / (2.0 * len(pairs))), 2)
        kinds = set()
        for m in members:
            kinds |= set(m['sourceKinds'])
        parts['breadth'] = 1 if len(kinds) >= 2 else 0

        # batch-1 lessons: E_a is separated only by the size normalisation; positivity must enter non-linearly;
        # the integers (additive structure) separate zeta from the Selberg family
        parts['sizeNormalisation'] = WEIGHTS['sizeKeyword'] if SIZE_RE.search(joint) else 0
        parts['nonlinearPositivity'] = WEIGHTS['nonlinKeyword'] if NONLIN_RE.search(joint) else 0
        parts['integers'] = WEIGHTS['integersKeyword'] if INT_RE.search(joint) else 0

        # penalties
        pen = 0
        # (b) c4-repair: no two members share an object (a declared, non-generic tag, or a graph edge)
        objs = [(x, y, shared_object(x, y)) for x, y in pairs]
        objs = [o for o in objs if o[2]]
        parts['sharedObject'] = 0
        if r4_rules:
            if not objs:
                pen -= 3
                notes.append('no two members share an object (generic or inferred tags only)')
            elif len(objs) >= min(2, len(pairs)):
                parts['sharedObject'] = 1
        lam_members = [i for i in mid if DECL[i] & LAMBDA_SIDE]
        if r4_rules and 2 * len(lam_members) > len(mid) and not any(k == 'open' for _, k in dev):
            pen -= 3
            notes.append('majority of members on the flow / Lambda side: bound-improvement machinery, not a route to '
                         'the critical line (HEAT; verified height)')
        mv_members = [i for i in mid if DECL[i] & MV_SIDE]
        if r4_rules and 2 * len(mv_members) > len(mid) and not any(k == 'open' for _, k in dev):
            pen -= 3
            notes.append('majority of members are mean-value objects: MV-CAP applies to an every-window conclusion')
        attached = sorted({r for m in members for r in m['rows']})
        shared_rows = [r for r in attached if sum(1 for m in members if r in m['rows']) >= 2]
        if shared_rows:
            pen -= 2 * len(shared_rows)
            notes.append('two members attached to closed row(s) ' + ', '.join(shared_rows))
        elif attached:
            pen -= 1
            notes.append('one member attached to closed row(s) ' + ', '.join(attached))
        if arith_m and not (alltags & FE_SIDE):
            pen -= 2
            notes.append('no member on the functional-equation side: sign twist, unimodular twist and Beurling pass')
        if alltags and alltags <= MEAN_VALUE | {'euler-product'}:
            pen -= 2
            notes.append('only mean-value objects: MV-CAP applies to an every-window conclusion')
        rh_eq = [i for i in mid if 'rh-equivalent' in R_[i]]
        if rh_eq and not (sep or [i for i in cross if i not in rh_eq]):
            pen -= 3
            notes.append('contains an RH-equivalent statement and no separate lever')
        if not arith_m:
            pen -= 3
            notes.append('no member uses multiplicativity: explanation must supply it')
        if all('flow-stable' in r or 'arith' not in r for r in roles) and (alltags & THEMES['flow']) and \
                not any('arith' in r for r in roles):
            pen -= 2
        open_dev_lanes = []
        for o in outcomes:
            on = set(o.get('nodes', []))
            # c2-repair: one member of a closed lane's minimal failing set: penalise and name the lane
            if o.get('verdict') in ('closed', 'refuted') and len(on & set(mid)) == 1:
                # c8-repair: an open device node is shared by every lane that narrowed it (map-open-1: 8 closed
                # lanes, 24 points), which placed all of its candidates below the listed ones. For an open device
                # the lanes are listed in one note and no points are taken; the state is kept in curated/devices.json.
                if (on & set(mid)) <= set(open_dev_ids):
                    open_dev_lanes.append(o['slug'])
                    continue
                pen -= 3
                notes.append('reuses a node of closed lane ' + o['slug'] + ' (' + ', '.join(sorted(on & set(mid))) +
                             '): state what differs from its stop reason')
            if len(on & set(mid)) >= 2:
                pen -= 2
                notes.append('shares two nodes with launched candidate ' + o['slug'])
            ot = set(o.get('tags', []))
            if o.get('verdict') == 'in-progress' and ot and ot <= alltags:
                pen -= 3
                notes.append('overlaps lane in progress: ' + o['slug'])
        if open_dev_lanes:
            notes.append('open device ' + ', '.join(open_dev_ids) + ' was narrowed by ' + str(len(open_dev_lanes)) +
                         ' closed lane(s) (' + ', '.join(sorted(open_dev_lanes)) + '): state what differs from each stop reason')
        # tag signature against closed rows
        row_hits = []
        for r, rt in row_tags.items():
            if not rt:
                continue
            inter = alltags & rt
            if len(inter) >= 2:
                jac = len(inter) / len(alltags | rt)
                row_hits.append((round(jac, 3), r, sorted(inter)))
        row_hits.sort(key=lambda x: (-x[0], x[1]))
        if row_hits and row_hits[0][0] >= 0.6 and not sep:
            pen -= 1
            notes.append('tag signature close to closed row ' + row_hits[0][1])
        parts['penalties'] = pen

        score = round(sum(parts.values()), 2)
        theme_votes = Counter()
        for th, tg in THEMES.items():
            theme_votes[th] = sum(len(T[i] & tg) for i in mid)
        theme = max(sorted(theme_votes), key=lambda k: theme_votes[k]) if any(theme_votes.values()) else 'other'

        checked = []
        for jac, r, inter in row_hits[:6]:
            rn = rows[r]
            dby = rn.get('defeatedByControls', [])
            if r in attached:
                verdict = 'a member is attached to this row: the candidate must differ from the row by its other members'
            elif 'DH' in dby and sep:
                verdict = 'row falls to DH; candidate has a member recorded as failing for DH (' + sep[0] + ')'
            elif dby:
                verdict = 'adjacent by tags only; row falls to ' + '/'.join(dby) + ': answer Q1 for these controls first'
            else:
                verdict = 'adjacent by tags only; row has no control listed'
            checked.append(dict(row=r, name=rn['name'][:110], overlap=inter, jaccard=jac, verdict=verdict))
        for r in attached:
            if r not in [x['row'] for x in checked] and r in rows:
                checked.append(dict(row=r, name=rows[r]['name'][:110], overlap=[], jaccard=0.0,
                                    verdict='a member is attached to this row'))

        req = dict(
            multiplicativity=(all_primes or arith_m or ['none'])[0],
            heightUniform=(uni or ['none: must be supplied'])[0],
            controlFailure=(sep[0] if sep else ('to be tested on ' + control if control else 'none recorded: Q1 open')),
            crossing=(cross or ['none'])[0])

        nm = lambda i: node[i]['name'][:70]
        if c['move'] == 'M2':
            test = (f"Measure '{nm(mid[0])}' on {node[control]['name']} with the same code and window. If the value "
                    f"matches zeta's, the phenomenon carries no arithmetic and the candidate closes.")
        elif c['move'] == 'M3':
            test = (f"Write '{nm(mid[0])}' as one inequality with explicit constants; evaluate it at three heights "
                    f"using '{nm(mid[1])}', then on DH and on a sign twist.")
        elif c['move'] == 'P2':
            test = (f"Evaluate '{nm(mid[0])}' with zeta's data and with DH data at two heights; look for a difference "
                    f"that can be expressed through '{nm(mid[1])}'.")
        else:
            test = (f"Evaluate the quantity of '{nm(mid[0])}' with the input '{nm(mid[1])}' in one window at two "
                    f"heights; repeat for DH and a sign twist. Continue only if zeta's margin does not decay with "
                    f"height and a control fails.")
        reason = (f"{MOVES[c['move']]}. Multiplicativity from {req['multiplicativity']}; height-uniform member "
                  f"{req['heightUniform']}; control failure: {req['controlFailure']}; crossing: {req['crossing']}."
                  + (' Under-used: ' + ', '.join(ue + ua) + '.' if ue or ua else '')
                  + (' Notes: ' + '; '.join(notes) + '.' if notes else ''))
        h = hashlib.sha1(('|'.join(sorted(mid)) + '|' + (control or '')).encode()).hexdigest()[:6]
        scored.append(dict(
            key=c['move'] + '-' + h, move=c['move'], theme=theme, score=score, scoreParts=parts,
            nodes=[dict(id=i, role=c['roles'][i], name=node[i]['name'], type=node[i]['type'],
                        status=node[i].get('status'), source=node[i].get('source', '')[:160]) for i in mid],
            control=control, requirements=req, underused=ue + ua, reason=reason, firstTest=test,
            rowsChecked=checked,
            r4Devices=[dict(id=i, kind=k, type=node[i]['device']['type']) for i, k in dev],
            sharedObjects=[dict(a=x, b=y, object=o) for x, y, o in objs]))

    scored.sort(key=lambda s: (-s['score'], s['key']))
    if args.dump_all:
        json.dump(scored, open(args.dump_all, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    if args.dump_rejected:
        json.dump(dict(counts=dict(reject), samples=rejected_samples), open(args.dump_rejected, 'w', encoding='utf-8'),
                  indent=1, ensure_ascii=False)

    # ------------------------------------------------------------------ selection with diversity
    fam_stats = defaultdict(lambda: dict(count=0, best=None))
    for s in scored:
        f = fam_stats[s['move'] + '/' + s['theme']]
        f['count'] += 1
        if f['best'] is None:
            f['best'] = s['score']
    use = Counter()
    fam = Counter()
    pairs_seen = set()
    top = []
    for s in scored:
        ids = [n['id'] for n in s['nodes']]
        if args.node and args.node not in ids:
            continue
        if args.move and s['move'] != args.move:
            continue
        if args.theme and s['theme'] != args.theme:
            continue
        if any(use[i] >= (args.per_device if device_kind(i) else args.per_node) and i != args.node for i in ids):
            continue
        prs = {tuple(sorted((x, y))) for k, x in enumerate(ids) for y in ids[k + 1:]}
        if prs & pairs_seen and not args.node:
            continue
        fk = s['move'] + '/' + s['theme']
        if fam[fk] >= args.per_family:
            continue
        for i in ids:
            use[i] += 1
        pairs_seen |= prs
        fam[fk] += 1
        top.append(s)
        if len(top) >= args.top:
            break
    for k, s in enumerate(top, 1):
        s['rank'] = k

    closed_by_theme = {}
    for th, tg in THEMES.items():
        rs = sorted((r for r, rt in row_tags.items() if rt & tg), key=lambda x: (x[0], len(x), x))
        closed_by_theme[th] = dict(count=len(rs), rows=rs)
    out = dict(
        meta=dict(graph=os.path.basename(GRAPH), graphCounts=g['meta']['counts'], moves=MOVES,
                  pools=dict(arithmetic=len(A), rigidUniform=len(RIG), crossing=len(C), phenomenon=len(P),
                             explainer=len(E), lemma=len(L), separator=len(S), flowFunctional=len(F),
                             underusedExplicit=len(explicit_under), underusedAuto=len(auto_under)),
                  generated=len(raw), scored=len(scored), rejected=dict(reject),
                  families={k: v for k, v in sorted(fam_stats.items())},
                  closedRowsByTheme=closed_by_theme,
                  scoring=('weights of 2026-11-19 (STRATEGY v3): multiplicativity 0-2; heightUniform 0-1; controls 0-4; '
                           'crossing 0-2 (2 = open device, 0 = floored device of curated/devices.json); underused 0-2; '
                           'cheapTest 0-2; cohesion 0-1; breadth 0-1; size / nonlinear keywords 0-0.5 each; integers 0-1; '
                           'sharedObject 0-1; penalties <= 0'),
                  r4Rules=dict(active=r4_rules, firedIndependentlyOfOrder=dict(independent),
                               targetBlindArithNodes=sorted(i for i in DECL if 'arith' in R_[i] and is_target_blind(i)),
                               deviceNodesLive={st: sorted(i for i in DECL if device_kind(i) == st)
                                                for st in ('open', 'floored', 'closed')},
                               topWithOpenDevice=sum(1 for s in top if any(d['kind'] == 'open' for d in s['r4Devices'])),
                               topWithFlooredDeviceOnly=sum(1 for s in top if s['r4Devices'] and not any(d['kind'] == 'open' for d in s['r4Devices'])),
                               topWithClosedDevice=sum(1 for s in top if any(device_kind(n['id']) == 'closed' for n in s['nodes'])),
                               topWithDevice=sum(1 for s in top if s['r4Devices']),
                               topWithSharedObject=sum(1 for s in top if s['sharedObjects'])),
                  filters=vars(args),
                  note='Heuristic ranking. Read each candidate against OBSTRUCTION_MAP.md section 2 (Q1-Q3) before work.'),
        candidates=top)
    json.dump(out, open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

    print(f"generated {len(raw)}, scored {len(scored)}, rejected {sum(reject.values())}")
    for k, v in reject.most_common():
        print(f"  rejected {v:6d}  {k}")
    print('families (move/theme: count, best score):')
    for k, v in sorted(fam_stats.items()):
        print(f"  {k:18s} {v['count']:6d}  {v['best']}")
    print(f"\ntop {len(top)}:")
    for s in top:
        print(f"{s['rank']:3d} {s['score']:5.1f} {s['move']} {s['theme']:11s} "
              + ' x '.join(n['id'] for n in s['nodes']) + (' x ' + s['control'] if s['control'] else ''))
    print('wrote ' + OUT)


if __name__ == '__main__':
    main()
