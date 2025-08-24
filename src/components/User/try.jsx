import { motion, useMotionValue, useTransform } from "framer-motion";
import Navbar from './Navbar';
import { useRef, useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse-based rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return; // Disable 3D effect on mobile
    
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
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
      
      <div className="bg-white text-black font-sans min-h-screen">
        {/* Hero Section */}
        <section className="text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Responsive Typography */}
          <div className="mb-8 sm:mb-12">
            <p className="text-sm sm:text-lg lg:text-xl tracking-wide font-michroma leading-relaxed">
              YOUR NEXT&nbsp;
              <br className="sm:hidden" />
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
                  'CRICKET',
                  2000,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-blue-700 font-bold animate-pulse transition-all duration-500 inline-block"
              />
              <br className="sm:hidden" />
              &nbsp;UNIFORM...
            </p>
          </div>

          {/* Model Image Container */}
          <div className="relative flex justify-center items-center mb-8 sm:mb-12">
            {/* Background Strip - Responsive */}
            <motion.div
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center z-0"
            >
              <div className="w-full h-8 sm:h-12 md:h-16 lg:h-20 bg-black"></div>
            </motion.div>

            {/* Main Image - Fully Responsive */}
            <motion.img
              ref={imageRef}
              src="/assets/image.png"
              alt="Jersey Models"
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative max-w-full h-[600px] object-contain"

            />
          </div>
                  <button onClick={() => navigate('/select-sport')} className="border border-black px-6 py-2 hover:bg-black hover:text-white transition">
          Enter Our Design Studio
        </button>
      </section>

 

        {/* Footer Links - Responsive */}
        <footer className="text-center px-4 py-8 sm:py-12 lg:py-16 text-xs sm:text-sm text-gray-700">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 lg:gap-12">
            <motion.div
              whileHover={{ scale: 1.1, color: "#3b82f6" }}
              className="cursor-pointer transition-colors duration-200 font-medium hover:underline"
            >
              Our Process
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, color: "#3b82f6" }}
              className="cursor-pointer transition-colors duration-200 font-medium hover:underline"
            >
              Gallery
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, color: "#3b82f6" }}
              className="cursor-pointer transition-colors duration-200 font-medium hover:underline"
            >
              FAQ
            </motion.div>
          </div>
          
          {/* Additional Mobile-Friendly Info */}
          <div className="mt-6 sm:mt-8 text-xs text-gray-500">
            <p>Design your perfect jersey in minutes</p>
            <p className="mt-1">Professional quality • Fast delivery</p>
          </div>
        </footer>

        {/* Decorative Elements for Larger Screens */}
        <div className="hidden lg:block absolute top-20 left-10 w-2 h-20 bg-blue-700 opacity-20"></div>
        <div className="hidden lg:block absolute bottom-20 right-10 w-2 h-20 bg-blue-700 opacity-20"></div>
        <div className="hidden lg:block absolute top-1/2 left-5 w-1 h-32 bg-gray-300 transform -translate-y-1/2"></div>
        <div className="hidden lg:block absolute top-1/2 right-5 w-1 h-32 bg-gray-300 transform -translate-y-1/2"></div>
      </div>
    </>
  );
}