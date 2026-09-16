import { useRef, useState } from 'react'
import { themes, type ThemeId } from './theme'

const roadmap = [
  ['v0.1.0', 'Foundation', 'App shell, themes, and development setup'],
  ['v0.2.0', 'Map viewer', 'Upload maps, pan, zoom, and open projects'],
  ['v0.3.0', 'Markers', 'Categorized locations, notes, images, and history'],
]

export function App() {
  const [theme, setTheme] = useState<ThemeId>('blue')
  const [dark, setDark] = useState(true)
  const [title, setTitle] = useState('My new map')
  const [game, setGame] = useState('')
  const [mapImage, setMapImage] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const fileInput = useRef<HTMLInputElement>(null)
  const accent = themes.find((item) => item.id === theme)?.color ?? '#54a0ff'
  function loadMap(file?: File) {
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setMapImage(String(reader.result))
    reader.readAsDataURL(file)
  }
  return (
    <main
      className={dark ? 'app dark' : 'app light'}
      style={{ '--accent': accent } as React.CSSProperties}
    >
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="/">
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
          <button
            className="primary-button"
            onClick={() => fileInput.current?.click()}
          >
            Upload a map <span>→</span>
          </button>
          <button
            className="secondary-button"
            onClick={() => setMapImage(null)}
          >
            Start blank
          </button>
        </div>
        <input
          ref={fileInput}
          className="visually-hidden"
          type="file"
          accept="image/*"
          onChange={(event) => loadMap(event.target.files?.[0])}
        />
      </section>
      <section className="workspace-card" aria-labelledby="workspace-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">YOUR WORKSPACE</div>
            <h2 id="workspace-title">{title || 'Untitled map'}</h2>
          </div>
          <span className="status-pill">
            <span className="status-dot" /> v0.2.0 map viewer
          </span>
        </div>
        <div className="workspace-grid">
          <div
            className="map-stage"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              loadMap(event.dataTransfer.files[0])
            }}
          >
            {mapImage ? (
              <img
                className="map-image"
                src={mapImage}
                alt="Uploaded base map"
                style={{ transform: `scale(${zoom})` }}
              />
            ) : (
              <>
                <div className="map-grid" />
                <div className="map-placeholder">
                  <span className="upload-icon">＋</span>
                  <strong>Drop a map image here</strong>
                  <small>
                    or use Upload a map to create your first canvas.
                  </small>
                </div>
              </>
            )}
            {mapImage && (
              <div className="map-tools">
                <button
                  onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))}
                >
                  −
                </button>
                <span>{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((value) => Math.min(2, value + 0.1))}
                >
                  ＋
                </button>
                <button onClick={() => setZoom(1)}>Reset</button>
              </div>
            )}
          </div>
          <aside className="theme-panel">
            <div className="panel-label">MAP DETAILS</div>
            <label>
              Map title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="My new map"
              />
            </label>
            <label>
              Game or world
              <input
                value={game}
                onChange={(event) => setGame(event.target.value)}
                placeholder="Optional"
              />
            </label>
            <div className="panel-label theme-label">ACCENT THEME</div>
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
              <span style={{ background: accent }} />
              {themes.find((item) => item.id === theme)?.name}
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
          {roadmap.map(([version, roadmapTitle, description]) => (
            <div className="roadmap-row" key={version}>
              <span className="version">{version}</span>
              <strong>{roadmapTitle}</strong>
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
