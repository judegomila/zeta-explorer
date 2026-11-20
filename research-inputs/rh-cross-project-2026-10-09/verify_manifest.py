from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent
data=json.loads((root/'manifest.json').read_text())
for name,want in data['sha256'].items():
    path=(root/name).resolve()
    assert path.is_relative_to(root.parent.parent.resolve())
    got=hashlib.sha256(path.read_bytes()).hexdigest()
    if got!=want:raise SystemExit('HASH MISMATCH: '+name)
print('PASS',len(data['sha256']),'artifact hashes')
