"use client";

import { useEffect } from "react";

import { useState } from "react";

// React hook for preloader functionality
export const usePreloader = (duration = 2500) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let hasPageLoaded = false;
    let hasTimerFinished = false;

    const tryHidePreloader = () => {
      if (hasPageLoaded && hasTimerFinished) {
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // Fade out duration
      }
    };

    // Timer for minimum display time
    const timer = setTimeout(() => {
      hasTimerFinished = true;
      tryHidePreloader();
    }, duration);

    // Page load listener
    const handleLoad = () => {
      hasPageLoaded = true;
      tryHidePreloader();
    };

    if (document.readyState === "complete") {
      hasPageLoaded = true;
      tryHidePreloader();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, [duration]);

  return { isLoading, fadeOut };
};

// Legacy preloader initialization
export const initPreloaderLegacy = () => {
  let hasPageLoaded = false;
  let hasTimerFinished = false;

  const tryFadeOutPreloader = () => {
    if (hasPageLoaded && hasTimerFinished) {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 1000);
      }
    }
  };

  setTimeout(() => {
    hasTimerFinished = true;
    tryFadeOutPreloader();
  }, 2500);

  window.addEventListener("load", () => {
    hasPageLoaded = true;
    tryFadeOutPreloader();
  });
};
