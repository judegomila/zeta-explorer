"""Verify included checkpoint bytes; deliberately does not fetch omitted data."""
from hashlib import sha256
from pathlib import Path

root = Path(__file__).resolve().parent
expected = set()
for line in (root / 'SHA256SUMS').read_text().splitlines():
    digest, rel = line.split('  ', 1)
    path = Path(rel)
    assert not path.is_absolute() and '..' not in path.parts, rel
    assert len(digest) == 64 and all(c in '0123456789abcdef' for c in digest), rel
    assert rel not in expected, 'duplicate: ' + rel
    expected.add(rel)
    assert sha256((root / path).read_bytes()).hexdigest() == digest, 'hash mismatch: ' + rel
actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()
          and '__pycache__' not in p.parts and p.name != 'SHA256SUMS'}
assert actual == expected, (actual - expected, expected - actual)
print(f'PASS: {len(expected)} included files match; omitted proof data were not checked.')
