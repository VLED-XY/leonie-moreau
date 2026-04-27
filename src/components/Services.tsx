import React from 'react';

const ACCENT = '#10069F';

const services = [
  { name: "Photoshoot", desc: "Portrait & mode" },
  { name: "Éditorial", desc: "Direction artistique" },
  { name: "Événements", desc: "Couverture complète" },
  { name: "Mariages", desc: "Reportage du jour J" },
  { name: "Polaroid Mannequinat", desc: "Booking & book" },
  { name: "Photos LinkedIn", desc: "Portrait professionnel" },
];

export const Services = () => {
  return (
    <section
      id="services"
      className="resp-section"
      style={{
        width: '100%',
        backgroundColor: '#fafafa',
        color: '#0a0a0a',
        padding: '120px 5%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Label */}
        <div className="resp-label-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '80px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: ACCENT }}>02</span>
          <div style={{ height: '1px', width: '48px', backgroundColor: '#0a0a0a' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)' }}>Services</span>
        </div>

        {/* Liste services */}
        <div>
          {services.map((service, index) => (
            <div
              className="resp-service-row"
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '28px 0',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                cursor: 'default',
              }}
            >
              <div className="resp-service-main" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: ACCENT,
                    letterSpacing: '0.2em',
                    minWidth: '28px',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {service.name}
                </span>
              </div>
              <span
                className="resp-service-desc"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(0,0,0,0.4)',
                  fontWeight: 700,
                }}
              >
                {service.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
