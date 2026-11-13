# zeta-view — Zeta Observatory

A dedicated mathematical geometry workbench for the Riemann zeta function, with private source at [judegomila/zeta-view](https://github.com/judegomila/zeta-view).

The app is self-contained and runs on any static HTTP(S) host. Vercel serves the checked-in `dist/` directory using `vercel.json`; no ChatGPT runtime, API key, database, installation, or build step is required. The application keeps the Zeta Observatory name.

See [the development roadmap](docs/ROADMAP.md) for the projective, bridge/Bloch, shear, complex heat-zero, and Pick/Schur views discussed for the next releases. These are proposed extensions, not features of this migration.

## Features

- Euler–Maclaurin analytic continuation of ζ, completed ξ, and the actual theta-integral de Bruijn–Newman family.
- Complex phase, modulus, real/imaginary sign, and normalized bridge balance; logarithmic or signed height surfaces.
- Plane, inverse stereographic sphere, and the exact elliptic double cover from Math Explorer PRs 43 and 49.
- Critical line/two ovals, reference zero markers, limited sampled heat roots, Re/Im contours and transported phase-gradient streamlines.
- Surface-conforming conjugate-aligned twin ladders and finite prime-power packet experiments with independent display time.
- A freshly evaluated point inspector, sampled contour winding, critical-line profile and linked phase atlas.
- Exact numerical fields reused from a bounded memory cache, best-effort IndexedDB storage, and an on-demand starter pack.
- Fully buffered heat playback with 9, 17, or 33 independently evaluated frames, frame scrubbing, explicit forward/reverse direction, and a common locked height reference.
- Saved browser-local viewpoints and observations, portable session JSON including camera, numerical grid CSV with raw and log-polar values, PNG snapshots and URL-encoded views.
- GPU rendering plus an automatic Canvas2D 3D fallback using the same mathematical mesh.

## Run locally

This is a buildless static app. All runtime dependencies are included in `dist/`.

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. The module worker requires HTTP(S); opening `index.html` directly as a file will not work.

```sh
npm test
```

## Continue development and deploy

```sh
git clone https://github.com/judegomila/zeta-view.git
cd zeta-view
python3 -m http.server 8080 --directory dist
```

Edit the source modules directly in `dist/`. They are the maintained application source, not disposable build output. Run `npm test` after numerical or rendering changes. The checked-in runtime dependencies make both serving and the Node.js test suite usable without an install step. The optional Python reference generators require `mpmath`.

Vercel configuration is in `vercel.json` (Other framework, output `dist`, no install or build command). Connect the private repository with `main` as the production branch. GitHub source privacy and Vercel deployment access are separate settings; maintain the intended deployment protection when changing hosts.

The browser's saved views, notes, and computed cache belong to the current origin. To move an existing notebook, export its session JSON from the old host and import it on the new host. Computed caches populate independently; the shipped precache assets move with the repository.

### Migration provenance

This source was recovered from the published Zeta Observatory revision `71c6986e47516b27b51cb5b167f499addea2a6d4`. The migration preserves the numerical engine, renderer, 4:3 viewport, precache assets, reference fixtures, and existing tests. Hosting-specific Sites metadata is excluded from the new deployment.

## Computed views and heat playback

The field loader checks memory, IndexedDB, and the shipped numerical pack before starting a numerical worker. The cache uses exact numerical keys, including the engine version, selected function and heat parameter, chart and spectral bounds, sampling density, computed extent, and requested numerical overlays. Camera position, phase rotation, opacity, and other display settings reuse the same field. A numerical or sampler change requires a new `FIELD_CACHE_VERSION`.

The memory cache has a **128 MiB** budget. IndexedDB has a **256 MiB** configured budget, reduced when the browser reports limited available storage. Both evict the least recently used fields. Persistence is best effort: unavailable storage or quota pressure falls back to memory and fresh computation. **Clear cache** removes computed views and the active clip while keeping saved viewpoints, notes, and exported sessions separate.

The starter pack contains **78 independently computed fields exposed through 155 exact keys**, with shared geometry and optional ladder-overlay aliases. Its **59.32 MB** of compressed assets are loaded on demand; this is the complete pack size, not a compulsory initial download. It includes ζ and ξ on all three default mounts, several research presets, and 17 heat frames at τ = −0.30, −0.25, …, 0.50 for the default plane, sphere, torus, and narrower heat-preset plane window. Those are Standard-density samples from the same numerical engine as a custom worker calculation. Caching changes when the work happens; it does not improve the precision or mathematical accuracy of a field.

In **Cache & playback**, choose the heat range, 9/17/33 exact frames, and **Responsive**, **Standard**, or **Current mesh density**. **Prepare heat frames** loads or computes every frame before the sequence is ready. **Play** performs the same preparation automatically if needed. The active clip has a separate **192 MiB** memory limit; an oversized request asks for fewer frames or Responsive density instead of silently reducing the chosen density. Custom ranges and denser sequences compute any frames that are absent from the cache. **Precache modes** prepares the nine chart/function combinations for the current numerical settings.

Once playback starts, each heat step reads only its buffered field: the surface values, critical traces, landmark values, root markers, requested overlay curves, and 361-point critical-line inset are already present. There is no interpolation between heat times and no ζ, ξ, or heat-kernel evaluation or field loading in the playback step. The sequence traverses the prepared range forward and then reverse, with the direction and actual τ displayed. Frame scrubbing selects an existing frame. Preparation locks a common height reference; keep that lock enabled when comparing amplitudes across the sequence.

Rendering still takes work on every frame. The Canvas fallback uses a smaller motion mesh and restores stationary detail when playback and other motion pause. This affects the drawn triangles, not the stored numerical samples. The requested playback rate remains subject to the device's rendering speed.

Live point and derivative inspection is held during playback. **Inspect** pauses the sequence and evaluates the chosen coordinate afresh; ordinary Pause also resumes point inspection. Scrubbing leaves the inspector held until inspection is requested. The finite prime-power packet panel has its own clock and continues evaluating its small, explicit finite sum while enabled. It is separate from buffered heat evolution.

### Rebuild the shipped pack

```sh
node scripts/build-precache.mjs
```

The script uses the shared sampler, writes `dist/precache/manifest.json`, and stores lossless binary frames compressed with gzip. Shared mesh files avoid repeating geometry at every heat time. The codec preserves typed-array bytes, nonfinite puncture coordinates, and signed zero. The browser decodes supported compressed assets and otherwise falls back to the numerical worker. Existing entries with the current engine/codec version can be reused when rebuilding; bump the numerical version after changing numerical or sampling behavior.

For a smaller development build, use `--base-only` or `--without-heat-preset`. `--out <directory>` selects another output directory. Tests cover codec round trips, exact manifest keys, independent frame values, the worker sampler, cache behavior, and buffered sequence preparation.

## Numerical scope

The extended operating window is −128 ≤ Re(s) ≤ 129, |Im(s)| ≤ 2,000 and |τ| ≤ 1. An Original window control retains the previous −12 ≤ Re(s) ≤ 13, |Im(s)| ≤ 120 domain for comparison. Log-polar evaluation preserves phase and magnitude information across raw floating-point overflow/underflow. Curved meshes cluster samples near infinity; the critical guides continue as exact base geometry independently of the function mask. The initial UI heat dial uses −0.3 ≤ τ ≤ 0.5. Independent high-precision reference checks, including expanded-domain log-polar checks, and their error definitions are in `dist/numerics.json`. They are finite numerical validation, not uniform error certificates. There is no prescribed zero placement in the evaluator.

Height normalization, chart lenses, masking, interpolation, finite root coverage, and the distinction between prime packets and zeta heat flow are documented in the in-app `methods.html` reference. This software does not establish RH or global positivity.

## Source map

| File | Purpose |
| --- | --- |
| `dist/math.js` | Raw/log-polar values, analytic derivatives, theta integration and extended Gaussian heat convolution |
| `dist/domain.js` | Shared finite computation bounds and core/extended controls |
| `dist/elliptic.js` | Jacobi uniformization, deck exchange, both inverse lifts and landmarks |
| `dist/geometry.js` | Exact charts, complete critical guides and clustered mesh axes |
| `dist/sampler.js` | Shared pure mesh sampler, finite bridge comparisons, flow curves, markers and critical-line inset |
| `dist/sample-worker.js` | Browser worker wrapper and transferable buffers |
| `dist/critical-samples.js` | Numerical critical traces and landmark values prepared with each frame |
| `dist/field-cache.js` | Exact versioned keys, bounded memory cache and best-effort IndexedDB LRU cache |
| `dist/field-service.js` | Memory → saved cache → shipped frames → worker loading, plus shared mesh reuse |
| `dist/playback.js` | Exact heat sequence plans, complete preparation, cancellation and active-clip memory limit |
| `dist/cache-codec.js` | Lossless binary frame encoder and decoder |
| `dist/precache/manifest.json` | On-demand numerical assets and exact settings for each shipped frame |
| `scripts/build-precache.mjs` | Reproducible offline starter-pack generation |
| `dist/renderer.js` | Three.js GPU renderer |
| `dist/canvas-renderer.js` | Software 3D fallback |
| `dist/app.js` | Research controls, probes, winding, storage and export |
| `tests/` | Independent reference fixtures and mathematical integration checks |

Three.js 0.180.0 is vendored with its MIT license. No external scripts, web fonts, analytics or back-end data services are required at runtime. The on-demand frame files are part of this static app. Saved notebooks use the current browser's local storage; computed fields use their separate cache. Export session JSON for a portable copy of a viewpoint and its notes.
