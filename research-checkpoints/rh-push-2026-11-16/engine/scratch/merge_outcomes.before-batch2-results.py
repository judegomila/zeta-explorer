#!/usr/bin/env python3
"""Merge the lane records in outcomes/*.json into outcomes.json, nodes/nodes-15.json and
closed_families.json. Standard library only; reads text/JSON, executes nothing from the repo.

outcomes.json entry: slug, verdict (closed | partial | open), nodes (minimal closed set),
launchedNodes, tags, defeatedBy (control codes), notDefeated (controls recorded as passing every
proved step), title, path, note, lesson.
"""
import glob
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
VERDICT = {'precise-obstruction': 'closed', 'refuted': 'refuted', 'partial': 'partial',
           'partial-result': 'partial', 'open': 'open', 'closed': 'closed'}

# Round-1 lanes (c1-*) were launched from the map's section 6, before the graph existed; their
# records carry no node ids. The map-open item each one settles is attached here by hand.
C1_NODES = {
    'c1-shear-hecke-fricke': ['map-open-11'],
    'c1-multidelay-bohr-section': ['map-open-7'],
    'c1-pd-log-strip': ['map-open-8'],
    'c1-spinor-hecke-primitive': ['map-open-6'],
    'c1-window-sdp-scaling': ['map-open-10'],
    'c1-missing-controls': [],          # filter repair, closes nothing
    'c1-leeyang-chain-closure': [],     # partial: kernel-side statement, no zero information
    'c1-leeyang-krein-limit': [],       # closes a limit step, recorded as family 12 below
}

CTRL_PATTERNS = [
    ('DH', r'\bDH\b|davenport'), ('HEAT', r'backward heat|heat (family|tilt)'),
    ('EA', r'E_a\b|zeta\(s\+a\)'), ('B', r'beurling'), ('U', r'unimodular|\bU\b control|\bU,'),
    ('TW+', r'TW\+|sign[- ]positive twist|sign twist with Lambda >= 0'),
    ('TW-', r'TW-|sign twist|sign-twist|liouville|signed twist'),
    ('NR', r'T-NR'), ('THW', r'theta\^w|theta\^3'), ('PA', r'phase-rotat'),
    ('SEL', r'\bSEL\b|selberg zeta'), ('PERM', r'permuted'),
]

# Closed combination families (ENGINE_LOG.md, batch 1, plus round-1 lanes). A candidate is
# rejected when every regex of a family matches the joint text (ids, names, statements, tags) of
# its members. Patterns are narrow on purpose: a family closes a mechanism, not a topic.
FAMILIES = [
    dict(id='fam-legendre-dual-limits', closedBy='e1-cofinal-legendre-dual',
         name='Limits or compactness of optimal Legendre-LP duals',
         all=[r'legendre', r'dual|\bLP\b|cofinal|compact']),
    dict(id='fam-torus-exclusion-sign-test', closedBy='e1-rs-torus-laguerre-orbit',
         name='Prime-torus exclusion sets for the Riemann-Siegel main sum with Laguerre/Turan sign tests',
         all=[r'torus|riemann-siegel main sum', r'laguerre|tur[a\xe1]n|jensen']),
    dict(id='fam-one-zero-forces-many', closedBy='e1-sparse-recurrence-amplifier',
         name='Amplifiers "one off-line zero forces many" via Bohr sets, Kronecker or universality',
         all=[r'strong[- ]recurren|universality|bohr set|almost[- ]period', r'off-line zero|forces|returns|RH is equivalent|equivalent to RH']),
    dict(id='fam-selberg-control-companion', closedBy='e1-selberg-twist-control',
         name='Selberg/Ruelle zeta as control with functional equation or as companion in Theorem PC',
         all=[r'selberg[- ]zeta|ruelle|selberg-(zeta|control|freeze|phase)', r'control|companion|theorem pc|pole[- ]coupling']),
    dict(id='fam-nb-gram-lammin', closedBy='e1-nb-gram-period-transfer',
         name='Smallest eigenvalue of Nyman-Beurling Gram matrices; period-function recursion on Gram entries',
         all=[r'vasyunin|nyman', r'gram', r'lam(bda)?_?min|smallest eigen|period[- ]function']),
    dict(id='fam-vaughan-split-landau', closedBy='e1-forcing-free-bilinear-split',
         name='Vaughan/Heath-Brown splits or mollifiers feeding the one-sided Landau target',
         all=[r'vaughan|heath-brown|type[- ]i\b|bilinear split', r'landau|one-sided']),
    dict(id='fam-order2-theta-rows', closedBy='e1-gl3-theta-order2-rows',
         name='Order-2 versions of the 7/8 mechanism via theta or half-integral weight forms',
         all=[r'order[- ]2|order two|half-integral|double cover|h ?= ?r/2', r'theta|7/8|seven-eighths|kubota']),
    dict(id='fam-euler-anchor-heat', closedBy='e1-euler-anchor-heat-certificate',
         name='Heat-time certificates anchored in the Euler region without S transport',
         all=[r'euler[- ]anchor|anchor(ed)? (in|with) (the|an) euler', r'heat']),
    dict(id='fam-heat-monotone-hankel', closedBy='e1-burgers-cascade-anticausal',
         name='Heat-monotone functionals of the anticausal Hankel block or of zero configurations',
         all=[r'anticausal|gamma_-|hankel', r'burgers|heat|monoton|flow']),
    dict(id='fam-arithmetic-nb-span', closedBy='e1-heegner-averaged-nb-span',
         name='Nyman-Beurling spans chosen by an arithmetic family with the ratio as measured quantity',
         all=[r'heegner|cm point|n[e\xe9]ron', r'nyman|\bNB\b|span']),
    dict(id='fam-hecke-shear-commutator', closedBy='c1-shear-hecke-fricke',
         name='Hecke operators commuted with a Gaussian shear or heat factor (identity, not inequality)',
         all=[r'hecke', r'shear|fricke', r'commut|defect|tau ?-> ?0']),
    dict(id='fam-stage-limit-semicontinuity', closedBy='c1-leeyang-krein-limit',
         name='Limit of zero-free product stages by Krein-index semicontinuity or Hurwitz',
         all=[r'lee-yang|stage', r'krein|semicontinu|hurwitz', r'limit']),
    dict(id='fam-primitive-test-restriction', closedBy='c1-spinor-hecke-primitive',
         name='Restriction of a translation-invariant form (Weil, Q_L) to Hecke-primitive tests',
         all=[r'primitive', r'weil|q_l|hecke', r'test']),
    dict(id='fam-linear-zero-measure-lmi', closedBy='c1-window-sdp-scaling',
         name='Positivity LMI linear in the zero measure coupled to the explicit formula',
         all=[r'\\blmi\\b|\\bsdp\\b|semidefinite', r'pick|explicit formula|explicit-formula']),
    dict(id='fam-multidelay-section', closedBy='c1-multidelay-bohr-section',
         name='Jointly passive multi-delay sections of the prime chain',
         all=[r'multi-?delay|joint(ly)? (inner|passive|contractive)', r'section|prime chain|cascade']),
    dict(id='fam-pd-log-strip', closedBy='c1-pd-log-strip',
         name='Positive-definiteness of log zeta on vertical lines left of the pole',
         all=[r'positive[- ]definite', r'log (zeta|F)\b|log-zeta', r'strip|sigma|line']),
]

NEW_NODE_DEFAULTS = {
    'legendre-dual-limit-density-zero': dict(usesMultiplicativity='no', heightUniform='yes',
        tags=['landau', 'certificate', 'legendre-lp'], name='Limit points of Legendre-LP dual-feasible points have density 0'),
    'legendre-dual-restriction-rule': dict(usesMultiplicativity='no', heightUniform='yes',
        tags=['landau', 'certificate', 'legendre-lp'], name='Legendre-LP dual feasibility restricts along divisibility chains'),
    'cofinal-pointwise-mobius-sum': dict(usesMultiplicativity='yes', heightUniform='yes', status='conjectural',
        tags=['moebius', 'landau', 'legendre-lp', 'explicit-formula'], name='Pointwise bound for the Moebius sum of one fixed cofinal sawtooth remainder',
        extra=' Uses the integers and all primes jointly; fails for DH, Liouville and theta^3 at Lambda_a >= 0; not separated from E_a at the level of exponents (returns 1/2 + a); only a mean-square bound is argued (MV-CAP).'),
    'vaughan-forcing-is-gauge': dict(usesMultiplicativity='yes', heightUniform='yes',
        tags=['landau', 'mollifier', 'moebius'], name='Vaughan X^(1/4) forcing is a normalisation removable by two linear mollifier conditions'),
    'vasyunin-lammin-two-sided': dict(usesMultiplicativity='no', heightUniform='n/a',
        tags=['nyman-beurling', 'gram'], name='Two-sided bound for the smallest eigenvalue of the Nyman-Beurling Gram matrix',
        extra=' Same law for DH and periodic non-multiplicative sequences; carries no zero information.'),
    'ctrl-sel-twisted-selberg': dict(usesMultiplicativity='n/a', heightUniform='n/a', type='control',
        tags=['control', 'trace-formula'], name='Control SEL: twisted Selberg zeta of Gamma(2)'),
    'selberg-pc-abscissa-half': dict(usesMultiplicativity='no', heightUniform='yes',
        tags=['trace-formula', 'landau'], name='Selberg companion in Theorem PC has abscissa sigma* >= 1/2'),
}


