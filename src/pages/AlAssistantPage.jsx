import React from 'react'
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";


const AlAssistantPage = () => {
  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
    <SideBarStudent />
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <NavBar />
            <h1>Al Assistant Page</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlAssistantPage