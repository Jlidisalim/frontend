"use client";

import { useEffect } from "react";

import { useState } from "react";

// React hook for scroll to top functionality
export const useScrollToTop = (threshold = 265) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY >= threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    isVisible,
    scrollToTop,
  };
};

// Legacy scroll to top initialization
export const initScrollToTopLegacy = () => {
  const scrollBtn = document.querySelector(".scroll-top");

  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY >= 265) {
      scrollBtn.classList.add("active-scroll");
    } else {
      scrollBtn.classList.remove("active-scroll");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

// Smooth scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
};