# Nodes added by the engine itself (not from a lane record). Status says what has been checked.
STATIC_NODES = [
    dict(id='ctrl-rz-reciprocal-shift', type='control', name='Control RZ_b: 1/zeta(s + 1 - b), 7/8 < b < 1',
         statement='RZ_b(s) = 1/zeta(s + 1 - b) = prod_p (1 - p^(b-1) p^-s) = sum mu(n) n^(b-1) n^-s. Log-derivative coefficients '
                   '-n^(b-1) Lambda(n): a signed twist of Lambda with |eps_n| <= 1 (control TW-). Meromorphic on C, real zero at s = b '
                   '(the pole of zeta), functional equation about Re s = b - 1/2 instead of 1/2. Has: Euler product, size, support, '
                   'continuation. Lacks: Lambda >= 0, the integers (coefficients mu(n) n^(b-1)), symmetry line 1/2. Elementary; stated by '
                   'the engine in batch 2, not refereed. Answers the open item of lane c1-missing-controls (a twist with a zero in '
                   '7/8 < Re s < 1); it needs infinitely many primes, as that lane noted.',
         status='proved', usesMultiplicativity='n/a', heightUniform='n/a',
         source='engine batch 2 (merge_outcomes.py STATIC_NODES); follow-up of push/c1-missing-controls', tags=['control', 'euler-product']),
]


def codes(strings):
    hit, passing = [], []
    for s in strings or []:
        head = s.split(':')[0] if ':' in s else s
        for code, pat in CTRL_PATTERNS:
            if re.search(pat, head, re.I):
                if code not in hit:
                    hit.append(code)
                if re.search(r'pass(es)? every|not excluded|not separated|does not separate|same (law|rows)|passes the',
                             s, re.I) and code not in passing:
                    passing.append(code)
    if 'TW+' in hit and 'TW-' in hit:
        pass
    return hit, passing


def main():
    old = {o['slug']: o for o in json.load(open(os.path.join(HERE, 'outcomes.json'), encoding='utf-8'))}
    out, new_nodes = [], []
    for f in sorted(glob.glob(os.path.join(HERE, 'outcomes', '*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        slug = d['slug']
        prev = old.pop(slug, {})
        nodes = d.get('nodes') or C1_NODES.get(slug, [])
        hit, passing = codes(d.get('controlsThatDefeat'))
        verdict = VERDICT.get(d['verdict'], d['verdict'])
        out.append(dict(
            slug=slug, verdict=verdict, batch=d.get('batch', 0), nodes=nodes,
            launchedNodes=d.get('launchedNodes', nodes), tags=d.get('tags', []),
            defeatedBy=hit, notSeparated=passing, controlsText=d.get('controlsThatDefeat', []),
            title=prev.get('title') or slug, path='push/' + slug,
            note=(d.get('obstruction') or d.get('survivingClaim') or '')[:600],
            lesson=d.get('lesson', ''), refereeHolds=d.get('refereeHolds'), aboutZeros=d.get('aboutZeros', False)))
        for n in d.get('newNodes', []):
            dflt = dict(NEW_NODE_DEFAULTS.get(n['id'], {}))
            extra = dflt.pop('extra', '')
            rec = dict(id=n['id'], type=n.get('type', 'identity'), name=n['id'].replace('-', ' '),
                       statement=n['statement'] + extra, status=n.get('status', 'proved'),
                       usesMultiplicativity='unknown', heightUniform='unknown',
                       source='engine lane ' + slug + ' (push/' + slug + '/RESULT.md, refereed once)', tags=[])
            if rec['status'] == 'open':
                rec['status'] = 'conjectural'
            rec.update(dflt)
            new_nodes.append(rec)
    for slug, o in old.items():       # entries with no record file are kept unchanged
        out.append(o)
    # proposed candidates of curated batches that have no record yet
    have = {o['slug'] for o in out}
    for f in sorted(glob.glob(os.path.join(HERE, 'curated', 'batch-*.json'))):
        for c in json.load(open(f, encoding='utf-8')):
            if c['slug'] not in have:
                out.append(dict(slug=c['slug'], verdict='proposed', batch=int(re.sub(r'\D', '', os.path.basename(f)) or 0),
                                nodes=c['nodes'], launchedNodes=c['nodes'], tags=c.get('tags', []), defeatedBy=[],
                                title=c.get('family', c['slug']), path='push/' + c['slug'], note=c.get('expectedStop', '')))
    new_nodes += STATIC_NODES
    json.dump(out, open(os.path.join(HERE, 'outcomes.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    json.dump(new_nodes, open(os.path.join(HERE, 'nodes', 'nodes-15.json'), 'w', encoding='utf-8'), indent=1,
              ensure_ascii=False)
    json.dump(FAMILIES, open(os.path.join(HERE, 'closed_families.json'), 'w', encoding='utf-8'), indent=1,
              ensure_ascii=False)
    print(f'outcomes.json: {len(out)} entries ({sum(1 for o in out if o["verdict"] == "closed")} closed); '
          f'nodes-15.json: {len(new_nodes)} nodes; closed_families.json: {len(FAMILIES)} families')


if __name__ == '__main__':
    main()
