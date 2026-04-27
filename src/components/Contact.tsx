import React from 'react';

const ACCENT = '#10069F';

export const Contact = () => {
  return (
    <section
      id="contact"
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
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: ACCENT }}>05</span>
          <div style={{ height: '1px', width: '48px', backgroundColor: '#0a0a0a' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)' }}>Contact</span>
        </div>

        <div
          className="resp-grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '120px',
            alignItems: 'start',
          }}
        >
          {/* Gauche */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '32px',
              }}
            >
              Travaillons<br />
              <span style={{ color: ACCENT }}>ensemble.</span>
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(0,0,0,0.55)', fontWeight: 400 }}>
              Parlez-moi de votre projet, je vous réponds dans les 48h.
            </p>
          </div>

          {/* Formulaire */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              { id: 'nom', label: 'Nom', type: 'text', placeholder: 'Votre nom' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' },
              { id: 'type', label: 'Type de séance', type: 'text', placeholder: 'Photoshoot, Événement…' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  htmlFor={id}
                  style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.4)' }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  id={id}
                  placeholder={placeholder}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid rgba(0,0,0,0.2)',
                    padding: '8px 0',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    outline: 'none',
                    width: '100%',
                    color: '#0a0a0a',
                  }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="message" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.4)' }}>
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Parlez-moi de votre projet"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1.5px solid rgba(0,0,0,0.2)',
                  padding: '8px 0',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  width: '100%',
                  color: '#0a0a0a',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: ACCENT,
                color: 'white',
                border: 'none',
                padding: '18px 40px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase' as const,
                cursor: 'pointer',
                fontFamily: 'inherit',
                alignSelf: 'flex-start',
              }}
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
