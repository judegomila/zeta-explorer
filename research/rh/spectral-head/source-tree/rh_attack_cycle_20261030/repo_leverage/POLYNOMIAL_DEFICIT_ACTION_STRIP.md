# Polynomial-deficit action strip and an all-depth tail moment

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Sections1–4 independently reviewed; receipt pinned separately. Section5 remains conditional on its stated endpoint input.** This note does not estimate a signed arithmetic operator. It supplies a spectral-width sharpening for combination with the separately derived endpoint-collar estimate.

## 1. Conventions and result

Use `c=2pi lambda²`, `S=2c/pi`, `beta=(2/pi²)log(100c/pi+25)`, differential eigenvalue nu_n and concentration deficit `d_n=1-|chi_n|²`. Work on `|chi_n|>=1/2`, so `0<d_n<=3/4`.

For each FIXED A>0 there exists a finite, unspecified lambda_A such that, for lambda>=lambda_A and any qualifying mode with `d_n>=lambda^(-A)`,

    |nu_n-c²| <=32 c log(10/d_n).                         (1)

With `r=4floor((floor S-1)/4)`, the same estimate gives

    |nu_n-nu_r| <=40 c log(10/d_n).                       (2)

The constants32 and40 do not depend on A; the onset may depend on A. Every mode in the growing polynomial-deficit window is covered uniformly. This is not a fixed-label asymptotic.

## 2. Coarse strip from exact action and KRD

The preceding spectral-range argument gives, on the subcritical side,

    0<=c²-nu_n <=2c[8+beta u_n], u_n=log(10/d_n),        (3)

for n>=2. It follows directly from the exact Bonami–Karoui action inequality `n<J(nu_n,c)<n+1`, its lower derivative bound `J_v>=1/(2c)` below c², and the uniform leading-side KRD bound `S-n<=8+beta u_n`. When the leading-side KRD index condition fails, S-n<1 and that inequality is automatic. Fixed n=0,1 do not enter the polynomial-deficit window eventually: `d_n<=10exp[-(floor S-n-7)/beta]`, whose negative logarithm has size c/log c, while `Aloglambda=O_A(log c)`. Thus `d_n<lambda^(-A)` for both fixed labels after enlarging the onset.

For d_n>=lambda^(-A),

    u_n<=log10+Aloglambda=O_A(log c),
    beta=O(log c).

Therefore (3) places every such subcritical mode in

    c²-M_A c(log c)² <=nu_n<c²                            (4)

for one finite M_A and all sufficiently large c. Enlarge the onset so the lower endpoint is positive.

The separately audited eventual threshold result gives the supercritical bound `0<nu_n-c²<=3c/2`. This already implies (1) on that side.

## 3. The logarithmic action derivative removes the coarse log loss

For 0<v<c² the exact extended elliptic action has derivative

    J_v(v,c)=K(sqrt(v)/c)/(pi c),
    K(s)=integral_0^(pi/2) (1-s²sin²theta)^(-1/2)dtheta. (5)

[Bonami–Karoui, equation (23)](https://arxiv.org/html/1405.3676v2) gives, in particular,

    K(s)>=(1/2)log[1/(1-s)], 0<s<1.                     (6)

For every v between nu_n and c² in (4),

    1-sqrt(v)/c
      =(c²-v)/(c²+c sqrt(v))
      <=M_A(log c)²/c <=c^(-1/2)                        (7)

eventually. Equations (5)-(7) yield the UNIFORM strip bound

    J_v(v,c)>=(log c)/(4pi c).                          (8)

The infinite derivative at v=c² is harmless: its logarithmic singularity is integrable, and the inequality can first be integrated up to c²-epsilon and then passed to the limit. Since J(c²,c)=S and J(nu_n,c)>n,

    (c²-nu_n)log c/(4pi c)
       <=S-J(nu_n,c)<S-n<=8+beta u_n.                   (9)

Enlarge the onset again so beta<=log c and `8/log c<=u_n`, the latter being uniform because u_n>=log(40/3)>2. Thus (9) gives

    (c²-nu_n)/c <=8pi u_n<32u_n.

This proves (1). The fixed reference has `|nu_r-c²|<10c`, and `10<8log(40/3)<=8u_n`, so (2) follows. Its positive same-phase membership and the strict reference gap were independently checked in the preceding range audit.

This uses a fixed A only to choose a common strip/onset. The derivative estimate is uniform over that entire strip; no moving-mode asymptotic is substituted into a fixed-parameter expansion.

## 4. Exact deep-deficit first moment

The uniform cumulative KRD concentration theorem implies, for every `0<a<=1/2`,

    sum_(d_n<=a) d_n
      <= a{ beta[log(5/(a(1-a)))+1]+7 }.                (10)

The sum can include all parity/sign classes. To see this, layer cake gives

    sum_(d_n<=a)d_n=integral_0^a #{n:t<=d_n<=a}dt.

For almost every t in(0,a), these labels lie strictly in the concentration transition interval `(t,1-t)`, apart from measure-zero threshold coincidences. Its count is bounded by `beta log(5/(t(1-t)))+7`. Finally use `1-t>=1-a` and integrate log(1/t). This proves (10), with no endpoint allowance necessary after integration.

In particular, at a=lambda^(-8),

    sum_(d_n<=lambda^(-8))d_n
       =O(lambda^(-8)(log c)²),                         (11)

uniformly as lambda grows. This controls the arbitrarily deep part of the head, not only a finite j window.

## 5. Conditional row consequence — not yet a signed estimate

Suppose the separately reviewed collar lemma supplies, on d_n>=lambda^(-8),

    e_n(lambda)²<=C lambda d_n/log c.                   (12)

Together with (2) and the already valid moment `sum_head d_n log²(10/d_n)=O(log c)`, this gives

    sum_shallow e_n(lambda)²(nu_n-nu_r)²<=C lambda c².   (13)

For deep deficits, use the global endpoint inequality `e_n²<=256pi²lambda d_n`, the eventual coarse spectral range `|nu_n-nu_r|<=2c²`, and (11). Their row contribution is

    O(lambda c^4 lambda^(-8)(log c)²)
       =O(lambda(log c)²)=o(lambda c²).                 (14)

Thus (12), once admitted, would give a SUPPORT-UNIFORM additive endpoint spectral row `sum_head e_n²(nu_n-nu_r)²<=C lambda c²`. The complete divided-difference argument would then remove the log³ factor from the additive VALUE frame.

No claim is made here about the smallness of C, the deficit-whitened metric, nonzero endpoint traces, a translation modulus, origin repairs, Möbius signs, mean projection, gamma-orthogonality, an evenized Gram floor, or the global Weil bound.
