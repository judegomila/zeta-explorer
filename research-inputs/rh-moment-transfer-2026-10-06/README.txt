RH moment-transfer audit - October 6, 2026

Read rh_moment_transfer.pdf for the mathematical argument.

Result: The direct transfer, the actual sixth-power amplifier, and the
optimistic combined-mark worksheet do not produce a smaller zero-free
boundary. The posted 7/8 theorem is used as an external input and implies
E_II(T) = O(exp(3T/4)) for the existing moving-window Vaughan packet.
No RH proof, exponent contraction, novelty, or record claim is made.

Reproduce exact finite checks (Python 3.10+, no third-party dependencies):
    python3 verify.py

This writes verification.json. All coefficients are represented by exact
integers or rational numbers. Logarithms of primes in the coefficient
identity are formal symbols, not floating-point approximations.

Build the note with a standard TeX Live installation:
    pdflatex -interaction=nonstopmode -halt-on-error rh_moment_transfer.tex
    pdflatex -interaction=nonstopmode -halt-on-error rh_moment_transfer.tex

The verification checks finite algebra and negative controls. It does not
run the imported Lean project or prove the universal analytic estimates.
The note supplies the analytic proofs for the derived identities and
states exactly which estimates are inherited or imported.

The original v9 bundle and full external source were read during the audit.
They are identified by IDs/hashes and source URLs in source_index.json;
third-party manuscripts are not redistributed here.

Files:
  rh_moment_transfer.pdf   Seven-page research note
  rh_moment_transfer.tex   Complete note source
  verify.py               Independent exact-arithmetic checker
  verification.json       Check results and checker source hash
  source_index.json       Source provenance and scope
  manifest.json           SHA-256 hashes of this release's files

No GitHub repository or deployed application was changed in this attempt.
