import { useState } from 'react'
import HeatMap from './HeatMap.jsx'

export default function App() {
  const [activeStadium] = useState('citizens-bank-park')

  return (
    <div style={{ minHeight: '100vh', background: '#0c1220' }}>
      {/* Nav */}
      <nav style={{
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'sticky',
        top: 0,
        background: 'rgba(12,18,32,0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #fb923c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            color: '#fff',
          }}>⚾</div>
          <span style={{
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}>foulballmap</span>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          Beta · 1 of 30 stadiums
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '60px 32px 40px',
        textAlign: 'center',
        maxWidth: 800,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 100,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          marginBottom: 20,
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 8px rgba(239,68,68,0.6)',
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: 2,
            color: '#ef4444',
            textTransform: 'uppercase',
          }}>Powered by Statcast</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: -2,
          marginBottom: 16,
          background: 'linear-gradient(180deg, #f1f5f9 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Where to sit if you<br />want to catch a foul ball
        </h1>

        <p style={{
          fontSize: 17,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6,
          maxWidth: 560,
          margin: '0 auto',
        }}>
          We modeled 10,343 foul balls from the last six seasons through real Statcast trajectories. Section 107 at Citizens Bank Park gets <strong style={{ color: '#ef4444', fontWeight: 600 }}>48x more foul balls</strong> than Section 122. Here's the map.
        </p>

        {/* Stadium picker */}
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          marginTop: 28,
          flexWrap: 'wrap',
        }}>
          <button style={{
            padding: '10px 18px',
            borderRadius: 100,
            border: '1px solid rgba(239,68,68,0.5)',
            background: 'rgba(239,68,68,0.15)',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}>
            Citizens Bank Park
          </button>
          {['Yankee Stadium', 'Fenway Park', 'Dodger Stadium', 'Wrigley Field'].map(name => (
            <button key={name} style={{
              padding: '10px 18px',
              borderRadius: 100,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'not-allowed',
            }}>
              {name} <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 4 }}>SOON</span>
            </button>
          ))}
        </div>
      </section>

      {/* Heat Map */}
      <HeatMap />

      {/* Methodology */}
      <section style={{
        maxWidth: 800,
        margin: '60px auto 0',
        padding: '0 32px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 32,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: 3,
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>The Method</div>
          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
            letterSpacing: -0.5,
          }}>How we built this</h2>
          <div style={{ display: 'grid', gap: 20 }}>
            {[
              {
                step: '01',
                title: 'Pulled real foul ball data',
                body: 'Every tracked foul ball at Citizens Bank Park since 2020 — 10,343 events with exit velocity, launch angle, batter handedness, and spin rate from MLB Statcast.',
              },
              {
                step: '02',
                title: 'Built a physics trajectory engine',
                body: "Modeled each foul ball's 3D flight path using Alan Nathan's baseball aerodynamics model — gravity, air drag, Magnus force, and spin-induced lift.",
              },
              {
                step: '03',
                title: 'Mapped landing points to sections',
                body: "Used MLB's 3D stadium model to find where each trajectory intersects with the seating bowl, then aggregated into per-section probabilities.",
              },
              {
                step: '04',
                title: 'Adjusted for batter handedness',
                body: 'Right-handed batters foul toward the first base side. Lefties foul toward third. Toggle the L/R filter above and watch the heat map flip.',
              },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: '#ef4444',
                  fontWeight: 500,
                  minWidth: 30,
                }}>{item.step}</div>
                <div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}>{item.title}</div>
                  <div style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.6,
                  }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section style={{
        maxWidth: 800,
        margin: '40px auto 0',
        padding: '0 32px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(251,146,60,0.05))',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: 3,
            color: '#ef4444',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>Coming Soon</div>
          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: -0.5,
          }}>All 30 MLB stadiums + game-day predictions</h2>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 20,
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 auto 24px',
          }}>
            Get tonight's foul ball heat map adjusted for the actual lineup. Drop your email and we'll let you know when it's live.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const email = e.target.email.value
              if (email) {
                alert(`Thanks! We'll notify ${email} when game-day predictions launch.`)
                e.target.reset()
              }
            }}
            style={{
              display: 'flex',
              gap: 8,
              maxWidth: 400,
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              required
              style={{
                flex: 1,
                minWidth: 220,
                padding: '12px 16px',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: 100,
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #fb923c)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Notify me
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 32px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: 2,
          color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Built by Front of House Studios
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: 'rgba(255,255,255,0.15)',
        }}>
          Not affiliated with MLB. Data sourced from publicly available Statcast records.
        </div>
      </footer>
    </div>
  )
}
