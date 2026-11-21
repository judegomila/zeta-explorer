/**
 * Exact quadratic collision and parity-energy models for the sign-switching page.
 *
 * These formulas are NOT an evaluation of xi and do not prove RH. The bridge
 * weight is on the HALF-LINE r >= 0. Its h=a endpoint is a point mass, never an
 * ordinary density. This module has no browser, React, or external dependencies.
 */

export const SIGN_SWITCHING_PROVENANCE = Object.freeze({
  scope: 'Exact local quadratic model; not the Riemann xi function.',
  collision: 'F_epsilon(w)=w^2+2epsilon, w=x+iy; W=Re(F_prime*conjugate(F)).',
  kernel: 'f_epsilon(z)=z^2-2epsilon; P_h(z,w)=2z*conjugate(w)+2h^2+4epsilon.',
  bridgeDomain: 'Half-line r>=0, a>0, 0<=h<a; h=a is delta_0.',
  boundaryPositivity: 'P_a is positive semidefinite exactly when epsilon>=-a^2/2.',
  numericalScope: 'Simpson values are finite quadrature diagnostics, not interval certificates.',
  rhStatus: 'No claim of RH, global xi positivity, or a topological exclusion theorem.',
});

function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  return value;
}

function result(value, name) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} is not finite at the supplied parameters.`);
  }
  return value;
}

function positive(value, name) {
  finite(value, name);
  if (!(value > 0)) throw new RangeError(`${name} must be positive.`);
  return value;
}

function complex(value, name) {
  if (typeof value === 'number') return { re: finite(value, name), im: 0 };
  if (!value || typeof value !== 'object') {
    throw new TypeError(`${name} must be a number or {re, im}.`);
  }
  return { re: finite(value.re, `${name}.re`), im: finite(value.im, `${name}.im`) };
}

function bridgeParameters(a, h) {
  positive(a, 'a');
  finite(h, 'h');
  if (h < 0 || h > a) throw new RangeError('The bridge requires 0 <= h <= a.');
}

export function collisionF(x, y, epsilon) {
  finite(x, 'x'); finite(y, 'y'); finite(epsilon, 'epsilon');
  return {
    re: result(x * x - y * y + 2 * epsilon, 'Re(F)'),
    im: result(2 * x * y, 'Im(F)'),
  };
}

/** The continuous extension of W/x, including the entire line x=0. */
export function collisionWOverX(x, y, epsilon) {
  finite(x, 'x'); finite(y, 'y'); finite(epsilon, 'epsilon');
  if (epsilon < 0) {
    // Factor at the plotted circle, preserving zero on its computed radius
    // instead of subtracting two almost equal squared numbers.
    const radius = Math.sqrt(result(-2 * epsilon, 'radius squared'));
    const radial = result(Math.hypot(x, y), 'radial coordinate');
    return result(2 * (radial - radius) * (radial + radius), 'W/x');
  }
  return result(2 * (x * x + y * y + 2 * epsilon), 'W/x');
}

export function collisionW(x, y, epsilon) {
  return result(x * collisionWOverX(x, y, epsilon), 'W');
}

export function collisionL1(y, epsilon) {
  finite(y, 'y'); finite(epsilon, 'epsilon');
  if (epsilon < 0) {
    const radius = Math.sqrt(result(-2 * epsilon, 'radius squared'));
    return result(4 * (y - radius) * (y + radius), 'L1');
  }
  return result(4 * y * y + 8 * epsilon, 'L1');
}

/** Unique roots with multiplicity; at epsilon=0 the origin has multiplicity 2. */
export function collisionRoots(epsilon) {
  finite(epsilon, 'epsilon');
  if (epsilon === 0) return [{ x: 0, y: 0, multiplicity: 2 }];
  const radius = result(Math.sqrt(result(2 * Math.abs(epsilon), 'root radius squared')), 'root radius');
  return epsilon < 0
    ? [{ x: -radius, y: 0, multiplicity: 1 }, { x: radius, y: 0, multiplicity: 1 }]
    : [{ x: 0, y: -radius, multiplicity: 1 }, { x: 0, y: radius, multiplicity: 1 }];
}

/** The OPEN negative half-disk x>0, x^2+y^2<-2epsilon. */
export function negativeHalfDisk(epsilon) {
  finite(epsilon, 'epsilon');
  const radius = epsilon < 0 ? Math.sqrt(result(-2 * epsilon, 'radius squared')) : 0;
  return {
    exists: epsilon < 0,
    radius,
    boundaryIncluded: false,
    diameter: epsilon < 0 ? { min: -radius, max: radius, open: true } : null,
  };
}

export function inNegativeHalfDisk(x, y, epsilon) {
  finite(x, 'x'); finite(y, 'y'); finite(epsilon, 'epsilon');
  return epsilon < 0 && x > 0
    && result(Math.hypot(x, y), 'radial coordinate') < Math.sqrt(result(-2 * epsilon, 'radius squared'));
}

export function collisionState(epsilon) {
  const region = negativeHalfDisk(epsilon);
  return {
    epsilon,
    radius: region.radius,
    roots: collisionRoots(epsilon),
    negativeInterval: region.diameter,
    negativeHalfDisk: region,
    phase: epsilon < 0 ? 'off-axis pair' : epsilon > 0 ? 'axis pair' : 'double contact',
  };
}

// Page-friendly parameter order. localShear is W; continuousShear is W/x.
export const localShear = (epsilon, x, y) => collisionW(x, y, epsilon);
export const continuousShear = (epsilon, x, y) => collisionWOverX(x, y, epsilon);
export const firstModal = (epsilon, y) => collisionL1(y, epsilon);

export function polynomialKernel(z, w, h, epsilon) {
  const left = complex(z, 'z');
  const right = complex(w, 'w');
  finite(h, 'h'); finite(epsilon, 'epsilon');
  return {
    re: result(2 * (left.re * right.re + left.im * right.im) + 2 * h * h + 4 * epsilon, 'Re(P)'),
    im: result(2 * (left.im * right.re - left.re * right.im), 'Im(P)'),
  };
}

export function boundaryKernelStatus(a, epsilon) {
  positive(a, 'a'); finite(epsilon, 'epsilon');
  const threshold = result(-a * a / 2, 'boundary threshold');
  const constant = result(2 * a * a + 4 * epsilon, 'boundary constant');
  return {
    positiveSemidefinite: epsilon >= threshold,
    threshold,
    constant,
    condition: 'epsilon >= -a^2/2',
  };
}

/** No absolute values or clipping: signed inputs retain their signs. */
export function normalizedSignedMargin(even, odd) {
  finite(even, 'even energy'); finite(odd, 'odd energy');
  const sum = result(even + odd, 'total energy');
  if (!(sum > 0)) throw new RangeError('A normalized margin requires positive total energy.');
  return result((even - odd) / sum, 'normalized margin');
}

/**
 * Norms of (K_{t-r} +/- K_{t+r})/2 from their Gram entries.
 * A non-PSD supplied kernel can yield negative values; they are not repaired.
 */
export function parityEnergiesFromKernel(diagonalMinus, diagonalPlus, cross) {
  const minus = complex(diagonalMinus, 'diagonalMinus');
  const plus = complex(diagonalPlus, 'diagonalPlus');
  const off = complex(cross, 'cross');
  if (minus.im !== 0 || plus.im !== 0) {
    throw new RangeError('Hermitian kernel diagonal entries must be real.');
  }
  const even = result((minus.re + plus.re + 2 * off.re) / 4, 'even energy');
  const odd = result((minus.re + plus.re - 2 * off.re) / 4, 'odd energy');
  const difference = result(even - odd, 'signed energy difference');
  const sum = result(even + odd, 'total energy');
  return {
    even, odd, difference, sum,
    margin: sum > 0 ? normalizedSignedMargin(even, odd) : null,
    nonnegativeEnergies: even >= 0 && odd >= 0,
  };
}

export function polynomialParityEnergies(t, r, a, epsilon) {
  finite(t, 't'); finite(r, 'r');
  positive(a, 'a'); finite(epsilon, 'epsilon');
  if (r < 0) throw new RangeError('r must be nonnegative on the half-line.');
  const minus = result(t - r, 't-r');
  const plus = result(t + r, 't+r');
  return parityEnergiesFromKernel(
    polynomialKernel(minus, minus, a, epsilon),
    polynomialKernel(plus, plus, a, epsilon),
    polynomialKernel(minus, plus, a, epsilon),
  );
}

/** Analytic half-line moments. At h=a these are the moments of delta_0. */
export function bridgeWeightMoments(a, h) {
  bridgeParameters(a, h);
  if (h === a) return { mass: 1, second: 0, fourth: 0 };
  const second = result((a - h) * (a + h), 'second weight moment');
  const fourth = result(second * (7 * a * a - 3 * h * h) / 3, 'fourth weight moment');
  return { mass: 1, second, fourth };
}

export function bridgeMeasure(a, h) {
  bridgeParameters(a, h);
  return h === a
    ? { kind: 'point-mass', endpoint: true, atom: 0, mass: 1, domain: 'r>=0' }
    : { kind: 'density', endpoint: false, mass: 1, domain: 'r>=0' };
}

/**
 * Half-line density, 0<=h<a:
 * pi*r*sin(pi*h/a)*sinh(pi*r/a) /
 *   [a*h*(cosh(pi*r/a)+cos(pi*h/a))^2].
 * At h=0 its removable limit is
 * pi^2*r/(2a^2) * sech^2(pi*r/(2a)) * tanh(pi*r/(2a)).
 *
 * expm1 and a log evaluation avoid cancellation near r=0, h=0 or h=a,
 * and avoid sinh/cosh overflow in the tail. Underflow to zero is permitted;
 * a nonfinite result or input is an explicit error.
 */
export function omega(a, h, r) {
  bridgeParameters(a, h); finite(r, 'r');
  if (r < 0) throw new RangeError('omega is a half-line density: r must be >= 0.');
  if (h === a) throw new RangeError('h=a is delta_0, not an ordinary omega density.');
  if (r === 0) return 0;

  const u = Math.PI * (r / a);
  // With finite positive r,a, an infinite ratio is far beyond representable
  // exponential tails; it is not a singular point of the density.
  if (u === Infinity || u === 0) return 0;
  const eta = h / a;
  const delta = (a - h) / a;
  let logSinRatio;
  if (eta === 0) {
    logSinRatio = Math.log(Math.PI);
  } else if (eta <= 0.5) {
    const angle = Math.PI * eta;
    logSinRatio = Math.log(Math.PI) + Math.log(Math.sin(angle) / angle);
  } else {
    logSinRatio = Math.log(Math.sin(Math.PI * delta)) - Math.log(eta);
  }
  const expMinus = Math.exp(-u);
  const oneMinus = -Math.expm1(-u);
  const halfAngleSin = Math.sin(Math.PI * delta / 2);
  const denominator = oneMinus * oneMinus + 4 * halfAngleSin * halfAngleSin * expMinus;
  const logDensity = Math.log(2 * Math.PI) + Math.log(r) - 2 * Math.log(a)
    + logSinRatio - u + Math.log(-Math.expm1(-2 * u)) - 2 * Math.log(denominator);
  return result(Math.exp(logDensity), 'omega');
}

/** Composite Simpson rule for equally spaced values; intervals = length-1. */
export function simpsonIntegrateSamples(values, step) {
  positive(step, 'sample step');
  if (!values || typeof values.length !== 'number' || values.length < 3 || values.length % 2 !== 1) {
    throw new RangeError('Simpson integration requires an even number of intervals (at least 2).');
  }
  let sum = 0;
  let compensation = 0;
  for (let i = 0; i < values.length; i++) {
    const weight = i === 0 || i === values.length - 1 ? 1 : i % 2 === 1 ? 4 : 2;
    const term = result(weight * finite(values[i], `sample ${i}`), 'weighted sample');
    const adjusted = term - compensation;
    const next = result(sum + adjusted, 'Simpson sum');
    compensation = (next - sum) - adjusted;
    sum = next;
  }
  return result((step / 3) * sum, 'Simpson integral');
}

export function simpsonIntegrate(fn, min, max, intervals = 2048) {
  if (typeof fn !== 'function') throw new TypeError('The integrand must be a function.');
  finite(min, 'integration minimum'); finite(max, 'integration maximum');
  if (!(max > min)) throw new RangeError('The integration maximum must exceed its minimum.');
  if (!Number.isSafeInteger(intervals) || intervals < 2 || intervals % 2 !== 0) {
    throw new RangeError('Simpson intervals must be a positive even integer of at least 2.');
  }
  const step = positive(result((max - min) / intervals, 'sample step'), 'sample step');
  const values = Array.from({ length: intervals + 1 }, (_, i) => fn(i === intervals ? max : min + i * step));
  return simpsonIntegrateSamples(values, step);
}

/** Exact polynomial bridge energies, using the analytic half-line moments. */
export function polynomialBridgeExact({ a, h, epsilon, t = 0 }) {
  const measure = bridgeMeasure(a, h);
  const moments = bridgeWeightMoments(a, h);
  const boundary = boundaryKernelStatus(a, epsilon);
  finite(t, 't');
  const even = result(2 * t * t + boundary.constant, 'integrated even energy');
  const odd = result(2 * moments.second, 'integrated odd energy');
  const difference = result(even - odd, 'signed energy difference');
  const direct = polynomialKernel(t, t, h, epsilon).re;
  const sum = result(even + odd, 'total energy');
  return {
    even, odd, difference, direct, sum,
    margin: sum > 0 ? normalizedSignedMargin(even, odd) : null,
    endpoint: measure.endpoint,
    measure: measure.kind,
    weightMass: moments.mass,
    secondWeightMoment: moments.second,
    boundaryPositiveSemidefinite: boundary.positiveSemidefinite,
    nonnegativeEnergies: even >= 0 && odd >= 0,
    identityResidual: result(difference - direct, 'identity residual'),
    scope: SIGN_SWITCHING_PROVENANCE.scope,
  };
}

export const modelEnergies = polynomialBridgeExact;
