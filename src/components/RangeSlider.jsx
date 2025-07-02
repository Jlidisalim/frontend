/* eslint-disable no-unused-vars */
"use client"

import { useRef, useEffect } from "react"
import { useRangeSlider, formatNumber } from "../utils/rangeSlider"

const RangeSlider = ({ label, min, max, minValue, maxValue, onMinChange, onMaxChange, suffix = "" }) => {
  const rangeRef = useRef(null)

  // Use the utility hook for additional functionality if needed
  const { getPercentages } = useRangeSlider(minValue, maxValue, min, max)

  const updateRangeFill = () => {
    if (rangeRef.current) {
      const percent1 = ((minValue - min) / (max - min)) * 100
      const percent2 = ((maxValue - min) / (max - min)) * 100

      const fill = rangeRef.current.querySelector(".range-fill")
      if (fill) {
        fill.style.left = percent1 + "%"
        fill.style.width = percent2 - percent1 + "%"
      }
    }
  }

  useEffect(() => {
    updateRangeFill()
  }, [minValue, maxValue, min, max])

  const handleMinChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value <= maxValue) {
      onMinChange(value)
    }
  }

  const handleMaxChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value >= minValue) {
      onMaxChange(value)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">{label}</h4>

      <div className="relative" ref={rangeRef}>
        <div className="range-slider">
          <div className="range-fill bg-blue-600"></div>
          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMinChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
            style={{ zIndex: 1 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
            style={{ zIndex: 2 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">From:</span>
          <span className="font-medium text-gray-800">
            {formatNumber(minValue)} {suffix}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">To:</span>
          <span className="font-medium text-gray-800">
            {formatNumber(maxValue)} {suffix}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RangeSlider
