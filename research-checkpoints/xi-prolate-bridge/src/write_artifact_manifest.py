#!/usr/bin/env python3
import hashlib
from pathlib import Path

root=Path(__file__).resolve().parents[1]
artifacts=root/'artifacts'
rows=[]
for path in sorted(p for p in artifacts.rglob('*') if p.is_file() and p.name!='ARTIFACT_MANIFEST.sha256'):
    rows.append(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(root)}")
(artifacts/'ARTIFACT_MANIFEST.sha256').write_text('\n'.join(rows)+'\n',encoding='ascii')
print(f'wrote {len(rows)} artifact hashes')
