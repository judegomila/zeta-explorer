"""Recompute only the 128 coefficients used here using the inherited engine."""
from pathlib import Path
from fractions import Fraction
import importlib.util, json, hashlib
root=Path(__file__).resolve().parent
path=root/'input/inherited_coefficient_generator.py'
spec=importlib.util.spec_from_file_location('inherited',path)
engine=importlib.util.module_from_spec(spec);spec.loader.exec_module(engine)
assert engine.check_interval_engine()>0
q=engine.Arithmetic().coefficients(6,128)
data=json.loads((root/'input/arithmetic-row.json').read_text())
for i,(fresh,old) in enumerate(zip(q,data['q'])):
    assert max(Fraction(fresh.lo),Fraction(old['lower']))<=min(Fraction(fresh.hi),Fraction(old['upper'])), i
    assert fresh.report()==old, ('Different regenerated endpoint',i)
out={'status':'PASS_ALL_128_ENDPOINTS_IDENTICAL','k':6,'m':128,
     'precision_decimal_digits':engine.PRECISION,
     'generator_sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
(root/'coefficient-regeneration.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out))
