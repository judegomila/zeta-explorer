# Topological zero certificates and the remaining RH obstruction

Executed research attempt, 16 November 2026.

**Outcome: a rigorous finite certificate implementation, an exact positive-kernel countermodel, and two analytic restrictions on a global proof. RH is not proved.** This package develops the proposed topological certificate approach against the actual theta and odd-sector formulas in `judegomila/mathexplorer`, especially PRs #49, #50, and #56. All source commits are frozen in [SOURCES.md](SOURCES.md).

The useful connection to Kuperberg's certificate approach is architectural: allow substantial work to discover a witness, then verify that witness independently with exact or rigorous arithmetic. No reduction of RH to knot recognition, no polynomial bound on the size or discovery time of our zero certificates, and no implication from quasi-RH to RH is established here.

## 1. Results and their logical status

| Item | Result | Scope |
|---|---|---|
| Symmetric zero cages | 52 real, simple zeros certified by rigorous Rouché inequalities | Two explicitly bounded height bands |
| Complete zero counts | Full-boundary winding equals the sum of the cage counts in both bands | No unobserved zeros inside those bands |
| Adversarial controls | Off-real pairs produce winding 2; false unit-count claims are rejected | Tests the exact failure mode of the proposed method |
| Positive theta-kernel deformation | An explicit positive, even, rapidly decaying kernel adds an off-line quartet while retaining arbitrarily much prescribed finite evidence | Auxiliary function; not the actual xi function |
| Raw odd operator | It is Hilbert–Schmidt and compact; a constant positive lower gap on an infinite-dimensional tail is impossible | Does not disprove operator positivity |
| Unshifted moment bound | Its sufficient cage radius shrinks exponentially with height | Rules out this crude remainder estimate as an efficient global method |
| Shifted contour | An exact normalization removes the exponential mismatch and gives explicit disk and tail bounds | Upper bounds only; the necessary lower margins remain unproved |
| All-order theta inequality | Precisely identified from the audited PR #56 checkpoint | Still open; this is the RH-level step |

The mathematical lemmas are elementary derivations with symbolic checks where indicated. The finite zero certificates use Python-FLINT/FLINT/Arb as a trusted rigorous numerical base. They are not proof-assistant formalizations. No claim of novelty in the literature is made.

## 2. The finite topological method works

Put

\[
F(z)=\xi(1/2+iz),\qquad G(z)=e^{\pi z/4}F(z).
\]

The exponential has no zeros. It compensates for the large-height decay without changing the zero problem. Conjugation symmetry holds for both functions. For a real center \(t\) and radius \(r\), the verifier proves

