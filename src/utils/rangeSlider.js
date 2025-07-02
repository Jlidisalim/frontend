/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";

// React hook for range slider functionality
export const useRangeSlider = (
  initialMin = 0,
  initialMax = 2500000,
  min = 0,
  max = 2500000
) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const updateMinValue = (value) => {
    const numValue = Number.parseInt(value) || 0;
    if (numValue <= maxValue) {
      setMinValue(numValue);
    }
  };

  const updateMaxValue = (value) => {
    const numValue = Number.parseInt(value) || 0;
    if (numValue >= minValue) {
      setMaxValue(numValue);
    }
  };

  const reset = () => {
    setMinValue(min);
    setMaxValue(max);
  };

  const getPercentages = () => {
    const minPercent = ((minValue - min) / (max - min)) * 100;
    const maxPercent = ((maxValue - min) / (max - min)) * 100;
    return { minPercent, maxPercent };
  };

  return {
    minValue,
    maxValue,
    updateMinValue,
    updateMaxValue,
    reset,
    getPercentages,
  };
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

// Legacy range slider initialization
export const initRangeSliderLegacy = () => {
  const minValue = document.getElementById("min-value");
  const maxValue = document.getElementById("max-value");
  const rangeFill = document.querySelector(".range-fill");
  const resetBtn = document.querySelector("input[type='reset']");

  const validateRangePrice = () => {
    const inputElementsPrice = document.querySelectorAll(".price");
    let minPrice = Number.parseInt(inputElementsPrice[0]?.value) || 0;
    let maxPrice = Number.parseInt(inputElementsPrice[1]?.value) || 0;

    if (minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    if (minValue) minValue.innerHTML = minPrice + " TND";
    if (maxValue) maxValue.innerHTML = maxPrice + " TND";
  };

  const validateRangeSize = () => {
    const minValueSize = document.getElementById("min-value-size");
    const maxValueSize = document.getElementById("max-value-size");
    const inputElementsSize = document.querySelectorAll(".size");

    let minSize = Number.parseInt(inputElementsSize[0]?.value) || 0;
    let maxSize = Number.parseInt(inputElementsSize[1]?.value) || 0;

    if (minSize > maxSize) {
      [minSize, maxSize] = [maxSize, minSize];
    }

    if (minValueSize) minValueSize.innerHTML = minSize + " m²";
    if (maxValueSize) maxValueSize.innerHTML = maxSize + " m²";
  };

  // Price range listeners
  const inputElementsPrice = document.querySelectorAll(".price");
  inputElementsPrice.forEach((element) => {
    element.addEventListener("input", validateRangePrice);
  });

  // Size range listeners
  const inputElementsSize = document.querySelectorAll(".size");
  inputElementsSize.forEach((element) => {
    element.addEventListener("input", validateRangeSize);
  });

  // Reset functionality
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (minValue) minValue.innerHTML = "0 TND";
      if (maxValue) maxValue.innerHTML = "2500000 TND";

      const minValueSize = document.getElementById("min-value-size");
      const maxValueSize = document.getElementById("max-value-size");
      if (minValueSize) minValueSize.innerHTML = "0 m²";
      if (maxValueSize) maxValueSize.innerHTML = "2500000 m²";
    });
  }
};
