# Retaining actual prime-tail stiffness

## Accepted result and scope

Accepted means internal mathematical review and the stated independent execution,
not external peer review or proof-assistant formalization.

**Accepted and independently replayed:** the actual reflection-even supported
Weil form is coercively positive for
\[
1<\lambda\le\sqrt{33/2}.
\]
The certificate includes the entire infinite tail. Its coercivity constant is
existential; no numerical constant is inferred from LDL pivots. This extends
the previously accepted finite even endpoint \(\sqrt{161/10}\). It does not
prove odd-sector positivity, a cofinal-support result, or RH, and does not
claim that positivity stops at this endpoint.

## 1. A genuine failed comparison, then a different bound

At the same exact support \(X=33/2\), the earlier diagonal-inverse comparison
failed its last core pivot. An independently checked exact rational vector
still has lower-surrogate energy about \(-3.9398212\times10^{-77}\), even
though its actual head energy is positive. This did not prove actual negative
Weil energy. The failed sources, receipts and witness remain preserved.

No larger cutoff, higher prime power, precision escalation or support sweep
was used to obtain the new result. The repair changes the mathematical inverse
estimate itself.

## 2. The retained whole-tail operator

Let \(D\) be the actual even tail beyond \(N=2048\), and \(P_T\) the actual
selfadjoint prime translation operator compressed to that entire tail.
The unchanged eighth-power norm envelope is
\(P_*=477513/125000\). With the existing gamma and compressed-kernel bounds,
\[
D\ge d+B,\qquad B=P_*I-P_T,\qquad 0\le B\le2P_*I,
\]
where \(d=\operatorname{diag}(d_j)\) and
\[
d_j=\Re\psi(5/4+i\pi j/W)-\log\pi
       -\Gamma_{\rm ref}(W)-H_K(W)/N-P_*,\quad W=\log(33/2).
\]
The entire-tail floor exceeds \(0.7061304911532\).

For \(T=d^{-1/2}Bd^{-1/2}\), spectral calculus proves
\[
(I+T)^{-1}\le I-cT
\quad\text{when}\quad
c\le\frac{d_{\min}}{d_{\min}+2P_*}.
\]
The verified right side is \(0.0846036249\ldots\); fixing \(c=2/25\) gives
\[
D^{-1}\le d^{-1}-\frac{2}{25}d^{-1}Bd^{-1}.
\]
This retains actual tail stiffness instead of charging every direction as if
it simultaneously realized the worst prime norm. It is a global operator
inequality, not a discarded-cross-block approximation.

## 3. Every near/far interaction remains charged

Write \(z=d^{-1}Kv=z_n+z_f\), splitting at \(J=16384\). Let
\(E(v)=\langle z_n,Bz_n\rangle\), and let \(F(v)\) be the old complete far
majorant, including its isotropic remainder. Then
\[
\langle z_f,Bz_f\rangle\le(2P_*/d_{\rm far})F(v).
\]
The positive-semidefinite seminorm Cauchy–Schwarz and Young inequalities with
fixed parameter \(1/4\) prove the whole-head lower comparison
\[
A_{\rm head}-K^*D^{-1}K
\ge A_{\rm head}-\mathrm{Near}-rF+\frac{3}{50}E,
\qquad
r=1+\frac6{25}\frac{2P_*}{d_{\rm far}}
 =1.6583678812485898\ldots.
\]
Both the far coefficient matrix **and** its isotropic remainder are multiplied
by \(r\). No prime cross-band term has been silently omitted.

For the saved exact witness \(v_0\), put \(Y=d_n^{-1}K_n\),
\(E_0=\langle Yv_0,B_{nn}Yv_0\rangle>0\), and
\(e=Y^*B_{nn}Yv_0\). Another valid Cauchy–Schwarz inequality gives
\[
Y^*B_{nn}Y\ge ee^*/E_0.
\]
Thus a proved positive rank-one term can replace the near-head Gram. It is
not an artificial lift. The old constant-coordinate lift remains removed.
This update raises the core displacement rank from four to six while keeping
the 72 far features. On the original failed witness, the new quadratic lower
value is \(+1.8312465\times10^{-76}\); the complete certificate below, not
this one direction, supplies the theorem.

## 4. Complete producer and isolated independent replay

At exact \(X=33/2\), with \(N=2048,J=16384,L=36\) and 1000-bit Arb:

| Gate | Complete result |
|---|---|
| Corrected head core | All 2,049 pivots positive |
| Far coefficient matrix | All 72 pivots positive |
| Whitened Schur test | All 72 pivots positive |
| Producer vs independent replay | Every nontiming field and full permutation identical |
| Integrity | All 19 source files and 115 isolated runtime files unchanged |

The last core pivot is approximately \(1.25343\times10^{-77}\), with 160 bits
of relative accuracy; the minimum whitened pivot is approximately \(0.781429\).
These numbers are sign diagnostics, not eigenvalue floors. Producer and
independent replay took about 195 and 193 seconds.

The positive finite Schur lower form and positive entire actual tail yield
whole-even coercivity by bounded triangular block factorization. Isometric
zero extension from a smaller centered box preserves the actual form and
parity, so the same existential constant applies on all smaller supports.

## 5. Reproduction and provenance

The proposed local source package contains the full theorem, the 19 exact
driver dependencies, the new proof and implementation audits, producer and
independent receipts, and the failed-route evidence. It requires
`python-flint==0.9.0`; runtime binaries need not be vendored in the app.

Preserve the frozen sources and receipts. From a fresh disposable copy of its
`source-tree` directory, run

```bash
PYTHONPATH=/absolute/path/to/python-flint-0.9.0 python \
  rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/certify_prime_retained_rankone.py --full
```

Use `--small` for the direct dense/generator preflight. The integration
manifest supplies exact source and receipt hashes. The inherited prime norm,
gamma and far-tail bounds are explicitly pinned; this replay evaluates the
new complete positivity gate, not a fresh prime-norm enumeration.

The result remains a finite reflection-even theorem. No odd-sector or
all-support conclusion is inferred, and RH is not proved.
