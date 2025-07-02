"use client";

import { useEffect } from "react";

import { useState } from "react";

// React hook for sidebar functionality
export const useSidebar = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Handle body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isMobile, isOpen]);

  return {
    isOpen,
    isMobile,
    toggle,
    open,
    close,
  };
};

// Legacy sidebar initialization
export const initSidebarLegacy = () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector(".side-bar-button");
  const closeButton = document.querySelector(".fa-xmark");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      document.body.style.cssText = "overflow-y: hidden;";
      if (sidebar) {
        sidebar.classList.add("active");
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      if (sidebar) {
        sidebar.classList.remove("active");
      }
      document.body.style.cssText = "overflow-y: visible;";
    });
  }

  // Close sidebar when clicking outside
  document.addEventListener("click", (event) => {
    if (sidebar && sidebar.classList.contains("active")) {
      if (
        !sidebar.contains(event.target) &&
        !toggleButton?.contains(event.target)
      ) {
        sidebar.classList.remove("active");
        document.body.style.cssText = "overflow-y: visible;";
      }
    }
  });
};
