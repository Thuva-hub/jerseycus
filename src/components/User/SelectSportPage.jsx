import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './SelectSportPage.css';

const sports = [
  { name: 'Football', image: '/assets/football.png' },
  { name: 'Cricket', image: '/assets/cricket.png' },
  { name: 'Rugby', image: '/assets/rugby.png' },
  { name: 'Volleyball', image: '/assets/volleyball.png' },
  { name: 'Basketball', image: '/assets/basketball.png' },
  { name: 'Hockey', image: '/assets/hocky.png' },
];

export default function SelectSportPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState(null);

  // Calculate rotation angle based on current index
  // const rotationAngle = currentIndex * -60; // -60° per step for 6 cards

  useEffect(() => {
    // Initial spinning animation
    const spinInterval = setInterval(() => {
      setRotationAngle((prev) => prev - 2);
    }, 16);

    const stopSpinTimeout = setTimeout(() => {
      clearInterval(spinInterval);
      setInitialAnimationDone(true);
      

      // Snap to nearest multiple of card spacing (60° here)
      setRotationAngle((prev) => {
        const spacing = 360 / sports.length;
        return Math.round(prev / spacing) * spacing;
      });
    }, 1500);

    return () => {
      clearInterval(spinInterval);
      clearTimeout(stopSpinTimeout);
    };
  }, []);

const handleLeft = () => {
  if (initialAnimationDone) {
    setRotationAngle((prev) => prev + 60);
    setCurrentIndex((prev) => (prev - 1 + sports.length) % sports.length);
  }
};

const handleRight = () => {
  if (initialAnimationDone) {
    setRotationAngle((prev) => prev - 60);
    setCurrentIndex((prev) => (prev + 1) % sports.length);
  }
};

  const handleFlip = (index) => setFlippedIndex(index);
  const handleUnflip = () => setFlippedIndex(null);

  const handleFitSelect = (sport, fit) => {
    navigate(`/customize/${sport.toLowerCase()}/${fit.toLowerCase()}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Responsive heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-michroma capitalize absolute top-6 sm:top-10 z-10 animate-heading3D text-center px-4">
          Choose Your Sport
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
        <div className="carousel-container mt-24 sm:mt-32 lg:mt-36">
          <div
            className="carousel"
            style={{
              transform: `rotateY(${rotationAngle}deg)`,
              transition: initialAnimationDone ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          >
            {sports.map((sport, idx) => {
              const angle = idx * 60; // Fixed 60° spacing
              const isFlipped = flippedIndex === idx;

              return (
                <div
                  className="card"
                  key={idx}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(var(--carousel-radius))`,
                  }}
                >
                  <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
                    {/* Front */}
                    <div className="card-face card-front">
                      <img
                        src={sport.image}
                        alt={sport.name}
                        className="card-image"
                      />
                      <p className="card-title">{sport.name}</p>
                      <button
                        onClick={() => handleFlip(idx)}
                        className="select-btn"
                      >
                        Select
                      </button>
                    </div>

                    {/* Back */}
                    <div className="card-face card-back">
                      <button
                        onClick={handleUnflip}
                        className="close-btn"
                      >
                        <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>

                      <img
                        src="/assets/logo.png"
                        className="logo-image"
                        alt="Logo"
                      />
                      <p className="fit-title">
                        Choose Fit
                      </p>

                      <div className="fit-buttons">
                        {['Mens', 'Womens', 'Kids', 'Unisex'].map((fit) => (
                          <button
                            key={fit}
                            onClick={() => handleFitSelect(sport.name, fit)}
                            className="fit-btn"
                          >
                            {fit}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="dots-container">
          {sports.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (initialAnimationDone) {
                  setCurrentIndex(idx);          // just for active class
                  setRotationAngle(idx * -60);   // actual rotation
                }
              }}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              disabled={!initialAnimationDone}
            />
          ))}
        </div>
      </div>
    </>
  );
}