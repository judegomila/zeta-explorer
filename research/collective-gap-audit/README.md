# Collective gap interaction audit (research prototype)

This audit evaluates the dimensionless collective interaction
\(R_j=g_j^2 S_j/2\), where
\(S_j=\sum_{k\ne j,j+1}[(x_{j+1}-x_k)(x_j-x_k)]^{-1}\).
For a real-rooted heat polynomial with simple roots, the exact identity is
\((g_j^2)'=8-4g_j^2S_j=8(1-R_j)\).

## Run

```bash
pip install mpmath
python gap_audit.py --zeros 80 --exact-pairs 3 --output gap_snapshot.csv
```

The tests verify (1) the exact heat polynomial \(z(z^2-1-6t)\),
for which \((g^2)'=6\), and (2) a finite regular lattice, where
\(R=M/(M+1)\) tends to one.

The zeta snapshot is **not a proof certificate**. It includes only the
first N known critical-line ordinates, omits the negative ordinates, all
later zeros, and any hypothetical off-line zeros. Its computed
\(8(1-R_j)\) is a truncated *model* prediction, not the true heat
derivative. For the first few pairs, the script independently evaluates
the true derivative at time zero using \(H''/H'\) from the completed
xi function; the discrepancy explicitly measures the danger of
truncation. Here the xi heat variable is \(z=2\gamma\).

The full Dyson sum must be regularized and controlled before using it
as an exact statement about the infinite xi family. Assuming every
unlisted zero is real would already assume RH.

**Research next step:** replace the truncated interaction with a
rigorous interval enclosure for the actual \(H''/H'\), then study its
variation over positive heat time. No global RH bound is claimed.
