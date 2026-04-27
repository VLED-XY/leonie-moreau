import React from 'react';

export const Impressions = () => {
  return (
    <section
      id="impressions"
      className="resp-section"
      style={{
        width: '100%',
        backgroundColor: '#10069F',
        color: 'white',
        padding: '120px 5%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Label */}
        <div className="resp-label-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)' }}>03</span>
          <div style={{ height: '1px', width: '48px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)' }}>Impressions</span>
        </div>

        <div
          className="resp-grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1,
              textTransform: 'uppercase' as const,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Vos photos,<br />imprimées.
          </h2>
          <div>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', marginBottom: '16px', fontWeight: 400 }}>
              Tirages photo en formats variés, sur papier photo haute qualité.
            </p>
            <p style={{ fontSize: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>
              Commande sur demande
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
