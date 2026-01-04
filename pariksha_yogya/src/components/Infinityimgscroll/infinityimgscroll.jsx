import React, { useEffect, useRef } from 'react';

const InfinityImgScroll = () => {
  const scrollRef = useRef(null);
  
  // Images with custom dimensions for both mobile and desktop
  const images = [
    {
      src: './infinityimages/air_authority.png',
      mobileDimensions: { width: 150, height: 120 },
      desktopDimensions: { width: 200, height: 150 },
    },
    {
      src: './infinityimages/airforce.png',
      mobileDimensions: { width: 130, height: 120 }, 
      desktopDimensions: { width: 180, height: 150 },
    },
    {
      src: './infinityimages/bsf.png',
      mobileDimensions: { width: 140, height: 120 },
      desktopDimensions: { width: 190, height: 150 },
    },
    {
      src: './infinityimages/csir.png',
      mobileDimensions: { width: 160, height: 120 },
      desktopDimensions: { width: 220, height: 150 },
    },
    {
      src: './infinityimages/delhimetro.png',
      mobileDimensions: { width: 170, height: 120 },
      desktopDimensions: { width: 240, height: 150 },
    },
    {
      src: './infinityimages/railways.png',
      mobileDimensions: { width: 140, height: 120 },
      desktopDimensions: { width: 200, height: 150 },
    },
    {
      src: './infinityimages/uppolice.png',
      mobileDimensions: { width: 130, height: 120 },
      desktopDimensions: { width: 180, height: 150 },
    },
    {
      src: './infinityimages/upsc.png',
      mobileDimensions: { width: 150, height: 120 },
      desktopDimensions: { width: 210, height: 150 },
    },
  ];

  useEffect(() => {
    const scrollTrack = scrollRef.current;
    let animationId;
    let scrollPos = 0;
    
    const scroll = () => {
      // Increment scroll position
      scrollPos += 1.5;
      
      // Reset scroll position when one set of images is scrolled through
      if (scrollPos >= scrollTrack.firstChild.offsetWidth) {
        scrollPos = 0;
      }
      
      // Apply the scroll position
      scrollTrack.style.transform = `translateX(-${scrollPos}px)`;
      
      animationId = requestAnimationFrame(scroll);
    };
    
    scroll();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full py-5 overflow-x-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-gray-900">Supported Exams</h2>
      <div className="w-full overflow-hidden relative">
        <div 
          ref={scrollRef} 
          className="flex whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {/* Create multiple copies of images for seamless looping */}
          {[...Array(3)].map((_, copyIndex) => (
            <div key={`copy-${copyIndex}`} className="flex gap-5 md:gap-30 px-1 md:px-2 flex-none">
              {images.map((image, imgIndex) => (
                <div 
                  key={`img-${copyIndex}-${imgIndex}`} 
                  className="flex-none"
                  style={{
                    width: `${image.mobileDimensions.width}px`,
                    height: `${image.mobileDimensions.height}px`,
                    '@media (min-width: 768px)': {
                      width: `${image.desktopDimensions.width}px`,
                      height: `${image.desktopDimensions.height}px`,
                    }
                  }}
                >
                  <picture>
                    <source 
                      media="(min-width: 768px)" 
                      srcSet={image.src} 
                      width={image.desktopDimensions.width} 
                      height={image.desktopDimensions.height}
                    />
                    <img 
                      src={image.src} 
                      alt={`Scrolling image ${imgIndex + 1}`}
                      loading="lazy"
                      className="object-contain h-full w-full"
                      width={image.mobileDimensions.width}
                      height={image.mobileDimensions.height}
                    />
                  </picture>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfinityImgScroll;