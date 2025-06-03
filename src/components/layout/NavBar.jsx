import React, { useState } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { userData } from '../../data/mock/userData'

const NavBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    
    return (
    <div className="mb-8 flex items-center justify-between">
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search for courses, people, etc."
        className="h-10 w-full max-x-lg rounded-md border-0 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    <div className="flex items-center gap-4 pr-10">
      <button className="relative rounded-md bg-white p-2 text-slate-600 shadow-sm hover:text-blue-500">
        <Bell className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <img
          src={userData.profile.avatar || "/placeholder.svg"}
          alt={userData.profile.firstName + " " + userData.profile.lastName}
          className="h-8 w-8 rounded-md object-cover"
        />
        <span className="font-medium text-[#303345]">{userData.profile.firstName + " " + userData.profile.lastName}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  </div>
  )
}

export default NavBar