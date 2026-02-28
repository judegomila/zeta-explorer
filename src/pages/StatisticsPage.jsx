import React from 'react';
import GUEStatisticsViz from '../components/GUEStatisticsViz.jsx';
import LiCriterionViz from '../components/LiCriterionViz.jsx';
import { BlockMath } from '../components/KaTeXMath.jsx';

export default function StatisticsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Zero Statistics & Spectral Criteria</h1>
        <p>
          The statistical distribution of zeta zeros matches the GUE universality class
          from random matrix theory. The Li criterion and de Bruijn-Newman constant provide
          equivalent formulations of RH as passivity/stability conditions.
        </p>
      </div>

      <BlockMath tex="P_{\text{GUE}}(s) = \frac{32}{\pi^2} s^2 e^{-4s^2/\pi} \quad \text{(Wigner surmise for nearest-neighbor spacing)}" />

      <div style={{ marginTop: 24 }}>
        <div className="viz-title">Random Matrix Theory: GUE Statistics</div>
        <div className="viz-subtitle">
          Compare the spacing distribution of zeta zeros with GUE, GOE, and Poisson predictions.
          The pair correlation R₂(x) = 1 - (sin πx / πx)² matches Montgomery's conjecture.
          The number variance Σ²(L) shows the characteristic logarithmic suppression of GUE.
        </div>
        <GUEStatisticsViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#ef4444' }}>GUE Universality</h3>
          <BlockMath tex="R_2(x) = 1 - \left(\frac{\sin\pi x}{\pi x}\right)^2" />
          <p style={{ marginTop: 8 }}>
            Montgomery (1973) conjectured and Odlyzko (1987) numerically verified that zeta zeros
            follow GUE statistics. In our model, GUE emerges because the oscillator coupling
            matrix (determined by prime gaps) breaks time-reversal symmetry through the PT-structure,
            selecting GUE over GOE.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#8b5cf6' }}>CUE Model</h3>
          <BlockMath tex="\zeta(1/2+it) \sim \det(I - U_N e^{i\theta})" />
          <p style={{ marginTop: 8 }}>
            Keating-Snaith (2000): ζ on the critical line behaves like the characteristic
            polynomial of a random unitary matrix from the CUE. Our bridge scattering matrix,
            truncated to N primes, IS this random unitary matrix.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="viz-title">Li Criterion & de Bruijn-Newman</div>
        <div className="viz-subtitle">
          Li's criterion: RH ⟺ all λₙ ≥ 0. The Keiper-Li asymptotic shows λₙ/n approaching
          ½log(n/2πe). The de Bruijn-Newman view shows how zeros drift under heat flow,
          with Λ ≥ 0 (Rodgers-Tao) meaning zeros are exactly at the threshold.
        </div>
        <LiCriterionViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#10b981' }}>
        <h3 style={{ color: '#10b981' }}>Circuit Interpretation of Li's Criterion</h3>
        <BlockMath tex="\lambda_n \geq 0 \iff S^\dagger S \leq I \iff \text{bridge is passive (contractive)}" />
        <p style={{ marginTop: 12 }}>
          The Li coefficients are the Schur-Cohn coefficients of the bridge transfer function.
          Their non-negativity is equivalent to the bridge scattering matrix being contractive
          (passive) — it never amplifies. Each λₙ tests passivity at the n-th angular momentum
          mode. The Keiper-Li asymptotic shows logarithmic growth, matching the zero density.
        </p>
        <div style={{ marginTop: 16, padding: 16, background: 'rgba(245,158,11,0.08)', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
          <p style={{ fontSize: 14, color: '#f59e0b' }}>
            <strong>de Bruijn-Newman (Rodgers-Tao 2020):</strong> Λ ≥ 0 means the system is exactly
            at the lossless threshold. The heat equation diffuses the zeros, and Λ = 0 means they
            are "just barely" on the critical line — the oscillator chain is tuned to exact losslessness
            with no margin to spare.
          </p>
        </div>
      </div>
    </div>
  );
}
