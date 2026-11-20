# Actual-theta Pollaczek comparison and favorable trial-family checkpoint

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves two frozen, audited research packages byte-for-byte, including both original checksum manifests. It adds no edits to earlier evidence, the integrated paper, application code, CI workflows, or live 4CT scripts.

**The comparison is all-degree, and the explicit natural Pollaczek family has a favorable actual derivative/source ratio. Neither is a selected-polynomial coherence theorem, all-degree bridge positivity, or RH closure.**

## 1. All-degree actual-source comparison

Read the [comparison package](comparison/README.md), its [two-sided theorem](comparison/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md), and [natural gamma-reference extension](comparison/NATURAL_GAMMA_REFERENCE.md).

For `Tp = Fp' + 2F'p`, `X[p] = integral_R |Tp|^2`, and `W_4(t) = |Gamma(4+it/2)|^2`, one fixed constant C works for every real polynomial of degree at most n:

    exp[-C log^2(n+2)] ||p||_(W_4)^2 <= X[p] <= C(n+1) ||p||_(W_4)^2.

For the natural parameter `W_*(t) = |Gamma(9/4+it/2)|^2`, the same lower bound holds and the upper bound is `C(n+1)^3 ||p||_(W_*)^2`. The corresponding actual X Gram condition numbers, in the reference-orthonormal basis and after individual X normalization, are bounded by `exp[C log^2(n+2)]`.

These estimates retain the actual theta form, including its arithmetic zeros. They do not replace its Gram matrix by scalar asymptotics. Subexponential conditioning is not uniform conditioning, and a subexponential monic-norm ratio is not a bounded ratio or one tending to unity.

## 2. Favorable explicit full-degree family

Read the [natural-family package](natural/README.md), [main proof](natural/NATURAL_FAMILY_RATIO.md), [uniform inner envelope](natural/UNIFORM_INNER_ENVELOPE.md), and [arithmetic-scale corollary](natural/ARITHMETIC_SCALE_COROLLARY.md).

For the explicit monic family `M_n(t) = n!P_n^(9/4)(t/2;pi/2)` and `b_n = (4pi/2^(9/2))n!Gamma(n+9/2)`, the package establishes, for all sufficiently large n of either parity,

    integral F^2 M_n^2 + H[M_n] <= C b_n log n,
    c b_n log^2 n <= X[M_n] <= C b_n log^3 n,
    H[M_n]/X[M_n] <= C/log n -> 0.

The source upper bound is an additional corollary using the supplied cumulative Hardy-Z derivative-moment theorem. It also gives `B_n <= C b_n log(n+2)` for the ordinary derivative minimum and `A_n <= C b_n log^3(n+2)` for the actual X-selected monic minimum. The two-sided reference comparison separately gives `X[M_n]/A_n <= exp[C log^2(n+2)]`.

The Fourier representation and global envelope retain signed polynomial structure. The actual Hardy-Z inputs are used without absolute selected-column sums or assumed inverse-Gram control.

## 3. Exact remaining gap

The explicit M_n are not the fully X-selected P_n. The known lower bound `A_n >= exp[-C log^2(n+2)] b_n` does not dominate the upper bound on B_n. The favorable trial H/X ratio therefore does not prove selected derivative decay, `Delta_n > 0`, or `U_n = o(Delta_n)`. Relative selected transfer and its signed derivative cancellations remain open.

These are analytical results with completed independent AI-assisted audits, not external peer review or machine-formalized proofs. No literature-novelty claim is made. The supplied theta normalization, scalar Hardy moment estimates, and finite-band top-mode theorem are inherited dependencies; this backup does not independently re-prove them.

The [previous finite-band theorem](../theta-short-packet-2026-11-04/src/BANDLIMITED_TOP_MODE_LOWER_BOUND.md) and [mesoscopic Hardy-Z input note](../theta-short-packet-2026-11-04/src/MESOSCOPIC_FEJER_HARDY_Z_ASYMPTOTIC.md) are already preserved separately. Generic workspace paths retained in the frozen source are provenance, not portable links.

The earlier companion notes' descriptions of missing arithmetic trial estimates are historical to those notes; the later natural-family proof supplies the explicit trial ratio. It does not supply the still-missing selected transfer.

## 4. Integrity and publication scope

All 14 allowlisted source files are preserved exactly. Both original SHA256SUMS files cover six final Markdown payloads each. The natural package's initial DRAFT and conditional WKB-route snapshots are excluded, as required by its final README.

MANIFEST.json records each source file's SHA-256, byte length, original checksum coverage, and exclusions. The outer SHA256SUMS covers all package files except itself. Run `python3 verify_checkpoint.py` from this directory to check exact coverage, hashes, byte lengths, and scope labels. This is an integrity checker, not a mathematical proof checker. The preparation process separately compares every copied source with its original frozen bytes.

Only this new checkpoint directory is proposed for publication. No existing repository file is changed or removed. Service credentials, private conversation URLs, runtime files, and acquired external material are excluded.
