"use client";

import { useState } from "react";

// React hook for pagination
export const usePagination = (items, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    goToNextPage,
    goToPrevPage,
    getPageNumbers,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// Legacy pagination initialization
export const initPaginationLegacy = (limit = 5) => {
  let thisPage = 1;
  const listProperty = document.querySelectorAll(".project-list");

  const loadItem = () => {
    const begin = (thisPage - 1) * limit;
    const end = begin + limit;

    listProperty.forEach((item, index) => {
      if (index >= begin && index < end) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });

    listPage();
  };

  const listPage = () => {
    const pageCount = Math.ceil(listProperty.length / limit);
    const listPageElement = document.querySelector(".list-page");

    if (!listPageElement) return;

    listPageElement.innerHTML = "";

    // Previous button
    if (thisPage > 1) {
      const prev = document.createElement("li");
      prev.innerHTML = "Prev";
      prev.onclick = () => changePage(thisPage - 1);
      listPageElement.appendChild(prev);
    }

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      const newPage = document.createElement("li");
      newPage.innerHTML = i;
      if (i === thisPage) {
        newPage.classList.add("active-pagination");
      }
      newPage.onclick = () => changePage(i);
      listPageElement.appendChild(newPage);
    }

    // Next button
    if (thisPage < pageCount) {
      const next = document.createElement("li");
      next.innerHTML = "Next";
      next.onclick = () => changePage(thisPage + 1);
      listPageElement.appendChild(next);
    }
  };

  const changePage = (page) => {
    thisPage = page;
    loadItem();
  };

  loadItem();

  return { loadItem, changePage };
};
