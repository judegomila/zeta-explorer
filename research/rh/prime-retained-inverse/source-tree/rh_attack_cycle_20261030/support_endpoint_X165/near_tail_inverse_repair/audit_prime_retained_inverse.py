#!/usr/bin/env python3
"""Independent bounded algebra/sign audit; never runs the direction producer."""
import ast
import hashlib
import importlib.util
import json
from fractions import Fraction as Q
from pathlib import Path

from flint import arb, arb_poly, ctx, fmpq

HERE = Path(__file__).resolve().parent
BASE = HERE.parent
ROOT = BASE.parents[1]
PRODUCER = HERE / 'certify_prime_retained_direction.py'
RECEIPT = HERE / 'PRIME_RETAINED_DIRECTION_GATE.json'
DIRECT = ROOT / 'rh_attack_cycle_20261028/tail_coercivity/FULL_TAIL_COERCIVITY.md'
HEAD = ROOT / 'rh_attack_cycle_20261030/support_endpoint_continuity/generic_actual_head_pilot.py'
MANIFEST = BASE / 'BOUNDED_ATTEMPT_TERMINAL_MANIFEST.json'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

receipt = json.loads(RECEIPT.read_text())
assert receipt['source_sha256_before'] == receipt['source_sha256_after']
for path, sha in receipt['source_sha256_before'].items():
    assert digest(ROOT / path) == sha, path
manifest = json.loads(MANIFEST.read_text())
historical = 0
for path, info in manifest['compact_artifacts'].items():
    full = BASE / path
    key = str(full.relative_to(ROOT))
    if key in receipt['source_sha256_before']:
        assert digest(full) == info['sha256'], path
        historical += 1
before = {str(p.relative_to(ROOT)): digest(p) for p in
          [PRODUCER, RECEIPT, DIRECT, HEAD, MANIFEST, Path(__file__).resolve()]}

# Extract only the three function definitions, not producer top-level execution.
tree = ast.parse(PRODUCER.read_text())
defs = ast.Module(body=[node for node in tree.body if isinstance(node, ast.FunctionDef)
                       and node.name in {'cauchy_action', 'prime_coefficients', 'prime_quadratic'}],
                  type_ignores=[])
assert len(defs.body) == 3
code = compile(defs, str(PRODUCER), 'exec')

class ExactPoly:
    def __init__(self, coefficients):
        self.c = list(coefficients)
    def __getitem__(self, index):
        return self.c[index] if 0 <= index < len(self.c) else Q(0)
    def __mul__(self, other):
        c = [Q(0)] * max(0, len(self.c) + len(other.c) - 1)
        for i, x in enumerate(self.c):
            for j, y in enumerate(other.c):
                c[i+j] += x*y
        return ExactPoly(c)

exact = {'arb': Q, 'arb_poly': ExactPoly}
exec(code, exact)
bounded = {'arb': arb, 'arb_poly': arb_poly}
exec(code, bounded)
ctx.prec = 512
blocks = [(1, 1), (1, 9), (2049, 11), (4093, 13), (16380, 7)]
entry_count = 0
quadratic_count = 0
for a, m in blocks:
    vectors = [[Q(int(i == k)) for i in range(m)] for k in range(m)]
    vectors += [[Q((-1)**i*(i+1), i+3) for i in range(m)],
                [Q((i % 3)-1, 2*i+1) for i in range(m)]]
    for x in vectors:
        h = exact['cauchy_action'](x, a)
        direct = [sum((x[k] / ((a+i)**2-(a+k)**2)
                       for k in range(m) if k != i), Q(0)) for i in range(m)]
        assert h == direct
        ah = bounded['cauchy_action']([arb(fmpq(q.numerator, q.denominator)) for q in x], a)
        # contains(fmpq) first encloses the rational as an Arb ball; testing
        # exact dyadic endpoints avoids requiring containment of that wider ball.
        assert all(v.lower().fmpq() <= fmpq(q.numerator, q.denominator) <= v.upper().fmpq()
                   for v, q in zip(ah, direct))
        entry_count += m
        bp = [Q((-1)**i*(i+2), 2*i+1) for i in range(m)]
        diag = [Q(i-2, i+1) for i in range(m)]
        q = exact['prime_quadratic'](x, a, bp, diag)
        qdirect = sum((x[i]**2*diag[i] for i in range(m)), Q(0))
        qdirect += 4*sum((x[i]*x[k]*((a+i)*bp[i]-(a+k)*bp[k]) /
                          ((a+i)**2-(a+k)**2)
                          for i in range(m) for k in range(i)), Q(0))
        assert q == qdirect
        quadratic_count += 1

