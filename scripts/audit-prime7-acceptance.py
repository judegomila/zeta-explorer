"""Exercise the actual acceptance routine and fail-closed CLI controls."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from flint import arb, arb_mat, ctx


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    checker = Path(__file__).with_name('certify-prime7-extension.py')
    spec = importlib.util.spec_from_file_location('prime7_checker', checker)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    ctx.prec = 256
    # Hilbert matrix: the Gram matrix of 1,x,...,x^15 in L^2(0,1).
    H = arb_mat([[arb(1)/(i+j+1) for j in range(16)] for i in range(16)])
    margin = module.preconditioned_positive(H)
    assert margin > arb('0.99')
    checks = ['positive ill-conditioned Hilbert-16 Gram matrix accepted']
    for name,A in [
        ('indefinite matrix rejected', arb_mat([[1,2],[2,1]])),
        ('positive midpoint with sign-uncertain input rejected', arb_mat([[1,0],[0,arb('1 +/- 2')]]))
    ]:
        try:
            module.preconditioned_positive(A)
        except ArithmeticError:
            checks.append(name)
        else:
            raise AssertionError(name)
    with tempfile.TemporaryDirectory() as directory:
        for name,flags,expected in [
            ('invalid baseline floor', ['--floor','11/10'], 'full baseline positivity'),
            ('missing prime 7', ['--width','1.94'], 'exactly the prime powers'),
            ('unimplemented prime power 8', ['--width','2.1'], 'exactly the prime powers')
        ]:
            output = Path(directory)/'must-not-exist.json'
            result = subprocess.run([sys.executable,str(checker),*flags,'--output',str(output)],
                                    capture_output=True,text=True)
            assert result.returncode != 0 and expected in result.stderr
            assert 'Quadrature panels' not in result.stderr and not output.exists()
            checks.append(name+' rejected before quadrature, no receipt emitted')
    result = {'status':'passed', 'scope':'acceptance and rejection controls; not a Weil certificate',
              'precision_bits':ctx.prec, 'checks':checks,
              'hilbert16_congruence_margin_lower':str(margin),
              'checker_sha256':hashlib.sha256(checker.read_bytes()).hexdigest(),
              'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    payload = json.dumps(result,indent=2)+'\n'
    if args.output: Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
