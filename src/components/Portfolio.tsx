import React from 'react';

const ACCENT = '#10069F';

export const Portfolio = () => {
  return (
    <section
      id="portfolio"
      className="resp-section"
      style={{
        width: '100%',
        backgroundColor: '#0a0a0a',
        color: 'white',
        padding: '120px 5%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Label */}
        <div className="resp-space-between-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: ACCENT }}>04</span>
            <div style={{ height: '1px', width: '48px', backgroundColor: ACCENT }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)' }}>Portfolio</span>
          </div>
          <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
            Sélection
          </span>
        </div>

        {/* Titre */}
        <h2
          style={{
            fontSize: 'clamp(3rem, 6vw, 7rem)',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            marginBottom: '64px',
          }}
        >
          Mes<br />
          <span style={{ color: ACCENT }}>Photos.</span>
        </h2>

        {/* Grille */}
        <div
          className="resp-portfolio-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
          }}
        >
          {[
            'https://leonie-moreau.designbykiara.com/DSC_1559.jpg',
            'https://leonie-moreau.designbykiara.com/DSC_2720.jpg',
            'https://leonie-moreau.designbykiara.com/DSC_2459.jpg',
            'https://leonie-moreau.designbykiara.com/DSC_3226.jpg',
            'https://leonie-moreau.designbykiara.com/DSC_3275.jpg',
            'https://leonie-moreau.designbykiara.com/DSC_4717.jpeg',
            'https://leonie-moreau.designbykiara.com/DSC_1957.jpg',
            'https://leonie-moreau.designbykiara.com/DSC_7744.JPG',
            'https://leonie-moreau.designbykiara.com/DSC_7854.JPG',
            'https://leonie-moreau.designbykiara.com/DSC_5322.JPG',
          ].map((url, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '4/5',
                backgroundColor: '#1a1a1a',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={url}
                alt={`Photo ${String(i + 1).padStart(2, '0')}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