spec = importlib.util.spec_from_file_location('audited_actual_source', HEAD)
head = importlib.util.module_from_spec(spec)
spec.loader.exec_module(head)
ns = head.inputs(Q(33, 2), max_index=0, bits=512)

def cos_integral(freq, phase, lo, hi):
    if freq == 0:
        return (hi-lo)*phase.cos()
    return ((freq*hi+phase).sin()-(freq*lo+phase).sin())/freq

def one_shift(j, k, r):
    # Integrate e_j(x)e_k(x-r) over the actual overlap, r>0.
    W, pi = ns['W'], ns['pi']
    uj, uk = 2*pi*j/W, 2*pi*k/W
    lo, hi = -W/2+r, W/2
    return (cos_integral(2*pi*(j-k)/W, uk*r, lo, hi) +
            cos_integral(2*pi*(j+k)/W, -uk*r, lo, hi))/W

def literal_negative_prime(j, k):
    # Both indices are positive: cosine normalization contributes 2/W,
    # cancelling the 1/2 from the product-to-sum identity above.
    return -sum((w*(one_shift(j,k,arb(n).log()) + one_shift(k,j,arb(n).log()))
                 for n,w in ns['terms']), arb(0))

literal_count = 0
for a, m in [(1, 5), (2049, 7), (4093, 8), (16380, 5)]:
    bp, diag = bounded['prime_coefficients'](ns, a, m)
    for i in range(m):
        for k in range(m):
            j, l = a+i, a+k
            formula = diag[i] if i == k else 2*(-1)**(j+l)*(j*bp[i]-l*bp[k])/(j*j-l*l)
            literal = literal_negative_prime(j, l)
            assert formula.is_finite() and literal.is_finite()
            assert (formula-literal).contains(0), (j,l)
            literal_count += 1

c, eps = Q(2,25), Q(1,4)
assert c*(1-eps) == Q(3,50)
assert c*(1/eps-1) == Q(6,25)
assert arb(receipt['permitted_c_ceiling']) > arb(2)/25
assert arb(receipt['quadratic_young_frozen_direction_lower']) > 0
assert arb(receipt['new_frozen_direction_lower']) > 0
Pstar = arb(477513)/125000
xnorm = arb(receipt['near_preconditioned_norm_squared'])
qp = arb(receipt['actual_negative_prime_quadratic'])
E = arb(receipt['near_B_energy'])
G = arb(receipt['far_B_energy_upper'])
old = arb(receipt['old_full_surrogate_rayleigh'])
assert (Pstar*xnorm+qp).overlaps(E)
assert (old+(arb(3)/50)*E-(arb(6)/25)*G).overlaps(
    arb(receipt['quadratic_young_frozen_direction_lower']))

after = {p: digest(ROOT/p) for p in before}
assert before == after
out = {
    'status': 'PASS_ANALYTIC_AND_BOUNDED_IMPLEMENTATION_AUDIT_NOT_FULL_DIRECTION_REPLAY',
    'independent_precision_bits': 512,
    'exact_fraction_cauchy_entries': entry_count,
    'arb_cauchy_entries_contain_exact_fraction': entry_count,
    'exact_fraction_quadratic_tests': quadratic_count,
    'literal_shifted_prime_entries': literal_count,
    'historical_manifest_source_matches': historical,
    'all_current_producer_hashes_match_receipt': True,
    'receipt_scalar_algebra_verified': True,
    'inverse_c': '2/25', 'young_near_coefficient': '3/50',
    'young_far_energy_coefficient': '6/25',
    'source_sha256_before': before, 'source_sha256_after': after,
    'full_direction_producer_rerun': False,
    'full_head_positivity_proved': False,
    'scope': 'Analytic proof audit and independent bounded exact/literal tests. Numeric directional margin is the pinned producer result, not a fresh complete replay. No endpoint or RH claim.'
}
(HERE/'PRIME_RETAINED_INVERSE_INDEPENDENT_AUDIT.json').write_text(json.dumps(out, indent=2)+'\n')
print(json.dumps(out, indent=2))
