"use client"

import { ChevronUp } from "lucide-react"
import { useScrollToTop } from "../utils/scrollToTop"

const ScrollToTop = () => {
  const { isVisible, scrollToTop } = useScrollToTop(300)

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 flex items-center justify-center hover:scale-110 active:scale-95"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  )
}

export default ScrollToTop
