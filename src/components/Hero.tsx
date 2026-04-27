"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ACCENT = '#10069F';

export const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {/* Colonne gauche - noire, typo */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: isMobile ? '100%' : '48%',
          height: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#080808',
          backgroundImage: isMobile
            ? "url('https://leonie-moreau.designbykiara.com/DSC_0501.jpeg')"
            : "url('https://leonie-moreau.designbykiara.com/DSC_1451.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: isMobile ? '20px 20px 32px 20px' : '48px 48px 52px 52px',
          zIndex: 2,
        }}
      >
        {/* Overlay sombre pour lisibilite du texte */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.3) 100%)',
          zIndex: 0,
        }} />

        {/* Bandeau bleu haut */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            backgroundColor: ACCENT,
            transformOrigin: 'left',
          }}
        />

        {/* Label haut */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            position: 'absolute',
            top: '28px',
            left: isMobile ? '20px' : '52px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{
            width: '20px',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.25)',
            display: 'inline-block',
          }} />
          <span style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase' as const,
            fontWeight: 700,
          }}>
            Photographe — Paris
          </span>
        </motion.div>

        {/* Numero issue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            position: 'absolute',
            top: '28px',
            right: isMobile ? '20px' : '40px',
            color: ACCENT,
            fontSize: '11px',
            letterSpacing: '0.2em',
            fontWeight: 700,
          }}
        >
          № 001
        </motion.div>

        {/* Titre principal */}
        <div style={{ marginBottom: isMobile ? '24px' : '40px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(3.5rem, 20vw, 5.5rem)' : 'clamp(4.5rem, 8.5vw, 10rem)',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase' as const,
              lineHeight: 0.9,
              display: 'block',
            }}
          >
            Léonie
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(3.5rem, 20vw, 5.5rem)' : 'clamp(4.5rem, 8.5vw, 10rem)',
              fontWeight: 700,
              color: ACCENT,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase' as const,
              lineHeight: 0.9,
              display: 'block',
            }}
          >
            Moreau
          </motion.div>
        </div>

        {/* Separateur */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            transformOrigin: 'left',
            marginBottom: isMobile ? '16px' : '24px',
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* Ligne bas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="resp-hero-bottom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Portrait', 'Éditorial', 'Événements'].map((s) => (
              <span
                key={s}
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '9px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 700,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <a
            href="#about"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.2)',
              padding: isMobile ? '10px 16px' : '12px 20px',
            }}
          >
            Découvrir
          </a>
        </motion.div>
      </motion.div>

      {/* Colonne droite - photo (desktop uniquement) */}
      {!isMobile && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        style={{
          position: 'relative',
          width: '52%',
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('https://leonie-moreau.designbykiara.com/DSC_0501.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(30%)',
          }}
        />
        {/* Overlay bleu subtil */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(16,6,159,0.18) 0%, transparent 60%)',
          }}
        />
        {/* Overlay bas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(8,8,8,0.5) 0%, transparent 40%)',
          }}
        />

        {/* Vol. I label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '36px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase' as const,
            fontWeight: 700,
            writingMode: 'vertical-rl' as const,
          }}
        >
          Vol. I — 2024
        </motion.div>
      </motion.div>
      )}

      {/* Boule disco chevauchant les deux colonnes */}
      <motion.img
        src="https://leonie-moreau.designbykiara.com/bouledisco%20(1).png"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5, y: -40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: isMobile ? '36%' : '50%',
          left: isMobile ? '50%' : '48%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '130px' : 'clamp(160px, 22vw, 320px)',
          height: 'auto',
          zIndex: 10,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 0 40px rgba(180,160,255,0.55)) drop-shadow(0 0 80px rgba(16,6,159,0.4))',
          animation: 'discospin 18s linear infinite',
        }}
      />
    </section>
    </>
  );
};
