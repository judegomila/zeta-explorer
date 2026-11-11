"""Replay the third-gate proof components from fresh theta moment enclosures.

Diagnostic samples are intentionally outside this runner. The standalone
component entry points also recompute their proof inputs by default.
"""
from pathlib import Path
import importlib.metadata
import json
import platform
import sys
import time

if not __debug__:
    raise SystemExit('Run verification without python -O; assertions are proof gates.')

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

import theta_iterated_compensation_20261111 as compensation
import theta_third_source_criterion_20261111 as criterion
import theta_third_source_algebra_20261111 as source_algebra
import theta_third_origin_20261111 as origin
import theta_third_source_origin_20261111 as source_origin
import theta_third_source_origin_tail_20261111 as source_tail
import theta_signed_source_span_20261111 as signed_span
from theta_second_origin_20261111 import certify_compact as fresh_moments


def main():
    started = time.monotonic()
    gates = {}

    def gate(name, callback):
        beginning = time.monotonic()
        result = callback()
        if result.get('status') != 'passed' and result.get('passed') is not True:
            raise AssertionError((name, result))
        gates[name] = result
        print(json.dumps({'gate': name, 'status': 'passed',
                          'seconds': round(time.monotonic()-beginning, 3)}), flush=True)
        return result

    versions = {name: importlib.metadata.version(name)
                for name in ('sympy', 'python-flint', 'mpmath')}
    required = {'sympy': '1.14.0', 'python-flint': '0.9.0', 'mpmath': '1.3.0'}
    if versions != required:
        raise RuntimeError({'installed': versions, 'required': required})

    comp_exact = gate('all_order_compensation_identities', compensation.run_checks)
    crit_exact = gate('one_anchor_source_criterion', criterion.run)
    src_exact = gate('next_source_algebra_and_obstruction', source_algebra.exact_checks)
    org_exact = gate('third_origin_algebra', origin.exact_checks)
    src_org_exact = gate('source_origin_algebra', source_origin.exact_checks)
    span_exact = gate('signed_source_span_algebra', signed_span.exact_checks)

    # These are newly calculated Arb objects, never loaded from a replay file.
    beginning = time.monotonic()
    prior_summary, actual_models = fresh_moments(return_models=True)
    if prior_summary.get('status') != 'passed':
        raise AssertionError(prior_summary)
    gates['fresh_moments_and_fixed_second_origin'] = prior_summary
    print(json.dumps({'gate': 'fresh_moments_and_fixed_second_origin',
                      'status': 'passed', 'fresh_moment_coefficients': 602,
                      'seconds': round(time.monotonic()-beginning, 3)}), flush=True)

    org_compact = gate('third_origin_compact',
                       lambda: origin.certify_compact(prior_models=(prior_summary, actual_models)))
    src_org_compact = gate('next_source_origin_compact',
                           lambda: source_origin.certify_compact(
                               models=actual_models, prior_summary=prior_summary))

    # The compact gates use 384-bit models. Both following tail routines set
    # their own 256-bit precision, so they must run after the compact gates.
    org_tail = gate('third_origin_infinite_tail',
                    lambda: origin.certify_tail(replay_twelfth=True))
    src_org_tail = gate('next_source_origin_infinite_tail',
                        source_tail.certify)
    span_points = gate('signed_source_span_three_point_certificate', signed_span.certify)

    records = {
        'theta_iterated_compensation_replay_20261111.json': comp_exact,
        'theta_third_source_criterion_replay_20261111.json': crit_exact,
        'theta_third_source_exact_replay_20261111.json': src_exact,
        'theta_third_origin_replay_20261111.json': {
            'exact': org_exact, 'compact': org_compact, 'tail': org_tail},
        'theta_third_source_origin_replay_20261111.json': {
            'exact': src_org_exact, 'compact': src_org_compact},
        'theta_third_source_origin_tail_replay_20261111.json': src_org_tail,
        'theta_third_prior_origin_replay_20261111.json': prior_summary,
        'theta_signed_source_span_replay_20261111.json': {
            'exact': span_exact, 'certificate': span_points},
    }
    for name, record in records.items():
        (ROOT/name).write_text(json.dumps(record, indent=2, sort_keys=True)+'\n')

    exact_count = (comp_exact['checks'] + crit_exact['check_count']
                   + src_exact['exact_checks'] + org_exact['exact_checks']
                   + src_org_exact['exact_checks'] + span_exact['exact_checks'])
    result = {
        'status': 'passed', 'python': platform.python_version(),
        'packages': versions, 'seconds': round(time.monotonic()-started, 3),
        'new_exact_symbolic_checks': exact_count,
        'third_origin_tail_exact_rational_checks': org_tail['exact_check_count'],
        'source_origin_tail_assertions': src_org_tail['exact_and_bound_assertion_count'],
        'new_compact_anchor_cells': org_compact['cells'] + src_org_compact['cells'],
        'new_spatial_derivative_cells': src_org_tail['global_fourteenth_certificate']['cells'],
        'new_tail_coefficient_interval_checks': src_org_tail['anchor_tail_cells'],
        'replayed_fixed_interval_cells': 2048 + 4096,
        'fresh_shared_moment_coefficients': len(actual_models['raw_moment_coefficients']),
        'independent_extra_origin_moments': 2,
        'rigorous_source_span_point_witnesses': span_points['point_count'],
        'gates': gates,
        'scope': ('Third-origin and both next-source origin signs for every positive anchor tuple; '
                  'all-order auxiliary-kernel theorem and exact source-gate reduction. '
                  'Global positive-spatial source signs, P6, and RH remain unproved.'),
    }
    (ROOT/'checks_replay.json').write_text(json.dumps(result, indent=2, sort_keys=True)+'\n')
    print(json.dumps({k: v for k, v in result.items() if k != 'gates'}, indent=2), flush=True)


if __name__ == '__main__':
    main()
