"""Verify this analytical checkpoint's bytes, not its mathematical proof."""
from pathlib import Path
from hashlib import sha256

root = Path(__file__).resolve().parent
expected = set()
for line in (root / 'SHA256SUMS').read_text().splitlines():
    digest, rel = line.split('  ', 1)
    path = Path(rel)
    if path.is_absolute() or '..' in path.parts or rel in expected:
        raise ValueError('Unsafe or duplicate manifest path: ' + rel)
    if len(digest) != 64 or any(c not in '0123456789abcdef' for c in digest):
        raise ValueError('Invalid digest: ' + rel)
    expected.add(rel)
    if sha256((root / path).read_bytes()).hexdigest() != digest:
        raise ValueError('Hash mismatch: ' + rel)
actual = {p.relative_to(root).as_posix() for p in root.rglob('*')
          if p.is_file() and '__pycache__' not in p.parts and p.name != 'SHA256SUMS'}
if actual != expected:
    raise ValueError(('Inventory mismatch', actual - expected, expected - actual))
print(f'PASS: {len(expected)} files match; this is not machine verification of the proof.')