\[
\boxed{|G(t)|+\frac{r^2}{2}\sup_{|z-t|\le r}|G''(z)|<r|G'(t)|.}
\tag{1}
\]

Taylor's remainder and Rouché's theorem give exactly one zero, counted with multiplicity, in the disk. Conjugation symmetry forces it to be real: a nonreal zero would bring its distinct conjugate into the same disk. The zero is therefore also simple.

Separately, a rigorous enclosure of every entire boundary edge proves that the image of a band boundary is homotopic, without meeting zero, to an exact rational polygon. Exact winding arithmetic counts every zero inside. The verifier checks that the disjoint cages lie inside their band and exhaust its total winding.

The result is stronger than finding many sign changes: it verifies the absence of any additional off-line zeros in the specified bounded regions.

| Height interval for \(s=\beta+i\gamma\) | Horizontal range | Total zeros | Real simple zeros in the \(z\) coordinate | Other zeros |
|---|---|---:|---:|---:|
| \(0<\gamma<144\) | \(0<\beta<1\) | 50 | 50 | 0 |
| \(7005<\gamma<7005.125\) | \(0<\beta<1\) | 2 | 2 | 0 |

Both bands cover the entire critical strip at those heights. The second contains the close pair near 7005.062866174921 and 7005.100564672647. The low band uses 3,994 certified edges and the close-pair band uses 212. The cages have radii 1/64 and 1/512 respectively. All proposed geometry is dyadic rational.

Generation and independent verification were executed. A further independent rerun verified the compressed certificate in approximately 4.12 seconds in this environment. Timing is descriptive, not a complexity claim. The verifier does not use zero indices or a zero-location routine as evidence; the generator uses those only to propose centers.

This validates the mechanism on established zero data. Platt and Trudgian already rigorously verified RH through height \(3\times10^{12}\); the present computations are not a verification record ([paper](https://arxiv.org/abs/2004.09765)). There is no claim about all heights between our two bands or beyond them.

### Negative controls

The checker certifies winding 2 around one conjugate pair of the polynomial

\[
((z-3)^2+1/64)((z+3)^2+1/64),
\]

and winding 4 around the quartet. Replacing those claims with winding 1 makes verification fail.

It also compares the actual \(G\) with \(GQ\), where

\[
Q(z)=\frac{((z-200)^2+1/16)((z+200)^2+1/16)}{(200^2+1/16)^2}.
\]

On the identical rectangle \(199.875<\Re z<200.125\), \(|\Im z|<0.375\), it proves winding 0 for \(G\) and winding 2 for \(GQ\). Thus it detects the inserted pair \(200\pm i/4\) by actual rigorous analytic evaluation.

The implementation and complete method are in [certificates/README.md](certificates/README.md).

## 3. The main obstruction: finite successes can coexist with a hidden quartet

The frozen source uses

\[
F(t)=\int_{\mathbb R}\kappa(u)e^{itu/2}\,du,
\qquad \kappa(u)=\Phi(u/4),
\]

where \(\kappa\) is the actual positive even theta kernel. We derive exact global bounds

\[
\kappa''\ge-8\kappa,\qquad \kappa^{(4)}\ge-256\kappa.
\tag{2}
\]

The proof differentiates the exact theta summands and verifies positive polynomial expansions on the whole half-line. Five intervals use exact rational Bernstein coefficients; the remaining half-line uses positive coefficients after a translation. There is no numerical root assumption or finite theta truncation in this proof.

For any \(T\ge16\) and \(0<\eta<1/2\), let

\[
a=\frac{8(T^2-\eta^2)}{(T^2+\eta^2)^2},\qquad
b=\frac{16}{(T^2+\eta^2)^2},\qquad
\widetilde\kappa=\kappa+a\kappa''+b\kappa^{(4)}.
\]

Equation (2) gives the uniform bound

\[
\boxed{\widetilde\kappa\ge\frac{11}{16}\kappa>0.}
\tag{3}
\]

Integration by parts in the source's Fourier convention gives exactly

\[
\boxed{
\widetilde F(t)=F(t)
\frac{((t-T)^2+\eta^2)((t+T)^2+\eta^2)}{(T^2+\eta^2)^2}.
}
\tag{4}
\]

The new function has added zeros at \(t=\pm T\pm i\eta\), corresponding to \(s=1/2\pm\eta\pm iT\). It retains a positive even kernel, double-exponential decay, entire order one, and the reflection symmetries. The multiplier is positive on the entire real axis, so the complete real-axis zero set, multiplicities, and signs are unchanged.

For any prescribed finite collection of bounded contours, choose \(T\) beyond them. The added factor has no zero inside those contours, and their zero counts are exactly unchanged. As \(T\to\infty\), the multiplier and its fixed derivatives converge to 1 on every fixed compact set. Correspondingly, any prescribed finite collection of strictly positive Taylor blocks remains positive for sufficiently large \(T\). This assertion is for each fixed finite collection; it does not interchange that quantifier with all orders.

There is also a direct negative odd-sector energy witness for sufficiently small \(\eta\), derived in the detailed note, rather than inferred solely from a global equivalence theorem.

**This is an auxiliary countermodel, not an RH counterexample.** It changes the exact arithmetic/theta identities of xi and does not retain its Euler product. It proves that the collection of finite tests, symmetry, and physical-kernel positivity does not by itself exclude an arbitrarily high hidden quartet. A successful proof has to use additional exact theta information or establish a uniform infinite-order sign theorem.

See [the complete proof](obstruction/POSITIVE_QUARTET_OBSTRUCTION.md) and [its exact algebra checker](obstruction/verify_positive_quartet_deformation.py).

## 4. A raw constant spectral gap cannot close the argument

For the exact PR #56 kernel, translating the cutoff integral gives

\[
H_0(x,y)=\alpha\int_{|x+y|/2}^{\infty}
2u\kappa\!\left(u-\frac{x-y}{2}\right)
\kappa\!\left(u+\frac{x-y}{2}\right)du.
\]

Let \(M=\sup|\kappa|\), \(F_1(r)=\int_r^\infty v|\kappa(v)|dv\). For \(H_-(x,y)=H_0(x,y)-H_0(x,-y)\),

\[
\|H_-\|_{\rm HS}^2
\le32\alpha^2M^2\int_0^\infty rF_1(r)^2dr<\infty.
\tag{5}
\]

Thus the raw operator on \(L^2(0,\infty)\) is compact. It cannot obey \(QH_-Q\succeq dQ\), with \(d>0\), on an infinite-dimensional orthogonal tail. An orthonormal sequence in that subspace converges weakly to zero, and compactness forces its quadratic energies to zero, contradicting the proposed gap.

This restricts a proposed proof mechanism; it does not disprove \(H_-\succeq0\). Compact positive operators can have eigenvalues tending to zero. Relative or preconditioned estimates may still work, provided their domains and reference form are justified. Standard Fredholm spectral flow at zero does not directly apply to this raw compact operator.

The detailed note also derives an explicit double-exponentially small spatial truncation error. Its limitation is sharp: positivity of a finite approximation together with an absolute error \(\epsilon\) yields only \(H_-\succeq-\epsilon I\). It does not determine the signs of modes whose energies are smaller than that error.

See [compactness and tail proof](analysis/cutoff_compactness_and_tail_obstruction.md).

## 5. A useful repair to the analytic backend

In the heat-flow normalization \(H_0(x)=\xi(1/2+ix/2)/8\), the crude absolute second-moment remainder is independent of the real height \(x\). But every fixed derivative of \(H_0(x)\) is \(O_k(x^3e^{-\pi x/8})\). At an exact zero, the resulting sufficient Rouché radius therefore has to be exponentially small. This is a defect of that envelope, not a statement about actual zero spacing.

An exact contour shift yields

\[
e^{\eta z}H_\tau(z)=\frac12\int_{\mathbb R}
e^{\tau(u+i\eta)^2}\Phi(u+i\eta)e^{izu}du,
\qquad 0<\eta<\pi/8.
\tag{6}
\]

Choosing \(\eta=\pi/8-1/x\), fixed for the entire contour centered near \(x\), removes the main exponential amplitude loss. At \(\tau=0\), the derived derivative upper envelopes grow only polynomially in \(x\), with logarithmic factors. Explicit scalar tail formulas are included.

This is a usable way to preserve cancellation when implementing theta-based contour certificates. It does not produce the missing lower bound on the boundary model or normalized derivative. An all-height family of unit cages would also prove simplicity, a stronger conclusion than RH alone. Shrinking or clustered regions need to be allowed, with additional reasoning for real-rootedness inside any multi-zero cluster.

See [the derivation and limitations](analysis/theta_cage_obstruction_and_contour_shift.md). Its accompanying mpmath table is explicitly diagnostic, not interval-certified evidence.

## 6. The exact remaining target in the existing work

PR #56 already identifies the decisive all-order inequality. For every odd polynomial \(p\), put \(D=d/dr\). The target is

\[
\boxed{
\int_0^\infty\left[
r|p(D)\kappa(r)|^2+
\Re\!\left(\overline{p(D)\kappa(r)}\,p'(D)\kappa(r)\right)
\right]dr\ge0.
}
\tag{7}
\]

Here \(p'\) is the formal derivative of the polynomial, not the physical derivative of \(p(D)\kappa\). The frozen source equates (7) to positivity of every odd Taylor block \(J_N\), and propagates that positivity to the full analytic kernel. Its Fourier/Löwner step relates full odd positivity to RH. The low-degree certificates do not prove (7) at every degree.

The present work does not close (7). It makes two requirements for a proposed closure explicit:

1. It must distinguish the exact theta kernel from the positive deformations (3)–(4), or prove an all-order estimate that those deformations fail.
2. It must remain valid as positive energies approach zero. An assumed constant tail gap for the raw operator cannot be used.

A useful next proof target is a theta-specific factorization or a justified relative bound for the complete residual, including the nullspace coupling highlighted in PR #50. If the next step is numerical, the finite winding verifier can check contours and independently reject incorrect claims, but increasing the number of verified bands does not replace the missing uniform theorem.

## 7. Related quasi-RH literature checkpoint

The knot-certificate analogy must retain its hypotheses: the newer recognition result discussed in the source thread uses a quasi-RH condition uniform over Dedekind zeta functions of number fields, not merely an ordinary-zeta strip. This package does not use that number-field hypothesis or the knot recognition theorem as a premise.

A separate October 2026 preprint by Cetin Hakimoglu-Brown, [arXiv:2610.12803](https://arxiv.org/abs/2610.12803), reports the conditional bound \(\Lambda\le0.13963\), assuming the ordinary-zeta seven-eighths strip and retaining a published Polymath numerical boundary input. It explicitly says it does not use Gomila's new computations. This is relevant literature for the heat-flow direction, not a result of the present code, and neither that conditional bound nor its numerical inputs were independently reproduced in this package. A positive upper bound for \(\Lambda\) does not prove RH.

## 8. Reproduction

From this directory:

```bash
python -m pip install -r requirements.txt
python certificates/xi_certificates.py verify --certificate certificates/certificates.json.gz
python obstruction/verify_positive_quartet_deformation.py
```

The optional diagnostic table is reproduced with:

```bash
python analysis/theta_cage_diagnostics.py --output analysis/theta_cage_diagnostics.json
```

Run the symbolic checker with ordinary Python, without optimization flags that disable `assert`. The complete polynomial identities and Bernstein coefficient vectors are also saved as JSON for independent review.

The compressed certificate is 264,210 bytes. Its uncompressed mathematical payload has SHA-256:

```text
db19665a99c0abb95e6376270013bd271c2f6cdaf98f06d414a208f4fb360bd0
```

The delivered gzip has SHA-256:

```text
8562cd54222ca46e0c191dd0e3773cbc6532d955de2ceea39af1d3123398edaa
```

The two verification reports distinguish the original verifier run from the independent rerun. Timing may vary; counts and hashes should agree. Dependency binaries, caches, and raw duplicate certificate data are excluded from the package.
