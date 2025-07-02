"use client"

import { usePreloader } from "../utils/preloader"

const Preloader = () => {
  const { isLoading, fadeOut } = usePreloader(2500)

  if (!isLoading) return null

  return (
    <div className={`preloader ${fadeOut ? "fade-out" : ""}`}>
      <img src="../../public/icon.ico?height=100&width=100" alt="Logo" className="logo-preloader w-24 h-24 animate-pulse" />
      <div className="dots mt-8">
        <span className="animate-bounce"></span>
        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}></span>
        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}></span>
      </div>
    </div>
  )
}

export default Preloader
