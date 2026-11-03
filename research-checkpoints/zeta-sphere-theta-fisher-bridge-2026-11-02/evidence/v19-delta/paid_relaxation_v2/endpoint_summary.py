"""Own-source endpoint replay plus completed author budget; no new unproved estimates."""
import sys,json
from pathlib import Path
root=Path(__file__).parent
sys.argv=['certify_n2.py','60000','1000']
exec((root/'certify_n2.py').read_text().split('budget=arb(0);rows=[]')[0])
A,b,d=moments(feats(arb(1)));S=d-b*b/A
budget=arb(json.loads((root/'certify_n2_final.json').read_text())['budget_unscaled'])
paid=S-budget
out=dict(terminal_lower=str(S.lower()),terminal_upper=str(S.upper()),budget_upper=str(budget.upper()),paid_lower_unscaled=str(paid.lower()),paid_lower_with_pi_over_2=str((paid*pi/2).lower()),PASS=bool(paid>0))
print(json.dumps(out,indent=2));assert paid>0
