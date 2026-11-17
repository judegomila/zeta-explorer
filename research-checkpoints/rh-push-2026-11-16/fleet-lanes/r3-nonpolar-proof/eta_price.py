"""Abscissa of the bypass-78 comparison LP as a function of the TRO6 saving eta (MODEL values).
Reuses bypass-78/price_list.py unchanged (Gram exponent b/12 -> (1-eta) b/12)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bypass-78"))
from price_list import run, make_low
b0 = run("eta=0")
for eta in (0.001, 0.005, 0.01, 0.0219, 0.05, 0.1, 0.2):
    b = run(f"eta={eta}", make_low(eta=eta))
    print(f"   gain {b0-b:.3e}   gain/eta {(b0-b)/eta:.5f}")
