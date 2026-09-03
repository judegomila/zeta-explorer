# Gate-2 evaluator inputs — provenance

Copied 2026-09-02 from judegomila/dbn-lambda-01787854-candidate-audit
(public sealed referee package), origin/main commit a74738de. Files-only copy;
the sealed originals in that repo are authoritative (SHA256SUMS-attested).
The audit repo is FROZEN — consume these here, do not push changes back.

- verify_uniform_error_01787854.c — exact uniform Theorem-1.3 error
  evaluation conventions (the G1-confirmed source).
- lemma_sweep_p235711.c (+ _triangle_stored variant) — the finite-row
  producer: exact window landmark map N(x,t) with xN = 4*pi*N^2 - pi*t/4,
  gamma_at (the explicit gamma(x): exp(0.02y - (y/2) ln(xN/4pi))),
  shard/seam conventions, bound_constants (sig, modK, modgamma).
- verify_tail_arb.c — the ladder exponents sigma1/sigma2 (the paper's
  s_A(x), s_B(x)) and the cap/window kernel definitions in their
  authoritative Arb form.
- verify_window_freeze.py — half-open window coverage / seam conventions
  behind the cutoff tensor.
