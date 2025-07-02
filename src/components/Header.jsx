"use client"

import { Link } from "react-router-dom"
import { Search, Menu, Send } from "lucide-react"
import Notifications from "./Notifications"
import { UserButton } from "@clerk/clerk-react" // 1. Import UserButton from Clerk

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20 w-full">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left Section - Mobile Menu + Title */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 mr-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Property</h1>
        </div>

        {/* Center Section - Search Bar */}
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Here..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Notifications />

          {/* Add Listing Button */}
          <Link
            to="/add-property"
            className="hidden lg:flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <span className="font-medium">Add Listing</span>
            <Send className="w-5 h-5" />
          </Link>

          {/* 2. Replace the placeholder div with the UserButton component */}
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  )
}

export default Header