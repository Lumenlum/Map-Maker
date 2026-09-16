import { useRef, useState } from 'react'
import { themes, type ThemeId } from './theme'

const markerTypes = [
  ['box', 'Item box', '#54a0ff'],
  ['spawn', 'Item spawn', '#2ed573'],
  ['boss', 'Boss spawn', '#ff4757'],
  ['door', 'Locked door', '#ffa502'],
  ['cache', 'Secret cache', '#a55eea'],
] as const
type Marker = {
  id: number
  type: string
  x: number
  y: number
  note: string
  image?: string
}
type MapCard = { id: number; title: string; game: string; cover: string | null }
type Tile = {
  id: string
  src: string
  left: number
  top: number
  width: number
  height: number
}

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
  const [tiles, setTiles] = useState<Tile[]>([])
  const [zoom, setZoom] = useState(1)
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%')
  const [activeType, setActiveType] = useState('box')
  const [markers, setMarkers] = useState<Marker[]>([])
  const [history, setHistory] = useState<Marker[][]>([])
  const [future, setFuture] = useState<Marker[][]>([])
  const [mapCards, setMapCards] = useState<MapCard[]>([
    { id: 1, title: 'My new map', game: 'Unassigned world', cover: null },
  ])
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const markerImageInput = useRef<HTMLInputElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const accent = themes.find((item) => item.id === theme)?.color ?? '#54a0ff'
  function loadMap(file?: File) {
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const source = String(reader.result)
      setMapImage(source)
      const image = new Image()
      image.onload = () => {
        const size = 512
        const next: Tile[] = []
        for (let top = 0; top < image.height; top += size)
          for (let left = 0; left < image.width; left += size) {
            const canvas = document.createElement('canvas')
            canvas.width = Math.min(size, image.width - left)
            canvas.height = Math.min(size, image.height - top)
            canvas
              .getContext('2d')
              ?.drawImage(
                image,
                left,
                top,
                canvas.width,
                canvas.height,
                0,
                0,
                canvas.width,
                canvas.height,
              )
            next.push({
              id: `${left}-${top}`,
              src: canvas.toDataURL('image/webp', 0.88),
              left: (left / image.width) * 100,
              top: (top / image.height) * 100,
              width: (canvas.width / image.width) * 100,
              height: (canvas.height / image.height) * 100,
            })
          }
        setTiles(next)
      }
      image.src = source
    }
    reader.readAsDataURL(file)
  }
  function updateMarkers(next: Marker[]) {
    setHistory((items) => [...items.slice(-9), markers])
    setMarkers(next)
    setFuture([])
  }
  function addMarker(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('.map-tools, .marker-pin')) return
    const rect = event.currentTarget.getBoundingClientRect()
    const visibleX = ((event.clientX - rect.left) / rect.width) * 100
    const visibleY = ((event.clientY - rect.top) / rect.height) * 100
    const [originX, originY] = zoomOrigin
      .split(' ')
      .map((value) => Number.parseFloat(value))
    const x = originX + (visibleX - originX) / zoom
    const y = originY + (visibleY - originY) / zoom
    updateMarkers([
      ...markers,
      {
        id: Date.now(),
        type: activeType,
        note: '',
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      },
    ])
  }
  function undo() {
    const previous = history.at(-1)
    if (!previous) return
    setFuture((items) => [markers, ...items])
    setMarkers(previous)
    setHistory((items) => items.slice(0, -1))
  }
  function redo() {
    const next = future[0]
    if (!next) return
    setHistory((items) => [...items, markers])
    setMarkers(next)
    setFuture((items) => items.slice(1))
  }
  function zoomAt(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    setZoomOrigin(
      `${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`,
    )
    setZoom((value) =>
      Math.min(3, Math.max(0.5, value + (event.deltaY < 0 ? 0.12 : -0.12))),
    )
  }
  function doubleZoom(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setZoomOrigin(
      `${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`,
    )
    setZoom((value) => Math.min(3, value + 0.35))
  }
  function saveMapCard() {
    setMapCards((cards) =>
      cards.map((card) =>
        card.id === 1
          ? {
              ...card,
              title: title || 'Untitled map',
              game: game || 'Unassigned world',
              cover: mapImage,
            }
          : card,
      ),
    )
  }
  function openMap(card: MapCard) {
    setTitle(card.title)
    setGame(card.game === 'Unassigned world' ? '' : card.game)
    setMapImage(card.cover)
    setMarkers([])
    setSelectedMarker(null)
    setZoom(1)
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
      <section className="map-library" aria-labelledby="library-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">YOUR MAPS</div>
            <h2 id="library-title">Open a workspace</h2>
          </div>
          <button
            className="secondary-button"
            onClick={() => {
              setTitle('My new map')
              setGame('')
              setMapImage(null)
              setMarkers([])
            }}
          >
            New map
          </button>
        </div>
        <div className="map-cards">
          {mapCards.map((card) => (
            <button
              className="map-card"
              key={card.id}
              onClick={() => openMap(card)}
            >
              <div className="card-cover">
                {card.cover ? <img src={card.cover} alt="" /> : <span>✦</span>}
              </div>
              <strong>{card.title}</strong>
              <small>{card.game}</small>
            </button>
          ))}
          <button
            className="map-card add-card"
            onClick={() => {
              setTitle('My new map')
              setGame('')
              setMapImage(null)
              setMarkers([])
            }}
          >
            <span>＋</span>
            <strong>Create a map</strong>
          </button>
        </div>
        <button className="primary-button save-card" onClick={saveMapCard}>
          Save current map to library
        </button>
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
            onClick={addMarker}
            onWheel={zoomAt}
            onDoubleClick={doubleZoom}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              loadMap(event.dataTransfer.files[0])
            }}
          >
            <div
              className="map-content"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: zoomOrigin,
              }}
            >
              {mapImage ? (
                <div className="tile-layer" aria-label="Tiled base map">
                  {tiles.map((tile) => (
                    <img
                      key={tile.id}
                      className="map-tile"
                      src={tile.src}
                      alt=""
                      style={{
                        left: `${tile.left}%`,
                        top: `${tile.top}%`,
                        width: `${tile.width}%`,
                        height: `${tile.height}%`,
                      }}
                    />
                  ))}
                </div>
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
              {markers.map((marker) => (
                <button
                  key={marker.id}
                  className="marker-pin"
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    background: markerTypes.find(
                      (item) => item[0] === marker.type,
                    )?.[2],
                  }}
                  title="Select marker"
                  draggable
                  onDragEnd={(event) => {
                    const rect =
                      event.currentTarget.parentElement?.getBoundingClientRect()
                    if (rect)
                      updateMarkers(
                        markers.map((item) =>
                          item.id === marker.id
                            ? {
                                ...item,
                                x:
                                  ((event.clientX - rect.left) / rect.width) *
                                  100,
                                y:
                                  ((event.clientY - rect.top) / rect.height) *
                                  100,
                              }
                            : item,
                        ),
                      )
                  }}
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedMarker(marker.id)
                  }}
                >
                  ●
                </button>
              ))}
            </div>
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
                <button
                  onClick={() => {
                    setZoom(1)
                    setZoomOrigin('50% 50%')
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
          <aside className="theme-panel">
            <div className="panel-label">MARKER TOOL</div>
            <p className="tool-hint">
              Choose a category, then click the map to place a marker.
            </p>
            <div className="marker-types">
              {markerTypes.map(([id, name, color]) => (
                <button
                  key={id}
                  className={
                    activeType === id ? 'marker-type selected' : 'marker-type'
                  }
                  onClick={() => setActiveType(id)}
                >
                  <span style={{ background: color }} />
                  {name}
                </button>
              ))}
            </div>
            <div className="history-tools">
              <button onClick={undo} disabled={!history.length}>
                Undo
              </button>
              <button onClick={redo} disabled={!future.length}>
                Redo
              </button>
              <span>
                {markers.length} marker{markers.length === 1 ? '' : 's'}
              </span>
            </div>
            {selectedMarker !== null &&
              (() => {
                const marker = markers.find(
                  (item) => item.id === selectedMarker,
                )
                if (!marker) return null
                return (
                  <div className="marker-editor">
                    <div className="panel-label">EDIT MARKER</div>
                    <label>
                      Note
                      <textarea
                        value={marker.note}
                        onChange={(event) =>
                          updateMarkers(
                            markers.map((item) =>
                              item.id === marker.id
                                ? { ...item, note: event.target.value }
                                : item,
                            ),
                          )
                        }
                        placeholder="What is here?"
                      />
                    </label>
                    <button
                      className="secondary-button"
                      onClick={() => markerImageInput.current?.click()}
                    >
                      Attach image
                    </button>
                    <input
                      ref={markerImageInput}
                      className="visually-hidden"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () =>
                          updateMarkers(
                            markers.map((item) =>
                              item.id === marker.id
                                ? { ...item, image: String(reader.result) }
                                : item,
                            ),
                          )
                        reader.readAsDataURL(file)
                      }}
                    />
                    <button
                      className="delete-marker"
                      onClick={() => {
                        updateMarkers(
                          markers.filter((item) => item.id !== marker.id),
                        )
                        setSelectedMarker(null)
                      }}
                    >
                      Delete marker
                    </button>
                  </div>
                )
              })()}
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
