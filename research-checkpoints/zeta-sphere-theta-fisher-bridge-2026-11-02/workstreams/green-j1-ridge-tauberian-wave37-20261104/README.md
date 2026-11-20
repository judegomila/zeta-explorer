# Finite-J Green closure and ridge Tauberian refinement

## Scope

This append-only checkpoint records two independently audited analytic
advances:

1. the finite left `m=1, J=1` Green correlation is strictly positive;
2. the all-degree ridge blocker admits a weaker Tauberian/Dini criterion and
   exact positive-action identities.

No finite scan is used as proof.  The first result closes one finite Green
case only.  The actual-theta all-degree Dini condition is not proved, and no
Riemann-hypothesis conclusion is claimed.

## Finite `J=1` Green theorem

With `x=pi exp(2h)`, `y=pi^2/x`, and

\[
 F_1=4\pi^{-1/4}\{b(x)+b(y)\},
 \qquad b(t)=t^{5/4}(t-1)e^{-t},
\]

the source notes prove:

- `F_1` has exactly one positive zero `h_0`, with its positive interval
  containing the unique theta hump;
- throughout that positive-response interval,

\[
 \psi'F_1'-\psi''F_1>0.
\]

The exact higher-shell loss is less than `151/217` of the positive first
direct shell, leaving margin greater than `66/217`.  Therefore
`(-psi'/F_1)'>0` on the positive interval, and the previously established
equal-level pairing gives

\[
 \boxed{I_1>0.}
\]

The symbolic verifier checks an alternate domain-split algebraic certificate:
the generic shell expansion, the first-shell factorization, exact Bernstein
minima, and the stored rational tail fractions.  It does not encode the
analytic `F_1` topology, the cleaner global `151/217` bound in the frozen
domination note, or the final level-pair implication.  Those steps are
covered by the frozen analytic notes and were rederived independently without
a numerical scan.

## Ridge Tauberian refinement

Let

\[
 B_n=X_{E_n}^{-1/2}Q_{E_n}X_{E_n}^{-1/2},
 \qquad
 M_n(t)=\|{\bf1}_{(0,t]}(B_n)c_n\|^2.
\]

If one fixed Dini modulus satisfies

\[
 M_n(t)\le t^2\omega(t),\qquad
 \Omega(t)=\omega(t)+2\int_0^t{\omega(s)\over s}\,ds\longrightarrow0,
\]

then the exact low/high split gives

\[
 s_{2,n}\le\Omega(t)+{s_{1,n}\over t}.
\]

Full `H`-block positivity also gives

\[
 \sum_{r_j<1}{b_j^2\over1-r_j}\le h_n,
 \qquad b_j=0\quad(r_j=1),
\]

and hence

\[
 \boxed{s_{2,n}\le\Omega(t)+{h_n\over t^2}.}
\]

Thus `h_n -> 0` plus one uniform Dini modulus is sufficient for the full
selected residual ratio to tend to zero.  The exact necessary-and-sufficient
low-energy concentration and scalar ridge-continuity formulations are in the
source memo.  A fixed power law is only one sufficient special case; it is
not necessary.

For `Q_lambda=X-lambda H` and the corresponding monic residual `q_lambda`,
the action identity is

\[
 \boxed{
 s_2={2\over A}\int_0^1
 \lambda Q_\lambda[\dot q_\lambda],d\lambda.}
\]

An equivalent ridge-coordinate identity is also proved in the addendum.
These formulas retain the correlated inverse and permit scale-dependent
boundary layers.  The missing theorem is an actual-theta estimate for this
all-scale mass/action, not generic positivity or polynomial `X` conditioning.

## Verification

Run from this directory:

```text
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  src/verify_j1_green_analytic.py > /tmp/j1_green_exact_symbolic.json
cmp /tmp/j1_green_exact_symbolic.json results/j1_green_exact_symbolic.json
shasum -a 256 -c SHA256SUMS
```

The mathematical audits are independent AI-assisted analytic checks, not
external peer review or machine formalization.
