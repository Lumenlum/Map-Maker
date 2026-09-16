import { useState } from 'react'
import { themes, type ThemeId } from './theme'

const roadmap = [
  ['v0.1.0', 'Foundation', 'App shell, themes, and development setup'],
  ['v0.2.0', 'Map viewer', 'Upload maps, pan, zoom, and open projects'],
  ['v0.3.0', 'Markers', 'Categorized locations, notes, images, and history'],
]

export function App() {
  const [theme, setTheme] = useState<ThemeId>('blue')
  const [dark, setDark] = useState(true)

  const accent = themes.find((item) => item.id === theme)?.color ?? '#54a0ff'

  return (
    <main
      className={dark ? 'app dark' : 'app light'}
      style={{ '--accent': accent } as React.CSSProperties}
    >
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Map Maker home">
          <span className="brand-mark">✦</span>
          <span>Map Maker</span>
        </a>
        <div className="nav-actions">
          <button
            className="icon-button"
            onClick={() => setDark((value) => !value)}
            aria-label="Toggle color mode"
          >
            {dark ? '☼' : '☾'}
          </button>
          <button className="avatar" aria-label="Account menu">
            LP
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow">GAME MAP WORKSPACE</div>
        <h1>
          Build the map
          <br />
          <span>you wish you had.</span>
        </h1>
        <p className="hero-copy">
          Bring your favorite game maps together, mark every important location,
          and share a living guide with your community.
        </p>
        <div className="hero-actions">
          <button className="primary-button">
            Create a map <span>→</span>
          </button>
          <button className="secondary-button">Explore examples</button>
        </div>
      </section>

      <section className="workspace-card" aria-labelledby="workspace-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">YOUR WORKSPACE</div>
            <h2 id="workspace-title">A clear starting point</h2>
          </div>
          <span className="status-pill">
            <span className="status-dot" /> v0.1.0 foundation
          </span>
        </div>
        <div className="workspace-grid">
          <div className="empty-map">
            <div className="map-grid" />
            <div className="map-placeholder">
              <span className="upload-icon">＋</span>
              <strong>Upload a map image</strong>
              <small>Your map becomes the canvas for everything you add.</small>
            </div>
          </div>
          <aside className="theme-panel">
            <div className="panel-label">ACCENT THEME</div>
            <p>Choose a preset now. Every marker and control will follow it.</p>
            <div
              className="swatches"
              role="radiogroup"
              aria-label="Accent themes"
            >
              {themes.map((item) => (
                <button
                  key={item.id}
                  className={`swatch ${theme === item.id ? 'selected' : ''}`}
                  style={{ background: item.color }}
                  onClick={() => setTheme(item.id)}
                  aria-label={item.name}
                  aria-pressed={theme === item.id}
                />
              ))}
            </div>
            <div className="theme-name">
              <span style={{ background: accent }} />{' '}
              {themes.find((item) => item.id === theme)?.name}{' '}
              <span className="variant">{dark ? 'Dark' : 'Light'}</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="roadmap" aria-labelledby="roadmap-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ON THE HORIZON</div>
            <h2 id="roadmap-title">From blank canvas to living world</h2>
          </div>
          <span className="muted">Roadmap</span>
        </div>
        <div className="roadmap-list">
          {roadmap.map(([version, title, description]) => (
            <div className="roadmap-row" key={version}>
              <span className="version">{version}</span>
              <strong>{title}</strong>
              <span className="description">{description}</span>
              <span className="arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span>Map Maker</span>
        <span>Make the world yours.</span>
      </footer>
    </main>
  )
}
