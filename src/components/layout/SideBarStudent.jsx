import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { House, Album, CalendarDays, SwatchBook, Clock, Bot , Settings, LogOut } from 'lucide-react';


const SideBarStudent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navItems = [
    { icon: House, label: "Home", href: "/student/dashboard" },
    { icon: Album, label: "Courses", href: "/student/courses" },
    { icon: CalendarDays, label: "Schedule", href: "/student/schedule" },
    { icon: SwatchBook, label: "FlashCards", href: "/student/flashcards" },
    { icon: Clock, label: "Pomodoro", href: "/student/pomodoro" },
    { icon: Bot, label: "AI Assistant", href: "/student/al-assistant" },
  ]

  const bottomNavItems = [
    { icon: Settings, label: "Settings", href: "/auth/settings" },
    { icon: LogOut, label: "Log Out", href: "/auth/login" },
  ]

  return (
    <div className={`flex h-screen flex-col border-0 bg-white transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
      }`}>
      {/* Logo */}
      <div className="flex h-16 items-center">
        <Link to="/student/dashboard">
          <img
            src="/logo-eduspace.png"
            alt="EduSpace Logo"
            className="h-25 w-auto mt-8 ml-10"
          />
        </Link>

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 mt-10">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <li key={item.href} className="relative">
                <Link
                  to={item.href}
                  className={`flex items-center rounded-md px-3 py-2 pl-6 transition-colors ${isActive ? "bg-blue-50 text-[#1f53f3]" : "text-[#77787c] hover:bg-slate-100 hover:text-[#303345]"
                    }`}
                >
                  
                  {isActive && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-1 rounded bg-[#1f53f3]"></span>
                  )}
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom navigation */}
      <div className="border-t border-slate-200 p-4">
        <ul className="space-y-2">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <li key={item.href} className="relative">
                <Link
                  to={item.href}
                  className={`flex items-center rounded-md px-3 py-2 pl-6 transition-colors ${isActive ? "bg-blue-50 text-[#1f53f3]" : item.label === "Log Out" ? "hover:bg-red-50 hover:text-red-600 active:bg-red-100 active:text-red-700 text-slate-600" : "text-[#77787c] hover:bg-slate-100 hover:text-[#303345]"}`}
                >
                  {isActive && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-1 rounded bg-[#1f53f3]"></span>
                  )}
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>


    </div>
  )
}

export default SideBarStudent
