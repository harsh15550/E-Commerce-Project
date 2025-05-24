import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import HeroImg1 from '../assets/HeroSection-1.jpg';
import HeroImg2 from '../assets/HeroSection-2.jpg';
import HeroImg3 from '../assets/HeroSection-3.jpg';
import HeroImg4 from '../assets/HeroSection-4.jpg';

// Sample image URLs
const images = [HeroImg1, HeroImg2, HeroImg3, HeroImg4];

const HeaderCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const startAutoSlide = () => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => resetTimeout();
  }, [currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        mt: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '1290px',
          height: { xs: 200, sm: 300, md: 400 },
          overflow: 'hidden',
          borderRadius: 2,
          mr:2
        }}
      >
        {/* All images layered with fade transition */}
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentIndex === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentIndex === index ? 1 : 0,
            }}
          />
        ))}

        {/* Left Arrow */}
        <IconButton
          onClick={goToPrev}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 15,
            transform: 'translateY(-50%)',
            color: '#000',
            bgcolor: 'rgba(255,255,255,0.6)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
            zIndex: 2,
          }}
        >
          <ArrowBackIosNew />
        </IconButton>

        {/* Right Arrow */}
        <IconButton
          onClick={goToNext}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 15,
            transform: 'translateY(-50%)',
            color: '#000',
            bgcolor: 'rgba(255,255,255,0.6)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
            zIndex: 2,
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      {/* Dots */}
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          gap: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: index === currentIndex ? '#000' : '#ccc',
              transition: 'background-color 0.3s',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeaderCarousel;
