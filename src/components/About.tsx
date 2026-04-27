import React from 'react';

const ACCENT = '#10069F';

export const About = () => {
  return (
    <section
      id="about"
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
        {/* Label section */}
        <div className="resp-label-mb resp-label-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            01
          </span>
          <div style={{ height: '1px', width: '48px', backgroundColor: ACCENT }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            À Propos
          </span>
        </div>

        {/* Layout trois colonnes */}
        <div
          className="resp-grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 340px',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Gauche : titre éditorial */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                fontWeight: 700,
                lineHeight: 1,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Capturer<br />
              <span style={{ color: ACCENT }}>l'instant</span><br />
              juste.
            </h2>
          </div>

          {/* Droite : texte */}
          <div
            className="resp-about-copy"
            style={{
              borderLeft: `3px solid ${ACCENT}`,
              paddingLeft: '32px',
            }}
          >
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '24px',
                fontWeight: 400,
              }}
            >
              Je suis photographe, spécialisée dans les portraits naturels, les shootings éditoriaux et les événements.
            </p>
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 400,
                margin: 0,
              }}
            >
              Je travaille avec des particuliers et des professionnels, en cherchant toujours la lumière et l'authenticité.
            </p>
          </div>

          {/* Droite : image zèbre décorative */}
          <div
            className="resp-hide-mobile"
            style={{
              position: 'relative',
              height: '420px',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://leonie-moreau.designbykiara.com/peauanimal.jpg"
              alt=""
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'grayscale(20%) contrast(1.1)',
                display: 'block',
              }}
            />
            {/* Badge label sur l'image */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                backgroundColor: '#10069F',
                color: 'white',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                padding: '6px 10px',
              }}
            >
              Éditorial
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
