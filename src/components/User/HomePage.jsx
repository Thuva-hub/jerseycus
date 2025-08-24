import { motion, useMotionValue, useTransform } from "framer-motion";
import Navbar from './Navbar'
import { useEffect, useRef, useState } from "react";
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const [boxStyle, setBoxStyle] = useState({ top: "70%", height: "100px" });

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        const imgHeight = imageRef.current.clientHeight;

        // Position → 60% of image height
        const offset = imgHeight * 0.48;

        // Height → 20% of image height
        const dynamicHeight = imgHeight * 0.2;

        setBoxStyle({
          top: `${offset}px`,
          height: `${dynamicHeight}px`,
        });
      }
    };

    // Call on load + resize
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Mouse-based rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X within image
    const y = e.clientY - rect.top;  // Mouse Y within image
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateAmountX = ((y - centerY) / centerY) * -5;
    const rotateAmountY = ((x - centerX) / centerX) * 5;

    rotateX.set(rotateAmountX);
    rotateY.set(rotateAmountY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };


  return (
    <>
    <Navbar />
    
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="text-center py-10">
        <p className="text-lg tracking-wide font-michroma">
          YOUR NEXT&nbsp;
                  <TypeAnimation
          sequence={[
            'FOOTBALL',
            1000,
            'VOLLEYBALL',
            1000,
            'BASKETBALL',
            1000,
            'RUGBY',
            1000,
            // Final one stays
            'CRICKET',
            2000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
          className="text-blue-700 font-bold animate-pulse transition-all duration-500"
        />

        &nbsp;UNIFORM...
      </p>

        {/* Model Image */}
    <div className="flex justify-center items-end my-8 relative">
      {/* Black box (dynamic position + height) */}
      <motion.div
        initial={{ x: 500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: boxStyle.top,     // 📌 60% of image height
          left: 0,
          right: 0,
          height: boxStyle.height, // 📌 20% of image height
          background: "black",
          zIndex: 0, // பின்னால
        }}
      ></motion.div>

      {/* Image */}
      <motion.img
        ref={imageRef}
        src="/assets/image.png"
        alt="Jersey Models"
        initial={{ x: -500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative max-w-full h-[400px] sm:h-[500px] md:h-[600px] object-contain z-10"
      />
    </div>

        <button onClick={() => navigate('/select-sport')} className="border border-black px-6 py-2 hover:bg-black hover:text-white transition">
          Enter Our Design Studio
        </button>
      </section>

      {/* Footer Links */}

    </div>
     </>
  )
}
