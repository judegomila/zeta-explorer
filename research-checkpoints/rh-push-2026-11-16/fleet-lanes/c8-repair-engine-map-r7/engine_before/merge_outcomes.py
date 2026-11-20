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
           'partial-result': 'partial', 'open': 'open', 'closed': 'closed', 'dead': 'closed'}

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
    ('WT', r'\bWT\b|window[- ]translate|lattice (height )?translates?|height translates?'),
    ('FM', r'\bFM\b|finite modification|finitely many (euler|local) factors'),
    ('THIN', r'\bTHIN\b|thin twist'),
]

# Closed combination families (ENGINE_LOG.md, batch 1, plus round-1 lanes). A candidate is
# rejected when every regex of a family matches the joint text (ids, names, statements, tags) of
# its members. Patterns are narrow on purpose: a family closes a mechanism, not a topic.
# Optional key 'unless' (added by c4-repair-map-engine-r3): a regex that exempts a candidate, used
# for the forms a closing lane left open by name. Optional key 'row': the map row of the family.
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
         all=[r'order[- ]2|order two|half-integral|double cover|h ?= ?r/2', r'theta|half-integral|kubota|double cover']),
    # c5-repair: the second group no longer matches '7/8' or 'seven-eighths' alone. With them the pattern matched the open
    # direction itself (map section 6 item 1, node map-open-1, device 'effective-order-two' in curated/devices.json) and
    # rejected every candidate containing it (1080 in the first c5 run); the closed form is the theta / half-integral rows.
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
         all=[r'\blmi\b|\bsdp\b|semidefinite', r'pick', r'explicit formula|explicit-formula|zero measure']),
    # c4-repair: the word boundaries above were double-escaped (only 'semidefinite' could match); with them fixed
    # a third group (the explicit-formula coupling) keeps the family on the closed mechanism
    dict(id='fam-multidelay-section', closedBy='c1-multidelay-bohr-section',
         name='Jointly passive multi-delay sections of the prime chain',
         all=[r'multi-?delay|joint(ly)? (inner|passive|contractive)', r'section|prime chain|cascade']),
    dict(id='fam-pd-log-strip', closedBy='c1-pd-log-strip',
         name='Positive-definiteness of log zeta on vertical lines left of the pole',
         all=[r'positive[- ]definite', r'log (zeta|F)\b|log-zeta', r'strip|sigma|line']),
    # ---- campaign round 2 (map rows P41, P42, G25, Q21, Q22); added by c4-repair-map-engine-r3
    dict(id='fam-euler-product-at-zeros', closedBy='c2-euler-at-zeros', row='P41',
         name='Partial Euler products sampled at the zeros (depletion / Landau-Gonek diagonal)',
         all=[r'partial euler product|truncated euler product|finite euler product|euler stage|zeta_S\b|euler multiplier',
              r'(sampled|evaluated|summed|sum) (at|over) (the |its )?(nontrivial |non-trivial )?zeros|'
              r'at the zeros of|over (the )?zeros in a window|landau-gonek|deplet']),
    dict(id='fam-projection-domination-gonek', closedBy='c2-projection-domination-gonek', row='P42',
         name='Window-local projection domination of an off-line pair with the smoothed Landau-Gonek identity',
         all=[r'projection[- ]dominat|on-line projection|dominat\w* (by|of) (its|the) (on-line )?projection',
              r'landau-gonek|gonek|explicit[- ]formula|prime sum|von mangoldt|Lambda\(n\)|euler[- ]product']),
    # note: the first group is carried by the single node telescoping-kernel-projection-domination (the node the
    # closing lane was launched from); the second group is any prime-side partner. Row P42: only the support and
    # size of Lambda enter and a multiplicative weight gives no gain, so the partner does not change the stop.
    dict(id='fam-cutoff-hecke-commutator', closedBy='c2-cutoff-hecke-defect', row='G25',
         name='Commutator of the cutoff Q_c with Hecke dilations (window defect, square-root form)',
         all=[r'cut-?off|\bQ_c\b|window defect', r'hecke|dilation', r'commutat|\[Q_c']),
    dict(id='fam-rotation-invariant-stage-bound', closedBy='c2-polydisc-leeyang-bound', row='Q21',
         name='Rotation-invariant stage tools as a size bound for Euler stages (polydisc stability, multi-affine Lee-Yang, Grace-Walsh-Szego, Asano, Borcea-Branden, Ruelle radius)',
         all=[r'polydisc|multi-?affine|grace-walsh|asano|borcea|ruelle radius|lee-yang (radius|property|circle)|stable polynomial',
              r'euler stage|stage|partial euler|truncated euler|finite euler|prime chain',
              r'bound|size|stabil']),
    dict(id='fam-jcontractive-multidelay-lft', closedBy='c2-jinner-multidelay-lft', row='Q22',
         name='J-contractive linear-fractional sections of the prime chain in several delays',
         all=[r'j-(inner|contractive|unitary|expansive)|linear-fractional|potapov',
              r'several delays|multi-?delay|multiple delays|delays? (p\^|at each prime)|prime chain|polydisc',
              r'section|factor|chain']),
    # ---- campaign round 3 (ROUND_LOG.md 'Families closed in round 3'); added by c4-repair-map-engine-r3
    dict(id='fam-pole-lattice-multiplier', closedBy='c3-lemmab-referee-dh-poisson', row='P43',
         name='Pole-lattice test multipliers (Lemma B, theta-family and shifted forms) as a route to an inequality',
         all=[r'pole[- ]lattice|periodi[sz]ed (explicit formula|prime measure|prime sum)|S-periodi[sz]ed|2 ?pi ?i ?k ?/ ?log ?p|lemma b\b.{0,80}(explicit|residue|pole)',
              r'explicit formula|explicit-formula|weil|positiv|multiplier|residue']),
    dict(id='fam-lemmab-sup-bound-halfplane', closedBy='c3-lemmab-halfplane-growing-s', row='P43',
         name='Lemma B with sup bounds on vertical lines (7/8 half-plane as input, S growing with T)',
         all=[r'pole[- ]lattice|periodi[sz]ed (explicit formula|prime measure|prime sum)|S-periodi[sz]ed|2 ?pi ?i ?k ?/ ?log ?p',
              r'7/8|seven-eighths|half-plane|sup bound|vertical line|zero-free']),
    dict(id='fam-fixed-point-onesided-in-p', closedBy='c3-fixedt-growingp-onesided', row='T2',
         name='One-sided bounds in P at a fixed strip point (twisted form of T2/P10)',
         all=[r'one-sided', r'fixed (s\b|point|strip point)|one fixed point|single strip point',
              r'in P\b|all P\b|P ?-> ?inf|growing P|as P grows|euler stage|partial (euler )?product|renormalised (stage|prime sum)']),
    dict(id='fam-reflected-euler-stage-canonical', closedBy='c3-twinladder-prime-built-chain', row='G10',
         name='Truncated Euler products reflected about Re s = 1/2 as de Branges, Pontryagin or canonical-system stages',
         all=[r'prime-built|euler stage|truncated euler product|partial euler product|finite euler product|\bE_X\b',
              r'de branges|hermite-biehler|pontryagin|canonical system|hamiltonian|negative squares']),
    dict(id='fam-tail-generic-selector', closedBy='c3-helson-tail-fe-selector',
         name='Tail, generic, almost-everywhere and rotation-invariant selectors on T^inf',
         all=[r'helson|tail[- ](set|measurable|event|sigma)|almost[- ]every(where)?|\ba\.e\.|generic|comeagre|haar[- ]null|rotation-invariant',
              r'T\^inf|prime torus|bohr torus|infinite torus|polytorus|infinite-dimensional torus',
              r'select|exceptional set|sort|separat|characteri[sz]'],
         unless=r'twisted sums?|additive(ly)? twist|additive character|e\(a ?n ?/ ?q\)'),
    dict(id='fam-rs-halfsum-hermite-biehler', closedBy='c3-rs-matched-halfsum-hb',
         name='Riemann-Siegel half-sum Hermite-Biehler variants at matched height (smooth cut-off, Gabcke terms, unequal lengths); mollified pivot is row P27',
         all=[r'half-sum|riemann-siegel (main|half)|main sum|sum_\{?n ?<= ?N\}? ?n\^',
              r'hermite-biehler|right zeros|zeros (in|to the) right|levinson|interlac']),
    dict(id='fam-fixed-window-count-rigidity', closedBy='c3-multiwindow-converse-defect', row='S12',
         name='Window functional-equation rigidity with a fixed number of windows',
         all=[r'window', r'functional[- ]equation', r'rigidity|converse|uniqueness',
              r'euler cone|unimodular (euler|twist|phase)|window (test|defect|count)'],
         unless=r'riemann-siegel length|sqrt\(T'),
    dict(id='fam-jcontractive-several-delay-joint', closedBy='c3-repair-map-theorem-a', row='Q22',
         name='Jointly J-contractive several-delay sections (lead 20); open only: boundary nodes of R_a (a >= 1/2), Reinhardt-shell sections, sections containing the gamma term',
         all=[r'joint(ly)?', r'j-(inner|contractive)|contractive|passive|schur', r'several[- ]delay|multi-?delay|delays'],
         unless=r'reinhardt|gamma term'),
    # ---- campaign round 4 (ROUND_LOG.md 'Families closed in round 4'; map rows P44-P47, G26); added by
    # c5-repair-engine-map-r4. The exemption 'functional-equation-symmetrised' of three families above was removed
    # in the same edit (the stage it exempted is closed by c4-fe-stage-rouche-crossing).
    dict(id='fam-helson-discrepancy-zerofree', closedBy='c4-helson-discrepancy-zerofree', row='P46',
         name='Power-saving discrepancy of partial sums of a completely multiplicative unimodular chi as a source of a zero-free region (relative to zeta; Beurling passes)',
         all=[r'discrepancy|partial sums? of chi|c ?x ?\+ ?O\(x\^|close to (its|their) mean',
              r'completely multiplicative|unimodular|helson|multiplicative function',
              r'zero-free|zeros? of|rigidity|forces|continuation'],
         unless=r'twisted sums?|additive(ly)? twist|additive character|e\(a ?n ?/ ?q\)'),
    dict(id='fam-fe-symmetrised-stage-rouche', closedBy='c4-fe-stage-rouche-crossing', row='P44',
         name='Functional-equation-symmetrised Euler stages (Gonek type) with Rouche or Hurwitz comparison, Fejer weights or the approximate functional equation',
         all=[r'functional-equation-symmetrised|fe-symmetrised|P_X ?\+ ?chi|gonek',
              r'stage|euler',
              r'rouch[e\xe9]|hurwitz|fej[e\xe9]r|approximate functional equation|zero count|comparison|on the line|phase comb']),
    dict(id='fam-stage-collision-index', closedBy='c4-stage-collision-law', row='P45',
         name='Stage collision / local-index events as carriers of zero information (torus-invariant, positive height-independent rate)',
         all=[r'collision[- ]local[- ]index|local index|stage collision|collision (event|law)|double zero of the stage',
              r'euler stage|stage zeros?|fe-symmetrised|functional-equation-symmetrised|prime-only|euler[- ]fe|prime torus']),
    dict(id='fam-laxphillips-hecke-compression', closedBy='c4-laxphillips-hecke-compression', row='G26',
         name='Hecke operators compressed to the Lax-Phillips space; Hecke norm bounds on resonance states (weighted-L2 family)',
         all=[r'lax-phillips|scattering (matrix|space|factorisation)|incoming and outgoing|resonance states?',
              r'hecke',
              r'compress|norm bound|resonance|strip bound']),
    dict(id='fam-ramare-mr-pointwise', closedBy='c4-ramare-factorisation-pointwise', row='P47',
         name='Ramare / Matomaki-Radziwill factorisation and pretentious-distance statements as every-window or one-sided inputs (MV-CAP, tail type)',
         all=[r'matom[a\xe4]ki|radziwi|ramar[e\xe9]|pretentious|short[- ]interval factori[sz]ation|factori[sz]ation of dirichlet polynomials',
              r'pointwise|every[- ]window|one-sided|zero-free|inertia|bandwidth|hardy-littlewood|zeros?']),
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
    # c4-repair: ENGINE_LOG batch 2, lane 8: the m-reflection is Gauss-sum algebra with no factor depending on the
    # target. Tag 'target-blind' is read by generate.py (rule: only arithmetic step is target-blind).
    'theta-dual-mseries-is-twisted-kubota': dict(usesMultiplicativity='yes', heightUniform='n/a',
        tags=['target-blind', 'metaplectic', 'theta'], name='Theta-dual m-series is a twisted stripped sextic Kubota series (target-blind)',
        extra=' The identity contains no factor depending on the target function: it is the same for every eta and for DH (lane e2-theta-dual-mseries-fe).'),
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
    # ---- crossing devices named in campaign round 4 (ROUND_LOG.md, round 4 allocation). All three lanes reported
    # (round 4 results): each device is closed. c5-repair-engine-map-r4: status 'closed' (the node becomes a wall in
    # build_graph.py), tag 'crossing-device' removed; device states are kept in curated/devices.json.
    dict(id='rouche-fe-symmetrised-euler-stage', type='mechanism',
         name='Rouche comparison of zeta with a functional-equation-symmetrised Euler stage',
         statement='Stage zeta_X(s) = P_X(s) + chi(s) conj(P_X(1 - conj s)), P_X an Euler stage over the primes up to X and '
                   'chi the factor of the functional equation (Gonek 2012 type; recalled, source not opened). The stage '
                   'satisfies the functional equation by construction, and its zero measure on the line is the phase comb of '
                   'phi(t) = -2 vartheta(t) - 2 arg P_X(1/2 + it). Proposed device: Rouche comparison of zeta with zeta_X on '
                   'the boundary of a window through the approximate functional equation, so that the zero count of zeta in '
                   'the window equals that of the stage. Uses all primes up to X jointly and the functional equation in the '
                   'same step. Known so far: the k = 0 term of the comb is the explicit-formula density with primes up to X, '
                   'and its positivity on a window is the sup bound of the truncated prime sum against (1/2) log(t/2 pi), '
                   'which holds for X of order log^2 t only (round 3, lesson 2); anything further must come from the k != 0 '
                   'terms or from the comparison. Not established: any Rouche margin. To be checked: the unimodular twist '
                   'has the same stage theorem and no approximate functional equation; rows G10, Q10 (finite Euler stages '
                   'without the functional equation are closed); Hamburger uniqueness past the Riemann-Siegel length. '
                   'Closed by lane c4-fe-stage-rouche-crossing (refereed once): the stage has all zeros on the line for any '
                   'non-vanishing P_X; the Rouche inequality on a box is implied only by zero-freeness of a slightly larger region.',
         status='closed', usesMultiplicativity='yes', heightUniform='unknown',
         source='campaign/ROUND_LOG.md, round 4 allocation, lane 3 (c4-fe-stage-rouche-crossing); follows push/c3-twinladder-prime-built-chain',
         tags=['euler-product', 'functional-equation', 'finite-stage', 'riemann-siegel', 'rouche']),
    dict(id='hecke-compression-lax-phillips', type='mechanism',
         name='Hecke operators compressed to the Lax-Phillips space of the modular surface',
         statement='Lax-Phillips scattering for PSL(2,Z): the scattering matrix is xi(2s-1)/xi(2s) (classical), so the '
                   'resonances of the compressed semigroup on K = H minus (D_- + D_+) are at rho/2. Proposed device: compress '
                   'the Hecke operators T_p to K; a norm bound of the form p^theta + p^-theta with theta < 1/2 on resonance '
                   'states would bound Re rho. It would use the commuting Hecke family at all primes (an operator-norm '
                   'statement, so independent of height), and non-arithmetic groups, which have no Hecke family, are a '
                   'structural control. Not established: no bound is proved; expected first obstacle: T_p does not preserve '
                   'the incoming and outgoing subspaces D_-, D_+. Related nodes: bridge-scattering-factorisation, '
                   'antihermitian-strip-bound. The Lax-Phillips rows already closed concern the scattering form of '
                   'zeta(s-a)/zeta(s+a) with heat-fiber-completion-theorem, not a Hecke compression. '
                   'Closed by lane c4-laxphillips-hecke-compression (refereed once): on the Eisenstein channel T_p = 2 cos(log p '
                   'sqrt(-L)); the compression has norm at most 2 for every inner scattering function; only Re rho <= 1 follows.',
         status='closed', usesMultiplicativity='yes', heightUniform='unknown',
         source='campaign/ROUND_LOG.md, round 4 allocation, lane 5 (c4-laxphillips-hecke-compression)',
         tags=['hecke', 'automorphic', 'lax-phillips', 'scattering']),
    dict(id='helson-discrepancy-rigidity', type='open-lemma',
         name='Discrepancy rigidity for completely multiplicative unimodular functions (Helson)',
         statement='Property D(theta) for a completely multiplicative unimodular chi: sum_{n <= x} chi(n) = c x + O(x^theta). '
                   'It is not a tail property (finite modifications of chi = 1 have discrepancy of order log x; Klurman, '
                   'recalled, source not opened) and it holds at chi = 1 with theta = 0: the one object found in round 3 that '
                   'is both non-tail and tied to chi = 1. D(theta) gives the continuation of F(s) - c/(s-1) to Re s > theta, '
                   'which is data to the left of Re s = 1. Proposed device: D(theta) forces a zero-free region '
                   'Re s > f(theta) for F with f(0) < 1. Open alternative to be decided: the converse lemma (D(theta) forces '
                   'the set of primes with chi(p) != 1 to be thin, so F/zeta is zero-free and pole-free on Re s > theta and '
                   'the implication runs through zeta, circular) or a non-thin example. The proposed control THIN (thin '
                   'twist) bounds what the implication can give: at best zero-free Re s > theta. '
                   'Closed by lane c4-helson-discrepancy-zerofree (Theorem 1, two referee checks): right of the largest real '
                   'zero of F the zeros of F are those of zeta with matching orders; the implication is relative to zeta and '
                   'transfers to Beurling systems.',
         status='closed', usesMultiplicativity='yes', heightUniform='unknown',
         source='campaign/ROUND_LOG.md, round 3 results (results that could be combined) and round 4 allocation, lane 1 '
                '(c4-helson-discrepancy-zerofree); follows push/c3-helson-tail-fe-selector',
         tags=['torus', 'helson', 'euler-product', 'discrepancy']),
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
        # round-7 learn step: a record may carry engineVerdict (closed | partial | open). Used when the referee does not
        # hold the claim as stated, so that a precise-obstruction record is not counted as a closure (c7-repair E2).
        verdict = d.get('engineVerdict', verdict)
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
