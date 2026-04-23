import { useMemo, useState } from 'react';
import './styles.css';
import {
  egridRegions,
  frequencies,
  platforms,
  regionModes,
  sourceLinks,
  useCases
} from './data';
import { estimateImpact, formatKg, formatWater, formatWh } from './lib/calculator';

const defaultPlatformIds = ['chatgpt', 'claude'];
const defaultUseCaseIds = ['coding', 'research'];

function App() {
  const [platformIds, setPlatformIds] = useState<string[]>(defaultPlatformIds);
  const [useCaseIds, setUseCaseIds] = useState<string[]>(defaultUseCaseIds);
  const [frequencyId, setFrequencyId] = useState<'light' | 'weekly' | 'regular' | 'daily' | 'heavy'>('weekly');
  const [regionMode, setRegionMode] = useState<'global' | 'us'>('us');
  const [regionCode, setRegionCode] = useState('US');

  const result = useMemo(
    () => estimateImpact({ platformIds, useCaseIds, frequencyId, regionMode, regionCode }),
    [platformIds, useCaseIds, frequencyId, regionMode, regionCode]
  );

  const toggle = (value: string, current: string[], set: (next: string[]) => void) => {
    set(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  return (
    <main className="shell">
      <div className="sky-orb sky-orb-left" aria-hidden="true" />
      <div className="sky-orb sky-orb-right" aria-hidden="true" />
      <div className="ripple" aria-hidden="true" />
      <section className="hero glass-panel">
        <div className="hero-copy">
          <p className="eyebrow">Green Future</p>
          <h1>AI Impact Calculator</h1>
          <p className="lede">
            Estimate the water, energy, and emissions footprint of your AI usage with a Frutiger Aero-inspired
            interface and source-backed methodology.
          </p>
          <div className="hero-badges" aria-label="Highlights">
            <span>Static GitHub Pages ready</span>
            <span>Region-aware</span>
            <span>Transparent ranges</span>
          </div>
        </div>
        <div className="score-orb" aria-live="polite">
          <div className="score-orb-label">Eco-Score</div>
          <div className="score-orb-value">{result.score}</div>
          <div className="score-orb-caption">100 = low impact, 0 = severe impact</div>
        </div>
      </section>

      <section className="layout">
        <div className="stack">
          <section className="glass-panel card">
            <div className="card-header">
              <h2>1. Platforms</h2>
              <p>Choose the major AI tools you use.</p>
            </div>
            <div className="grid pills">
              {platforms.map((platform) => (
                <label key={platform.id} className="pill">
                  <input
                    type="checkbox"
                    checked={platformIds.includes(platform.id)}
                    onChange={() => toggle(platform.id, platformIds, setPlatformIds)}
                  />
                  <span>
                    <strong>{platform.label}</strong>
                    <small>{platform.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="glass-panel card">
            <div className="card-header">
              <h2>2. Use cases</h2>
              <p>Tell us what you primarily use AI for.</p>
            </div>
            <div className="grid pills">
              {useCases.map((useCase) => (
                <label key={useCase.id} className="pill">
                  <input
                    type="checkbox"
                    checked={useCaseIds.includes(useCase.id)}
                    onChange={() => toggle(useCase.id, useCaseIds, setUseCaseIds)}
                  />
                  <span>
                    <strong>{useCase.label}</strong>
                    <small>{useCase.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="glass-panel card">
            <div className="card-header">
              <h2>3. Frequency</h2>
              <p>Pick the closest monthly usage bucket.</p>
            </div>
            <div className="frequency-list">
              {frequencies.map((frequency) => (
                <label key={frequency.id} className={`frequency-option ${frequencyId === frequency.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequencyId === frequency.id}
                    onChange={() => setFrequencyId(frequency.id)}
                  />
                  <span>
                    <strong>{frequency.label}</strong>
                    <small>{frequency.description}</small>
                  </span>
                  <em>{frequency.monthlySessions} sessions / month</em>
                </label>
              ))}
            </div>
          </section>

          <section className="glass-panel card">
            <div className="card-header">
              <h2>4. Region</h2>
              <p>Emissions use EPA eGRID when you pick a U.S. region.</p>
            </div>
            <div className="region-switch">
              {regionModes.map((mode) => (
                <label key={mode.id} className={`toggle-card ${regionMode === mode.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="region-mode"
                    checked={regionMode === mode.id}
                    onChange={() => setRegionMode(mode.id)}
                  />
                  <span>
                    <strong>{mode.label}</strong>
                    <small>{mode.description}</small>
                  </span>
                </label>
              ))}
            </div>
            {regionMode === 'us' && (
              <div className="field">
                <label htmlFor="region-code">eGRID subregion</label>
                <select id="region-code" value={regionCode} onChange={(event) => setRegionCode(event.target.value)}>
                  {egridRegions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>
        </div>

        <aside className="results stack">
          <section className="glass-panel result-panel">
            <div className="card-header">
              <h2>Your estimated impact</h2>
              <p>Monthly estimates with conservative uncertainty bands.</p>
            </div>
            <div className="metric-grid">
              <article className="metric">
                <span>Water</span>
                <strong>{formatWater(result.waterMl)}</strong>
                <small>
                  {formatWater(result.low.waterMl)} to {formatWater(result.high.waterMl)} per month
                </small>
              </article>
              <article className="metric">
                <span>Energy</span>
                <strong>{formatWh(result.energyWh)}</strong>
                <small>
                  {formatWh(result.low.energyWh)} to {formatWh(result.high.energyWh)} per month
                </small>
              </article>
              <article className="metric">
                <span>Emissions</span>
                <strong>{formatKg(result.emissionsKg)}</strong>
                <small>
                  {formatKg(result.low.emissionsKg)} to {formatKg(result.high.emissionsKg)} per month
                </small>
              </article>
            </div>
            <div className="summary-chip">
              {result.monthlySessions.toFixed(0)} weighted sessions / month
            </div>
          </section>

          <section className="glass-panel card">
            <div className="card-header">
              <h2>Why this score?</h2>
              <p>Eco-Score is a heuristic, not a certification.</p>
            </div>
            <ul className="notes">
              {result.notes.slice(0, 6).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <section className="glass-panel card">
            <div className="card-header">
              <h2>Methodology and sources</h2>
              <p>Numbers are directionally grounded in public literature.</p>
            </div>
            <ul className="source-list">
              {sourceLinks.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="methodology">
              This calculator uses weighted workload buckets, platform fit, and EPA eGRID regional electricity
              factors to estimate water, energy, and emissions. It intentionally shows ranges because public AI
              infrastructure telemetry is incomplete and varies by model, region, and workload.
            </p>
          </section>

          <section className="glass-panel card">
            <div className="card-header">
              <h2>Bottom line</h2>
            </div>
            <p className="bottom-line">
              AI can be useful, but it also depends on electricity, cooling water, and hardware-heavy data centers.
              Choosing lighter workloads, fewer generations, efficient models, and cleaner electricity can lower the
              footprint without giving up the benefits.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}

export default App;
