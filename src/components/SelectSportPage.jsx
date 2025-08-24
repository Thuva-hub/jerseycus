import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function SelectSportPage() {
  const navigate = useNavigate();

  const sports = [
    { name: 'Football', image: '/assets/football.png' },
    { name: 'Cricket', image: '/assets/cricket.png' },
    { name: 'Rugby', image: '/assets/rugby.png' },
    { name: 'Volleyball', image: '/assets/volleyball.png' },
    { name: 'Basketball', image: '/assets/basketball.png' },
    { name: 'Hockey', image: '/assets/hockey.png' },
    { name: 'Kabaddi', image: '/assets/kabaddi.png' },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);

  const handleNext = () => {
    if (startIndex + 3 < sports.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleSelect = (index) => {
    setFlippedIndex(index);
  };

  const handleCancel = () => {
    setFlippedIndex(null);
  };

  const handleFitSelect = (sport, fit) => {
    navigate(`/customize/${sport.toLowerCase()}/${fit.toLowerCase()}`);
  };

  return (
    <>
      <Navbar />
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold font-michroma">Design Your Legacy</h1>
        <p className="text-sm text-gray-500 mt-2">
          Select a sport to begin your custom jersey creation journey.
        </p>

        <div className="relative mt-10 max-w-5xl mx-auto px-4 overflow-hidden">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${startIndex * (100 / 3)}%)`,
                width: `${(sports.length * 100) / 7}%`,
              }}
            >
              {sports.map((sport, index) => (
                <div
                  key={index}
                  className={`w-[300px] h-[480px] flex-shrink-0 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 ${
                    flippedIndex === index ? 'animate-border-glow' : ''
                  }`}
                >
                  <div className="relative w-full h-full [perspective:1000px]">
                    <div
                      className={`relative w-full h-full duration-700 [transform-style:preserve-3d] ${
                        flippedIndex === index ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Front */}
                      <div className="absolute w-full h-full backface-hidden">
                        <div className="bg-white border rounded-md shadow p-4 text-center">
                          <img
                            src={sport.image}
                            alt={sport.name}
                            className="h-[300px] mx-auto mb-4"
                          />
                          <h3 className="font-bold text-lg">{sport.name}</h3>
                          <button
                            onClick={() => handleSelect(index)}
                            className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:scale-95 transition"
                          >
                            Select Sport
                          </button>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-tr from-yellow-100 to-white border shadow p-4 flex flex-col items-center justify-center relative rounded-md">
                        {/* Cancel button */}
                        <button
                          onClick={handleCancel}
                          className="absolute bottom-1 right-1/2 translate-x-1/2 bg-gray-200 hover:bg-red-400 text-black p-1 rounded-full shadow"
                        >
                          <X size={18} />
                        </button>

                        {/* Car and message */}
                        <img
                          src="/assets/logo.png"
                          className="w-24 animate-carZoom mb-4"
                          alt="Car"
                        />
                        <p className="text-lg font-semibold text-gray-800 mb-4 font-michroma">
                          Choose Your Perfect Fit
                        </p>

                        {/* Fit options */}
                        <div className="grid grid-cols-2 gap-2">
                          {['Mens', 'Womens', 'Kids', 'Unisex'].map((fit) => (
                            <button
                              key={fit}
                              onClick={() => handleFitSelect(sport.name, fit)}
                              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:scale-95 transition text-sm"
                            >
                              {fit}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={startIndex + 3 >= sports.length}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
