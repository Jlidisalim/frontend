// Main utility exports
export * from "./deleteProperty";
export * from "./editProperty";
export * from "./advancedSearch";
export * from "./preloader";
export * from "./pagination";
export * from "./dropdown";
export * from "./rangeSlider";
export * from "./sidebar";
export * from "./scrollToTop";

// Common utility functions
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;

    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const formatCurrency = (amount, currency = "TND") => {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-TN").format(new Date(date));
};
