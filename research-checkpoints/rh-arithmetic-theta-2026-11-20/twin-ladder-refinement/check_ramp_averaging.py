"""Exact finite algebra checks for the twin-ladder ramp and averaging refinement.

These checks support identities and countercontrols only, not RH.
"""
import json
from pathlib import Path
import sympy as s

checks = []

def record(name, assertion):
    assert assertion, name
    checks.append({'name': name, 'passed': True})

d = 4
I = s.eye(d)
X = s.zeros(d)
for r in range(d):
    X[(r + 1) % d, r] = 1
Z = s.diag(1, s.I, -1, -s.I)
record('Weyl commutation ZX = i XZ in dimension four', Z * X == s.I * X * Z)
symbols = s.symbols('q0:16')
Q = s.Matrix(d, d, symbols)
TQ = s.zeros(d)
for a in range(d):
    for b in range(d):
        W = X ** a * Z ** b
        TQ += W * Q * W.conjugate().T / d ** 2
record('Heisenberg twirl for an arbitrary symbolic 4 by 4 matrix',
       s.simplify(TQ - s.trace(Q) * I / d) == s.zeros(d))

# A, B are isometries; the selected identity word has maximally coherent
# images even though the complete Weyl average has the normalized value.
A = I[:, :2]
B = A
moment = 0
for a in range(d):
    for b in range(d):
        W = X ** a * Z ** b
        K = A.conjugate().T * W * B
        moment += s.trace(K.conjugate().T * K) / d ** 2
record('Averaged cross norm equals ranks product divided by dimension', moment == 1)
K = A.conjugate().T * B
record('A chosen word need not obey the averaged bound', s.trace(K.conjugate().T * K) == 2)

U = s.diag(1, 1, -1, -1)
V = s.Matrix([[0, 0, 1, 0], [0, 0, 0, 1],
              [1, 0, 0, 0], [0, 1, 0, 0]])
R = s.diag(1, -1, 1, -1)
record('Two involutions have a traceless fixed conjugation direction',
       U * U == I and V * V == I and s.trace(R) == 0 and
       U * R * U == R and V * R * V == R)

a, p, q = s.symbols('alpha p q', real=True)
record('Exact two-parity dimension normalization',
       s.simplify(p*q/a + (1-p)*(1-q)/(1-a)
                  - 1 - (p-a)*(q-a)/(a*(1-a))) == 0)

r0, r1, r2, c0, c1, c2 = s.symbols('r0 r1 r2 c0 c1 c2', real=True)
R2 = s.Matrix([[r0, r1], [r1, r2]])
C2 = s.Matrix([[c0, c1], [c1, c2]])
I2 = s.eye(2)
H = s.BlockMatrix([[I2, I2], [I2, -I2]]).as_explicit() / s.sqrt(2)
G = s.BlockMatrix([[R2, C2], [C2, R2]]).as_explicit()
goal = s.diag(R2 + C2, R2 - C2)
record('Twin-leg Hadamard transform is exact block diagonalization',
       s.simplify(H * G * H - goal) == s.zeros(4))
record('Twin-leg Gram defect retains the squared cross term',
       s.simplify(s.trace((G-s.eye(4)).T*(G-s.eye(4)))
                  - 2*s.trace((R2-I2).T*(R2-I2))
                  - 2*s.trace(C2.T*C2)) == 0)

# Direct spectral ramp check on prime powers at an exactly chosen X.
N = s.Integer(12)
terms = []
for prime in list(s.primerange(2, int(N) + 1)):
    power = prime
    while power <= N:
        terms.append((prime, power))
        power *= prime
trace_ramp = sum(s.log(prime) * (N / power - 1) for prime, power in terms)
sum_mangoldt = sum(s.log(s.factorint(n).popitem()[0]) * (N / n - 1)
                   for n in range(2, int(N) + 1) if len(s.factorint(n)) == 1)
record('Prime-power ramp trace equals weighted Mangoldt sum at X=12',
       s.simplify(trace_ramp - sum_mangoldt) == 0)

report = {
    'status': 'PASS', 'checks': checks, 'sympy_version': s.__version__,
    'scope': 'Finite exact algebra and countercontrols only. General finite-dimensional lemmas are proved in the note. No arithmetic averaging estimate, RH, or external Lean build is verified.'
}
output = Path(__file__).with_name('RAMP_AVERAGING_CHECKS.json')
output.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
