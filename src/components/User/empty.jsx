import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './carousel.css';
import { useNavigate } from 'react-router-dom';



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
  },
  basketball: {
    mens: [
      { name: 'Sleeveless', image: '/assets/basketball/sleeveless.png' },
      { name: 'Shorts', image: '/assets/basketball/shorts.png' },
    ],
  },
};

export default function CustomizePage() {
  const { sport, fit } = useParams();
  const styles = jerseyModels[sport]?.[fit] || [];
  const [animate, setAnimate] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
        setInitialAnimationDone(true);
        setRotationAngle(-288);
     
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

    const handleLeft = () => {
    if (initialAnimationDone) {
        setRotationAngle(prev => prev + 72);
    }
    };
    const handleRight = () => {
    if (initialAnimationDone) {
        setRotationAngle(prev => prev - 72);
    }
    };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col items-center justify-center relative overflow-hidden">
        <h1 className="text-4xl font-bold font-michroma capitalize absolute top-10 animate-heading3D z-10">
          Choose your jersey style
        </h1>

        {/* Arrows */}
        <button onClick={handleLeft} className="absolute left-4 top-1/2 z-20 text-3xl"></button>
        <button onClick={handleRight} className="absolute right-4 top-1/2 z-20 text-3xl">➡</button>

        <div
          className={`carousel-container mt-36 ${animate ? 'animate-start-spin' : ''}`}
          ref={containerRef}
        >
          <div

            className={`carousel ${!initialAnimationDone ? 'animate-rotateOnce' : ''}`}
            style={{
                transform: initialAnimationDone
                ? `rotateY(${rotationAngle}deg)`
                : undefined,
                transition: initialAnimationDone ? 'transform 0.8s ease-in-out' : 'none',
            }}
          >

          
            {styles.map((style, idx) => (
              <div className="card" key={idx}>
                <div className="flex flex-col items-center">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-24 h-24 object-contain mb-2"
                  />
                  <p className="text-sm font-semibold mb-2">{style.name}</p>
                  <button
                    onClick={() =>
                      navigate('/design-editor', {
                        state: {
                          sport,
                          fit,
                          style: style.name,   // 👈 Selected style name
                          image: style.image   // 👈 Style image if needed
                        }
                      })
                    }
                  >
                    Customize
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
