"use client";

import { useEffect, useRef, useState } from "react";
import { FaAnglesUp } from "react-icons/fa6";

interface ScrollToTopProps {
  className?: string;
  size?: number;
  offset?: number;
  duration?: number;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  className = "",
  offset = 300,
  duration = 800,
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const progressPath = pathRef.current;
    const button = buttonRef.current;

    if (!progressPath || !button) return;

    // Calculate path length
    const pathLength = progressPath.getTotalLength();

    // Set initial styles for progress path
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = `${pathLength}`;
    progressPath.style.transition = "none";

    // Update progress based on scroll
    const updateProgress = () => {
      const scroll = window.pageYOffset || window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / height;

      progressPath.style.transition = "none";
      progressPath.style.strokeDashoffset = `${progress}`;
    };

    // Show/hide button based on scroll position
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset || window.scrollY;

      if (scrolled > offset) {
        if (!isVisible) {
          setIsVisible(true);
          button.style.opacity = "1";
          button.style.visibility = "visible";
          button.style.transform = "translateY(0px) scale(1)";
        }
      } else {
        if (isVisible) {
          setIsVisible(false);
          button.style.opacity = "0";
          button.style.visibility = "hidden";
          button.style.transform = "translateY(20px) scale(0.8)";
        }
      }
    };

    // Handle scroll events
    const handleScroll = () => {
      updateProgress();
      toggleVisibility();
    };

    handleScroll();

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [offset, isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className={`fixed right-6 bottom-6 z-50 group cursor-pointer opacity-0 invisible 
        w-12 h-12 rounded-full bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)] 
        flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${className}`}
      aria-label="Scroll to top"
    >
      {/* Progress Circle Container - Slightly larger than content for bordering effect */}
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
        viewBox="0 0 100 100"
      >
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="rgba(0, 125, 252, 0.1)" // Very faint blue
          strokeWidth="3"
        />
        {/* Progress Path */}
        <path
          ref={pathRef}
          d="M 50,50 m 0,-46 a 46,46 0 1,1 0,92 a 46,46 0 1,1 0,-92"
          fill="none"
          stroke="#007dfc" // Brand Blue
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: "none" }}
        />
      </svg>

      {/* Icon */}
      <FaAnglesUp
        size={18}
        className="text-brand-blue group-hover:scale-110 transition-transform duration-300"
      />
    </button>
  );
};
