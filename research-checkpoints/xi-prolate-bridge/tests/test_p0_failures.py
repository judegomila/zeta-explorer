import sys, unittest
from pathlib import Path
import mpmath as mp
ROOT=Path(__file__).resolve().parents[1]; sys.path.insert(0,str(ROOT/'src'))
from weil_matrix import (
    decimal_square_ceil,
    decimal_square_floor,
    parse_decimal,
    require_source_normalization,
    von_mangoldt_terms,
)
from prolate_state import completed_xi, hermite_limit_h, locked_limit_transform

class P0FailureTests(unittest.TestCase):
    def test_binary64_parameter_rejected(self):
        with self.assertRaises(TypeError): parse_decimal(2.0)

    def test_exact_decimal_cutoff_does_not_round_across_integer_square(self):
        below="1.9999999999999999999999999999999999999999"
        above="2.0000000000000000000000000000000000000001"
        self.assertEqual(decimal_square_floor(below),3)
        self.assertEqual(decimal_square_floor("2.0"),4)
        self.assertEqual(decimal_square_floor(above),4)
        self.assertEqual(decimal_square_ceil(below),4)
        self.assertEqual(decimal_square_ceil(above),5)
    def test_all_prime_powers_through_lambda_squared(self):
        self.assertEqual([n for n,_ in von_mangoldt_terms(16)], [2,3,4,5,7,8,9,11,13,16])
    def test_lambda_not_confused_with_lambda_squared(self):
        self.assertIn(9,[n for n,_ in von_mangoldt_terms(9)])
    def test_unit_norm_prolate_normalization_rejected(self):
        with self.assertRaises(ValueError): require_source_normalization('unit_norm')
    def test_only_source_limit_normalization_accepted(self):
        require_source_normalization('source_limit_h')
    def test_source_h4_normalization_reconstructs_h_exactly(self):
        mp.mp.dps=50
        h0=lambda x: mp.power(2,mp.mpf(1)/4)*mp.exp(-mp.pi*x*x)
        h4=lambda x: (16*mp.pi**2*x**4-24*mp.pi*x*x+3)*mp.exp(-mp.pi*x*x)/(mp.power(2,mp.mpf(5)/4)*mp.sqrt(3))
        a4=mp.sqrt(3)/mp.power(2,mp.mpf(11)/4)
        a0=3/mp.power(2,mp.mpf(17)/4)
        for text in ('0','0.125','0.5','1.25'):
            x=mp.mpf(text)
            self.assertLess(abs(a4*h4(x)-a0*h0(x)-hermite_limit_h(x)),mp.mpf('1e-45'))
    def test_locked_source_transform_has_factor_four_discrepancy(self):
        mp.mp.dps=50
        for text in ('0','1.25','3.5'):
            z=mp.mpf(text)
            expected=completed_xi(mp.mpf('0.5')+1j*z)
            self.assertLess(abs(4*locked_limit_transform(z)-expected),mp.mpf('1e-45'))
            self.assertGreater(abs(locked_limit_transform(z)-expected),mp.mpf('1e-6'))
    def test_unit_norm_changes_exact_limiting_scalar(self):
        mp.mp.dps=50
        source_norm=mp.sqrt(33)/mp.power(2,mp.mpf(17)/4)
        unit_scalar=1/source_norm
        self.assertGreater(abs(unit_scalar-1),mp.mpf('1'))
        self.assertLess(abs(source_norm*unit_scalar-1),mp.mpf('1e-48'))

if __name__=='__main__': unittest.main()
