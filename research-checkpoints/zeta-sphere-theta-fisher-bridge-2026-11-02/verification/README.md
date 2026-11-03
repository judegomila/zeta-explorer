# Verification

The default checks are intentionally bounded and do not pretend to rerun every
historical certificate.

```bash
python3 verify_archive.py
python3 run_smoke.py
```

`verify_archive.py` checks every retained snapshot file against the original
manifest and every separately retained delta against its supplied checksum or
allowlist. It also checks that every policy exclusion is absent, that each of
the nine v18 public text redactions matches both its original-manifest identity
and recorded public hash, and that the two v19 redactions match the source and
public hashes in `provenance/v19-redactions.json`. For V20--V26 it verifies the
seven exact publication manifests, 174 rows/146 unique payloads/28 identical
carry-forwards, all seven recorded index redactions, and the exact 154-file
continuation directory. For V27--V30 it verifies the four exact publication
manifests, 121 rows/84 unique payloads/37 identical carry-forwards, all six
identifier-only redactions, the exact 89-file public directory, and the
absence of the 33 declared private/acquired paths. Finally it verifies the
root `SHA256SUMS` against the exact public checkpoint tree, excluding only the
checksum file itself and known local LaTeX build intermediates.

`run_smoke.py` copies selected exact-rational verifiers to a temporary
directory and executes them there. This keeps the frozen evidence byte-for-byte
unchanged. The smoke suite covers algebraic normalization, joint
inverse/anchor identities, the matrix-anchor obstruction, and several
dependency-light rational certificate deductions.

`check_v19_certificates.py` uses only the Python standard library. It checks
the stored H6 reserve and normalization inequalities, every odd endpoint
payment through degree 19, the paid degree-2 Newman bounds, source/audit hash
agreement, and an independent exact-rational replay of the orthogonality
identity through degrees 0--7.

`check_v20_v26_certificates.py` also uses only the Python standard library. It
checks the stored degree-five paid certificate, alternative H5 window,
positive-parent constants, degree-nine endpoint certificate, source/audit
output agreement, internal checksum manifests, and explicit floating-diagnostic
labels. It validates frozen summaries and conservative inequalities; it does
not rerun the Arb or SymPy programs, execute any floating diagnostic, or prove
the analytical statements recorded in the accompanying notes.

`check_v27_v30_certificates.py` reruns three standard-library exact checks in
a temporary copy: the degree-only coefficient envelope, Gauss-orbit constants,
and orbit recurrence. It requires byte-identical source/audit replay summaries,
checks diagnostic scope labels, and validates the stored 2048-cell even-channel
certificate summary. It does **not** rerun that Arb job, access excluded source
captures, execute floating probes, or certify a new theta pivot.
Several frozen diagnostics retain historical absolute path strings and are not
portable without the excluded private inputs; the bounded checker intentionally
does not execute them.

The latest bounded replay and paper inspection receipt is recorded in
[`last-run.json`](last-run.json).

Separate v19 scientific replays reran the 512-cell H6 Arb checker, the endpoint
evaluator using the frozen 1000-cell parent, the paid endpoint extraction and
tail constants, and the symbolic orthogonality smoke. The default suite does
**not** rerun the 1000-cell parent construction, the `60000 x 1000` paid
rectangle integration, the historical `2^21`-point DFT, every interval
quadrature, or the full high-precision dependency stack. Captured outputs next
to their source files are provenance, not a claim that this PR reran every
upstream computation.

For the continuation integration, fresh temporary-copy runs reproduced the
degree-nine 3072-cell certificate, the 6000-cell positive-parent constants,
the alternative H5 window certificate, the Fisher/Laguerre identities, and
four symbolic transport/reflection outputs. Degree-five endpoint extraction
matched the frozen source and audit, but the full `1024 x 1024` degree-five Arb
integration was not rerun. Floating scans were not executed as certificates.

For V27--V30, the default bounded suite reruns only the three elementary exact
checks described above. A separate scientific replay reran the complete
2048-cell even `0,2,4,6,8` Arb verifier under Python 3.13.15/python-flint 0.9.0
and reproduced the frozen JSON byte-for-byte. The correlated N1/N2 rational
diagnostics and the orbit, degree-only, and Gauss-orbit checks were also
reproduced; N1/N2 reuse earlier certified moments and are not fresh quadrature
or new ladder results. The v27 floating probes and all acquired/private source
checkers were not executed as proof checks.

