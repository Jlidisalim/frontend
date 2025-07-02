"use client";

import { useEffect } from "react";

import { useRef } from "react";

import { useState } from "react";

// React hook for dropdown functionality
export const useDropdown = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const dropdownRef = useRef(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    open,
    close,
    dropdownRef,
  };
};

// Legacy dropdown initialization
export const initDropdownLegacy = () => {
  const btns = document.querySelectorAll(".dropdown-button");

  btns.forEach((button) => {
    button.addEventListener("click", function () {
      const menu = this.nextElementSibling;
      if (menu && menu.classList.contains("dropdown-list")) {
        menu.classList.toggle("showlist");
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.matches(".dropdown-button")) {
      const dropdowns = document.querySelectorAll(".dropdown-list");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("showlist");
      });
    }
  });
};
