import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './carousel.css';

const jerseyModels = {
  cricket: {
    mens: [
      { name: 'Half Sleeve', image: '/assets/cricket/half.png' },
      { name: 'Full Sleeve', image: '/assets/cricket/full.png' },
      { name: 'Arm Cut', image: '/assets/cricket/arm.png' },
      { name: 'Bottom', image: '/assets/cricket/bottom.png' },
      { name: 'Shorts', image: '/assets/cricket/shorts.png' },
    ],
    womens: [
      { name: 'Half Sleeve', image: '/assets/cricket/half.png' },
      { name: 'Full Sleeve', image: '/assets/cricket/full.png' },
      { name: 'Arm Cut', image: '/assets/cricket/arm.png' },
      { name: 'Bottom', image: '/assets/cricket/bottom.png' },
      { name: 'Shorts', image: '/assets/cricket/shorts.png' },
    ],
    kids: [
      { name: 'Half Sleeve', image: '/assets/cricket/half.png' },
      { name: 'Full Sleeve', image: '/assets/cricket/full.png' },
      { name: 'Shorts', image: '/assets/cricket/shorts.png' },
    ],
    unisex: [
      { name: 'Half Sleeve', image: '/assets/cricket/half.png' },
      { name: 'Full Sleeve', image: '/assets/cricket/full.png' },
      { name: 'Arm Cut', image: '/assets/cricket/arm.png' },
    ],
  },
  basketball: {
    mens: [
      { name: 'Sleeveless', image: '/assets/basketball/sleeveless.png' },
      { name: 'Shorts', image: '/assets/basketball/shorts.png' },
    ],
    womens: [
      { name: 'Sleeveless', image: '/assets/basketball/sleeveless.png' },
      { name: 'Shorts', image: '/assets/basketball/shorts.png' },
    ],
    kids: [
      { name: 'Sleeveless', image: '/assets/basketball/sleeveless.png' },
      { name: 'Shorts', image: '/assets/basketball/shorts.png' },
    ],
  },
  football: {
    mens: [
      { name: 'Home Jersey', image: '/assets/football/home.png' },
      { name: 'Away Jersey', image: '/assets/football/away.png' },
      { name: 'Shorts', image: '/assets/football/shorts.png' },
    ],
  },
};

export default function CustomizePage() {
  const { sport, fit } = useParams();
  const styles = jerseyModels[sport]?.[fit] || [];
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  
  // Calculate angle per item based on number of styles
  const anglePerItem = styles.length > 0 ? 360 / styles.length : 72;
  const baseRotation = currentIndex * -anglePerItem;

  useEffect(() => {
    if (styles.length === 0) {
      setInitialAnimationDone(true);
      return;
    }

    // Initial spinning animation - visual only, doesn't change currentIndex
    const spinInterval = setInterval(() => {
      setRotationAngle((prev) => prev - 2);
    }, 16);

    const stopSpinTimeout = setTimeout(() => {
      clearInterval(spinInterval);
      setInitialAnimationDone(true);
      // Snap to the currentIndex position
      setRotationAngle(baseRotation);
    }, 3000);

    return () => {
      clearInterval(spinInterval);
      clearTimeout(stopSpinTimeout);
    };
  }, [styles.length]);

  const handleLeft = () => {
    if (initialAnimationDone && styles.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + styles.length) % styles.length);
      setRotationAngle((prev) => prev + anglePerItem);
    }
  };

  const handleRight = () => {
    if (initialAnimationDone && styles.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % styles.length);
      setRotationAngle((prev) => prev - anglePerItem);
    }
  };

  const handleCustomize = (style) => {
    navigate('/design-editor', {
      state: {
        sport,
        fit,
        style: style.name,
        image: style.image
      }
    });
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Responsive heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-michroma capitalize absolute top-6 sm:top-10 z-10 animate-heading3D text-center px-4">
          Choose Your Jersey Style
        </h1>

        {/* Navigation buttons */}
        <button 
          onClick={handleLeft} 
          className="absolute left-2 sm:left-4 top-1/2 z-20 text-2xl sm:text-3xl hover:scale-110 transition-transform disabled:opacity-50"
          disabled={!initialAnimationDone}
        >
          <ChevronLeft size={28} className="sm:w-8 sm:h-8" />
        </button>
        <button 
          onClick={handleRight} 
          className="absolute right-2 sm:right-4 top-1/2 z-20 text-2xl sm:text-3xl hover:scale-110 transition-transform disabled:opacity-50"
          disabled={!initialAnimationDone}
        >
          <ChevronRight size={28} className="sm:w-8 sm:h-8" />
        </button>

        {/* Carousel container */}
        <div className="jersey-carousel-container mt-24 sm:mt-32 lg:mt-36">
          <div
            className="jersey-carousel"
            style={{
              transform: `rotateY(${rotationAngle}deg)`,
              transition: initialAnimationDone ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          >
            {styles.map((style, idx) => {
              const angle = idx * anglePerItem;

              return (
                <div
                  className="jersey-card"
                  key={idx}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(var(--jersey-carousel-radius))`,
                  }}
                >
                  <div className="jersey-card-content">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="jersey-image"
                    />
                    <p className="jersey-title">{style.name}</p>
                    <button
                      onClick={() => handleCustomize(style)}
                      className="customize-btn"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="jersey-dots-container">
          {styles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (initialAnimationDone) {
                  setCurrentIndex(idx);
                  setRotationAngle(idx * -anglePerItem);
                }
              }}
              className={`jersey-dot ${idx === currentIndex ? 'active' : ''}`}
              disabled={!initialAnimationDone}
            />
          ))}
        </div>

        {/* Info badge */}
        <div className="info-badge">
          <span className="sport-name">{sport}</span>
          <span className="fit-name">{fit}</span>
        </div>
      </div>
    </>
  );
}