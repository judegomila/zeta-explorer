from pathlib import Path
from hashlib import sha256
root=Path(__file__).resolve().parent
expected=set()
for line in (root/'SHA256SUMS').read_text().splitlines():
    digest,rel=line.split('  ',1)
    assert not Path(rel).is_absolute() and '..' not in Path(rel).parts
    assert rel not in expected
    expected.add(rel)
    assert sha256((root/rel).read_bytes()).hexdigest()==digest,rel
actual={p.name for p in root.iterdir() if p.is_file() and p.name!='SHA256SUMS'}
assert actual==expected,(actual-expected,expected-actual)
print('PASS:',len(expected),'files verified against SHA256SUMS.')
