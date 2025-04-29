'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [stage, setStage] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [flashText, setFlashText] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    // Disable right-click
    const disableRightClick = (e) => {
      e.preventDefault();
      alert('Right-click is disabled to protect this website.');
    };
    document.addEventListener('contextmenu', disableRightClick);

    // Detect developer tools (not foolproof)
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        alert('Developer tools detected. Access is restricted.');
        window.location.reload(); // Reload to discourage debugging
      }
    };
    window.addEventListener('resize', detectDevTools);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      window.removeEventListener('resize', detectDevTools);
    };
  }, []);

  const lines = [
    'AWAKENING THE SHADOW CIRCLE...',
    'UNVEILING ANCIENT SIGILS...',
    'THE ELDER VEIL STIRS...',
    'WHISPERS OF THE FORGOTTEN CULT...',
    'ALIGNING THE CRIMSON STARS...',
    'SUMMONING ETHEREAL GUARDIANS...',
    'THE VOID CHANT BEGINS...',
    'UNBINDING THE SACRED RUNES...',
    'THE OBSIDIAN GATE CREAKS...',
    'SHADOWS BIND THE ETERNAL PACT...',
    'THE BLOOD OATH IS SEALED...',
    'ARCANE THREADS WEAVE TIGHT...',
    'THE DREAD ORACLE AWAKENS...',
    'CRYPTIC TOMES UNRAVEL...',
    'THE EYE OF KHALDAR OPENS...',
    'SHROUDED PROPHECIES IGNITE...',
    'THE RAVEN CIRCLE CONVERGES...',
    'VEILED SISTERS CHANT IN UNISON...',
    'THE ABYSSAL THRONE RUMBLES...',
    'FORBIDDEN KNOWLEDGE UNLEASHED...',
    'THE SEVENTH SEAL BREAKS...',
    'THE CULT OF ZETHAR RISES...',
    'DARK FLAMES ILLUMINATE THE PATH...',
    'THE FINAL RITE COMMENCES...',
    'ENTER THE INNER SANCTUM...',
  ];

  useEffect(() => {
    if (stage === 'initializing') {
      const container = document.getElementById('typewriter');
      let lineIndex = 0;
      const totalTime = 3000; // 3s total
      const intervalTime = totalTime / lines.length; // ~120ms per line

      function showLine() {
        if (lineIndex < lines.length) {
          const lineElement = document.createElement('p');
          lineElement.className = 'typewriter-line';
          lineElement.textContent = lines[lineIndex];
          lineElement.style.animationDelay = `${lineIndex * intervalTime}ms`;
          container.appendChild(lineElement);
          lineIndex++;
          setTimeout(showLine, intervalTime);
        } else {
          setTimeout(() => {
            setStage('loading');
          }, 500);
        }
      }

      showLine();
    }

    if (stage === 'loading') {
      let countdownStarted = false;

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (!countdownStarted) {
              countdownStarted = true;
              setCountdown(5);
              const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(countdownInterval);
                    clearInterval(progressInterval);
                    setStage('buttons');
                    return null;
                  }
                  return prev - 1;
                });
              }, 1000);
            }
            return 100;
          }
          return prev + (100 / 7000) * 10; // 7s total
        });
      }, 10);

      const flashMessages = [
        'THE SHADOW WHISPERS...',
        'BLOOD BINDS US...',
        'THE VEIL THINS...',
        'SECRETS UNRAVEL...',
        'THE RAVEN WATCHES...',
        'ETERNAL OATHS ECHO...',
      ];

      let flashIndex = 0;
      const flashInterval = setInterval(() => {
        if (progress < 100 && flashIndex < flashMessages.length) {
          setFlashText(flashMessages[flashIndex]);
          setTimeout(() => setFlashText(''), 700);
          flashIndex++;
        } else if (progress < 100 && flashIndex >= flashMessages.length) {
          flashIndex = 0; // Loop flash messages
        } else {
          clearInterval(flashInterval);
        }
      }, 800);

      return () => {
        clearInterval(progressInterval);
        clearInterval(flashInterval);
      };
    }
  }, [stage]);

  // Calculate number of filled blocks (10 blocks total, 10% each)
  const filledBlocks = Math.floor(progress / 10);

  return (
    <div className="min-h-screen">
      {stage === 'initializing' && (
        <div className="absolute top-0 left-0 pt-6 pl-6 sm:pt-8 sm:pl-8 w-full">
          <div id="typewriter" className="text-left"></div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-box flex flex-col items-center space-y-6">
            <h1 className="loading-title">ARCANUM V0.01</h1>
            <div className="progress-container">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`progress-block ${index < filledBlocks ? 'filled' : ''}`}
                />
              ))}
            </div>
            <div className="min-h-[24px] w-full">
              {(flashText || countdown !== null) && (
                <p className={countdown !== null ? 'countdown-text' : 'flash-text'}>
                  {countdown !== null ? (
                    <>
                      Opening in <span className="countdown-number">{countdown}</span> second
                      {countdown !== 1 ? 's' : ''}...
                    </>
                  ) : (
                    flashText
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {stage === 'buttons' && (
        <div className="password-container">
          <img
            src="/arcanum-2.png"
            alt="Arcanum Text"
            className="password-text-image"
          />
          <div className="password-input-container">
            <div className="flex flex-col space-y-4">
              <a
                href="https://arcanum-3.gitbook.io/arcanum"
                target="_blank"
                rel="noopener noreferrer"
                className="arc-button"
              >
                Explore the Arcanum
              </a>
              <a
                href="https://forms.gle/your-google-form-link" // Replace with your Google Form link
                target="_blank"
                rel="noopener noreferrer"
                className="arc-button"
              >
                Join the Circle
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}