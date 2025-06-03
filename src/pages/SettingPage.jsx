import React, { useState, useRef } from 'react'
import SideBarStudent from '@/components/layout/SideBarStudent'
import NavBar from '@/components/layout/NavBar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const mockProfile = {
  avatar: '/icons8-user-96.png',
  firstName: 'Oleg',
  lastName: 'Rakovski',
  email: 'olegrakovski@gmail.com',
  phone: '+38 098 537 09 59',
  dateOfBirth: '1995-01-16',
  city: 'Odessa, Odessa region, Ukraine',
  gender: 'male',
}

const menuItems = [
  { label: 'Profile', icon: '👤' },
  { label: 'Confidentiality', icon: '🔒' },
  { label: 'Social network', icon: '🌐' },
  { label: 'Payment', icon: '💳' },
  { label: 'Notifications', icon: '🔔' },
  { label: 'Language and region', icon: '🌍' },
  { label: 'Ask a Question', icon: '❓' },
  { label: 'Information', icon: 'ℹ️' },
]

const SettingPage = () => {
  const [profile, setProfile] = useState(mockProfile)
  const [selectedTab, setSelectedTab] = useState(0)
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (e) => {
    setProfile((prev) => ({ ...prev, gender: e.target.value }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setProfile((prev) => ({ ...prev, avatar: ev.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Nội dung từng tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-2">Profile Settings</h2>
            <div className="flex gap-8 items-start flex-wrap">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button size="sm" variant="outline" type="button" onClick={handleAvatarClick}>
                  Change
                </Button>
              </div>
              {/* Form fields */}
              <form className="flex-1 grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={profile.firstName} className="mt-1" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={profile.lastName} className="mt-1" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" value={profile.email} className="mt-1" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={profile.phone} className="mt-1" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={profile.dateOfBirth} className="mt-1" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={profile.city} className="mt-1" onChange={handleInputChange} />
                </div>
                <div className="col-span-2 flex gap-8 items-center mt-2">
                  <Label>Gender</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="gender" value="male" checked={profile.gender === 'male'} onChange={handleGenderChange} />
                      <span>male</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="gender" value="female" checked={profile.gender === 'female'} onChange={handleGenderChange} />
                      <span>female</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </>
        )
      default:
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-2">{menuItems[selectedTab].label}</h2>
            <div className="text-gray-500">This is the <b>{menuItems[selectedTab].label}</b> settings tab. (Mock content)</div>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />
            <div className="flex gap-8 mt-4">
              {/* Sidebar menu */}
              <div className="w-64 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
                {menuItems.map((item, idx) => (
                  <button
                    key={item.label}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left text-base font-medium hover:bg-blue-50 transition-colors ${selectedTab === idx ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    onClick={() => setSelectedTab(idx)}
                    type="button"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              {/* Main content */}
              <Card className="flex-1 p-8 flex flex-col gap-8 min-h-[500px]">
                {renderTabContent()}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage