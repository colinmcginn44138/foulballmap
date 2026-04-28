import { useState, useEffect } from 'react'

const SECTION_DATA = {
  107: { count: 101, prob: 0.097, perGame: 2.90, side: '1B' },
  103: { count: 94, prob: 0.090, perGame: 2.70, side: '1B' },
  104: { count: 93, prob: 0.089, perGame: 2.67, side: '1B' },
  105: { count: 86, prob: 0.082, perGame: 2.47, side: '1B' },
  102: { count: 65, prob: 0.062, perGame: 1.87, side: '1B' },
  101: { count: 64, prob: 0.061, perGame: 1.84, side: '1B' },
  109: { count: 61, prob: 0.058, perGame: 1.75, side: '1B' },
  132: { count: 59, prob: 0.056, perGame: 1.69, side: '1B' },
  106: { count: 50, prob: 0.048, perGame: 1.44, side: '1B' },
  130: { count: 37, prob: 0.035, perGame: 1.06, side: '1B' },
  110: { count: 35, prob: 0.033, perGame: 1.00, side: '1B' },
  127: { count: 34, prob: 0.033, perGame: 0.98, side: '3B' },
  111: { count: 31, prob: 0.030, perGame: 0.89, side: '1B' },
  112: { count: 31, prob: 0.030, perGame: 0.89, side: '1B' },
  108: { count: 29, prob: 0.028, perGame: 0.83, side: '1B' },
  118: { count: 24, prob: 0.023, perGame: 0.69, side: '3B' },
  129: { count: 23, prob: 0.022, perGame: 0.66, side: '1B' },
  126: { count: 23, prob: 0.022, perGame: 0.66, side: '3B' },
  131: { count: 18, prob: 0.017, perGame: 0.52, side: '1B' },
  128: { count: 18, prob: 0.017, perGame: 0.52, side: '3B' },
  124: { count: 17, prob: 0.016, perGame: 0.49, side: 'HP' },
  113: { count: 15, prob: 0.014, perGame: 0.43, side: '1B' },
  135: { count: 15, prob: 0.014, perGame: 0.43, side: '3B' },
  119: { count: 8, prob: 0.008, perGame: 0.23, side: '3B' },
  120: { count: 5, prob: 0.005, perGame: 0.14, side: 'HP' },
  121: { count: 4, prob: 0.004, perGame: 0.11, side: 'HP' },
  125: { count: 3, prob: 0.003, perGame: 0.09, side: 'HP' },
  122: { count: 2, prob: 0.002, perGame: 0.06, side: 'HP' },
}

const SECTION_POSITIONS = (() => {
  const sections = {}
  const cx = 350, cy = 340

  const placeArc = (sectionIds, startAngle, endAngle, innerR, outerR) => {
    const count = sectionIds.length
    sectionIds.forEach((id, i) => {
      const angle = startAngle + (endAngle - startAngle) * (i + 0.5) / count
      const rad = (angle * Math.PI) / 180
      const r = (innerR + outerR) / 2
      sections[id] = {
        x: cx + Math.sin(rad) * r,
        y: cy - Math.cos(rad) * r,
      }
    })
  }

  placeArc([132, 131, 130, 129, 128, 127, 126], 200, 250, 140, 190)
  placeArc([125, 124, 123, 122, 121, 120, 119, 118], 250, 290, 110, 160)
  placeArc([113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101], 290, 360, 140, 190)
  placeArc([135], 190, 200, 130, 170)

  return sections
})()

function getHeatColor(prob, maxProb) {
  const intensity = prob / maxProb
  if (intensity > 0.7) return `rgba(239, 68, 68, ${0.5 + intensity * 0.5})`
  if (intensity > 0.4) return `rgba(251, 146, 60, ${0.4 + intensity * 0.5})`
  if (intensity > 0.15) return `rgba(250, 204, 21, ${0.3 + intensity * 0.4})`
  return `rgba(74, 222, 128, ${0.2 + intensity * 0.3})`
}

function getHeatLabel(prob, maxProb) {
  const intensity = prob / maxProb
  if (intensity > 0.7) return 'HOT'
  if (intensity > 0.4) return 'WARM'
  if (intensity > 0.15) return 'MILD'
  return 'COLD'
}

export default function HeatMap() {
  const [selectedSection, setSelectedSection] = useState(null)
  const [filter, setFilter] = useState('all')
  const [hoveredSection, setHoveredSection] = useState(null)
  const [animatedSections, setAnimatedSections] = useState(new Set())

  const maxProb = Math.max(...Object.values(SECTION_DATA).map(d => d.prob))

  useEffect(() => {
    const sortedSections = Object.entries(SECTION_DATA)
      .sort((a, b) => b[1].prob - a[1].prob)
      .map(([id]) => parseInt(id))

    sortedSections.forEach((id, i) => {
      setTimeout(() => {
        setAnimatedSections(prev => new Set([...prev, id]))
      }, i * 40)
    })
  }, [])

  const activeSection = selectedSection || hoveredSection
  const activeSectionData = activeSection ? SECTION_DATA[activeSection] : null

  return (
    <section style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: '0 16px',
    }}>
      <style>{`
        @keyframes pulseGlow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .heatmap-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .heatmap-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="heatmap-grid">
        {/* Stadium Map */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 20,
        }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Batters' },
              { key: 'rhh', label: 'vs RHH' },
              { key: 'lhh', label: 'vs LHH' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 1,
                  padding: '6px 14px',
                  borderRadius: 100,
                  border: filter === f.key ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  background: filter === f.key ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                  color: filter === f.key ? '#ef4444' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <svg viewBox="0 0 700 500" style={{ width: '100%', height: 'auto' }}>
            <path d="M 120 340 Q 120 100 350 80 Q 580 100 580 340" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <g opacity="0.3">
              <polygon points="350,340 415,275 350,210 285,275" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <polygon points="350,340 345,335 347,330 353,330 355,335" fill="rgba(255,255,255,0.5)" />
            </g>
            <line x1="350" y1="340" x2="100" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="350" y1="340" x2="600" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4" />
            <text x="130" y="85" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="'DM Mono', monospace">LF</text>
            <text x="560" y="85" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="'DM Mono', monospace">RF</text>
            <text x="335" y="75" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="'DM Mono', monospace">CF</text>
            <text x="155" y="395" fill="rgba(239,68,68,0.3)" fontSize="11" fontFamily="'DM Mono', monospace" fontWeight="500" transform="rotate(-45, 155, 395)">← 3B SIDE (LHH)</text>
            <text x="490" y="360" fill="rgba(239,68,68,0.3)" fontSize="11" fontFamily="'DM Mono', monospace" fontWeight="500" transform="rotate(45, 490, 360)">1B SIDE (RHH) →</text>

            {Object.entries(SECTION_POSITIONS).map(([id, pos]) => {
              const secId = parseInt(id)
              const data = SECTION_DATA[secId]
              if (!data) return null
              if (!animatedSections.has(secId)) return null

              let displayProb = data.prob
              if (filter === 'rhh' && data.side === '3B') displayProb *= 0.15
              if (filter === 'lhh' && data.side === '1B') displayProb *= 0.15
              if (filter === 'rhh' && data.side === '1B') displayProb *= 1.3
              if (filter === 'lhh' && data.side === '3B') displayProb *= 2.5

              const color = getHeatColor(displayProb, maxProb)
              const radius = 12 + displayProb / maxProb * 20
              const isActive = activeSection === secId

              return (
                <g
                  key={id}
                  style={{ cursor: 'pointer', animation: 'scaleIn 0.3s ease' }}
                  onClick={() => setSelectedSection(selectedSection === secId ? null : secId)}
                  onMouseEnter={() => setHoveredSection(secId)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <circle cx={pos.x} cy={pos.y} r={radius + 8} fill={color} opacity={isActive ? 0.3 : 0.1} />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    fill={color}
                    stroke={isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isActive ? 2 : 0.5}
                    style={{
                      transition: 'all 0.2s ease',
                      animation: displayProb / maxProb > 0.7 ? 'pulseGlow 3s ease infinite' : 'none',
                    }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill={displayProb / maxProb > 0.3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}
                    fontSize={isActive ? 11 : 9}
                    fontFamily="'DM Mono', monospace"
                    fontWeight={isActive ? 700 : 400}
                    style={{ pointerEvents: 'none' }}
                  >
                    {id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 20,
            minHeight: 200,
          }}>
            {activeSectionData ? (
              <div style={{ animation: 'slideIn 0.2s ease' }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>Section Detail</div>
                <div style={{
                  fontSize: 42,
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: 4,
                  letterSpacing: -2,
                }}>{activeSection}</div>
                <div style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 100,
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 500,
                  letterSpacing: 2,
                  background: getHeatColor(activeSectionData.prob, maxProb),
                  color: '#fff',
                  marginBottom: 16,
                }}>{getHeatLabel(activeSectionData.prob, maxProb)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}>Foul Balls / Game</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>
                      {activeSectionData.perGame.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}>Probability</div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>
                      {(activeSectionData.prob * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}>Location</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
                      {activeSectionData.side === '1B' ? 'First Base Side'
                        : activeSectionData.side === '3B' ? 'Third Base Side'
                        : 'Behind Home Plate'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>Tap a Section</div>
                <p style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.6,
                }}>
                  Tap any section on the map to see the foul ball probability for that seat.
                </p>
              </div>
            )}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 20,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>Hottest Sections</div>
            {Object.entries(SECTION_DATA)
              .sort((a, b) => b[1].prob - a[1].prob)
              .slice(0, 5)
              .map(([id, data], i) => (
                <div
                  key={id}
                  onClick={() => setSelectedSection(parseInt(id))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.2)',
                    width: 16,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>Sec {id}</span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    color: '#ef4444',
                    fontWeight: 600,
                  }}>{data.perGame.toFixed(1)}/gm</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
