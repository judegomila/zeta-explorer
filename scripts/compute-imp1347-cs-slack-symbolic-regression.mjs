#!/usr/bin/env node
// imp-1347: symbolic-regression identification of the Cauchy-Schwarz slack in
// the imp-1267 Hilbert-Schmidt bound for the endpoint-Hankel Volterra operator.
//
// The imp-1267 bound chains two inequalities:
//
//   ||V_{a,Phi}||_op  <=  ||V_{a,Phi}||_HS  <=  sqrt(I_0 * J_a)
//                          ^------ HS_exact          ^------ HS_bound
//
// imp-1267/imp-1317 report a CONSISTENT slack between sqrt(I_0 J_a) and the
// empirical op-norm (~1.71x for Delta, 1.58x-2.57x for xi). That outer ratio
// mixes TWO independent factors:
//
//   sqrt(I_0 J_a)/op  =  [sqrt(I_0 J_a)/HS_exact] * [HS_exact/op].
//                          ^-- Cauchy-Schwarz slack    ^-- HS-vs-op ratio
//
// This script isolates and symbolic-regresses the FIRST factor (the genuine
// Cauchy-Schwarz slack of the sinh(a(x-y)) <= sinh(ax) step). In the small-a
// limit it has an EXACT closed form in terms of the Phi-moments:
//
//   M_k := int_0^inf Phi(u)^2 u^k du,   rho^2 := M_1^2 / (I_0 M_2),
//
//   slack_CS  =  sqrt(I_0 J_a) / ||V||_HS  -->  1/sqrt(1 - rho^2)   as a -> 0.
//
// Derivation: small-a gives sinh(a(x-y)) ~ a(x-y), sinh(ax) ~ ax, hence
//   ||V||_HS^2 ~ a^2 * int int_{0<=y<=x} Phi^2(x)Phi^2(y)(x-y)^2 = a^2 (I_0 M_2 - M_1^2),
//   I_0 J_a    ~ a^2 * I_0 M_2,
//   ratio^2    = I_0 M_2 / (I_0 M_2 - M_1^2) = 1/(1 - rho^2).
//
// Statistical reading: with weight w = Phi^2/I_0 on R_+ and X the coordinate,
//   slack_CS = sqrt(E_w[X^2]) / std_w(X) = 1/sqrt(1 - rho^2),  rho = E_w[X]/sqrt(E_w[X^2]).

const N_PHI = 10;
function Phi(u) {
  let s = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
      Math.exp(-Math.PI * n2 * e4u);
  }
  return s;
}

const U = 4.0;
const N = 8000;
const h = U / N;
const t = new Float64Array(N);
const p2 = new Float64Array(N);
let I0 = 0, M1 = 0, M2 = 0;
for (let i = 0; i < N; i++) {
  const x = (i + 0.5) * h;
  t[i] = x;
  const p = Phi(x);
  const pp = p * p;
  p2[i] = pp;
  I0 += pp; M1 += pp * x; M2 += pp * x * x;
}
I0 *= h; M1 *= h; M2 *= h;

const rho2 = (M1 * M1) / (I0 * M2);
const slackClosed = 1 / Math.sqrt(1 - rho2);

function hs2(a) {
  let s = 0;
  for (let i = 0; i < N; i++) {
    const ti = t[i];
    const pi = p2[i];
    let inner = 0;
    for (let j = 0; j <= i; j++) {
      const sh = Math.sinh(a * (ti - t[j]));
      inner += p2[j] * sh * sh;
    }
    s += pi * inner;
  }
  return s * h * h;
}
function Ja(a) {
  let s = 0;
  for (let i = 0; i < N; i++) {
    const sh = Math.sinh(a * t[i]);
    s += p2[i] * sh * sh;
  }
  return s * h;
}

const aSmall = 0.001;
const slackEmp = Math.sqrt(I0 * Ja(aSmall)) / Math.sqrt(hs2(aSmall));
const EX = M1 / I0, EX2 = M2 / I0, VarX = EX2 - EX * EX;

const out = {
  generatedAt: new Date().toISOString(),
  grid: { U, N, h },
  moments: { I0, M1, M2, EX, EX2, VarX },
  rho2,
  slack_closed_form: slackClosed,
  slack_empirical_smallA: slackEmp,
  aSmall,
  rel_err: Math.abs(slackClosed - slackEmp) / slackEmp,
  // a-sweep of the same-grid slack (verifies a-independence to leading order)
  slack_by_a: [0.5, 0.1, 0.025, 0.005, 0.001].map((a) => ({
    a, slack: Math.sqrt(I0 * Ja(a)) / Math.sqrt(hs2(a)),
  })),
};
console.log(JSON.stringify(out, null, 2));
