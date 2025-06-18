import React, { useState,useEffect, useRef } from 'react'
import SideBarStudent from '@/components/layout/SideBarStudent'
import SideBarTeacher from '@/components/layout/SideBarTeacher'
import NavBar from '@/components/layout/NavBar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { userData } from '@/data/mock/userData'
import { Facebook, Github, CircleUser, Mail, Bell, Globe, MapPin, User, Lock, Share2, Trash2 } from 'lucide-react'
import { FcGoogle } from "react-icons/fc"
import { useAuth } from '@/context/AuthContext'
import { userAPI } from '@/api'
import { toast } from 'sonner'

const menuItems = [
  { label: 'Profile', icon: <User className="w-5 h-5" /> },
  { label: 'Confidentiality', icon: <Lock className="w-5 h-5" /> },
  { label: 'Social network', icon: <Share2 className="w-5 h-5" /> },
  { label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { label: 'Language and region', icon: <Globe className="w-5 h-5" /> },
  { label: 'Delete Account', icon: <Trash2 className="w-5 h-5" /> },
]

const SettingPage = () => {
  const { userRole, setUser: setAuthUser } = useAuth();
  const [profile, setProfile] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    dateOfBirth: "",
    gender: "",
  })
  const [selectedTab, setSelectedTab] = useState(0)
  const fileInputRef = useRef(null)
  const [linkedAccounts, setLinkedAccounts] = useState({
    google: false,
    facebook: true,
    github: false,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    web: false,
  });
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAPI.getUser()
        setAuthUser(res.data)
        setProfile({
          avatar: res.data.avatar || "",
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.slice(0,10) : "",
          gender: res.data.gender || "",
        })
      } catch (error) {
        setError(error)
      }
    }
    fetchUser()
  }, [])

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

  const handleToggleLink = (provider) => {
    setLinkedAccounts((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleToggleNotification = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      const updatePayload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        city: profile.city,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
      }
      const res = await userAPI.updateUser(updatePayload)
      const updatedUser = res.data;
      // If backend returns date including time, normalize for input
      if(updatedUser?.dateOfBirth){
         updatedUser.dateOfBirth = updatedUser.dateOfBirth.slice(0,10);
      }
      toast.success("Profile updated successfully")
      setProfile((prev) => ({ ...prev, ...updatedUser }))
      setAuthUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      // Reload the page so that every component picks up new user info
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update profile"
      toast.error(message)
    }
  }

  // Nội dung từng tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-blue-600"><User className="w-6 h-6 text-blue-600" /> Profile</h2>
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
              <form className="flex-1 grid grid-cols-2 gap-6" onSubmit={handleSaveProfile}>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={profile.firstName} className="mt-1 bg-white w-full border-0" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={profile.lastName} className="mt-1 bg-white w-full border-0" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" value={profile.email} className="mt-1 bg-white w-full border-0" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={profile.phone} className="mt-1 bg-white w-full border-0" onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    className="mt-1 bg-white w-full border-0"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={profile.city} className="mt-1 bg-white w-full border-0" onChange={handleInputChange} />
                </div>
                <div className="col-span-2 flex gap-8 items-center mt-2">
                  <Label>Gender</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={profile.gender === 'male'}
                        onChange={handleGenderChange}
                        className="sr-only"
                      />
                      <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors bg-white ${profile.gender === 'male' ? 'border-blue-600' : 'border-blue-300'}`}>
                        {profile.gender === 'male' && <span className="w-4 h-4 rounded bg-blue-600 block"></span>}
                      </span>
                      <span>male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={profile.gender === 'female'}
                        onChange={handleGenderChange}
                        className="sr-only"
                      />
                      <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors bg-white ${profile.gender === 'female' ? 'border-blue-600' : 'border-blue-300'}`}>
                        {profile.gender === 'female' && <span className="w-4 h-4 rounded bg-blue-600 block"></span>}
                      </span>
                      <span>female</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </>
        )
      case 1:
        // Confidentiality
        return (
          <div className="max-w-lg w-full flex flex-col gap-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-blue-600"><Lock className="w-6 h-6 text-blue-600" /> Confidentiality</h2>
            <form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input id="oldPassword" name="oldPassword" type="password" className="mt-1 bg-white w-full border-0" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" className="mt-1 bg-white w-full border-0" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" className="mt-1 bg-white w-full border-0" />
              </div>
              <Button type="submit" className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg mt-2 shadow">Save</Button>
            </form>
            
          </div>
        )
      case 2:
        // Social network
        return (
          <div className="max-w-lg w-full flex flex-col gap-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-blue-600"><Share2 className="w-6 h-6 text-blue-600" /> Social network</h2>
            <div className="flex flex-col gap-4">
              {/* Google */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm">
                <span className="flex items-center gap-2">
                  <FcGoogle className="w-6 h-6 text-red-500" />
                  Google
                </span>
                {linkedAccounts.google ? (
                  <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={() => handleToggleLink('google')}>
                    Unlink
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" onClick={() => handleToggleLink('google')}>
                    Link
                  </Button>
                )}
              </div>
              {/* Facebook */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm">
                <span className="flex items-center gap-2">
                  <Facebook className="w-6 h-6 text-blue-600" />
                  Facebook
                </span>
                {linkedAccounts.facebook ? (
                  <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={() => handleToggleLink('facebook')}>
                    Unlink
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" onClick={() => handleToggleLink('facebook')}>
                    Link
                  </Button>
                )}
              </div>
              {/* Github */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm">
                <span className="flex items-center gap-2">
                  <Github className="w-6 h-6 text-gray-800" />
                  Github
                </span>
                {linkedAccounts.github ? (
                  <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={() => handleToggleLink('github')}>
                    Unlink
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" onClick={() => handleToggleLink('github')}>
                    Link
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      case 3:
        // Notifications
        return (
          <div className="max-w-lg w-full flex flex-col gap-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-blue-600"><Bell className="w-6 h-6 text-blue-600" /> Notifications</h2>
            <div className="flex flex-col gap-6">
              {/* Email notification */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <Mail className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium">Email notifications</div>
                  <div className="text-gray-400 text-sm">Get important updates via email.</div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleToggleNotification('email')}
                >
                  <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors bg-white ${notifications.email ? 'border-blue-600' : 'border-blue-300'}`}>
                    {notifications.email && <span className="w-4 h-4 rounded bg-blue-600 block"></span>}
                  </span>
                </button>
              </div>
              {/* Web notification */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <Bell className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium">Web notifications</div>
                  <div className="text-gray-400 text-sm">Receive notifications directly on the website.</div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleToggleNotification('web')}
                >
                  <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors bg-white ${notifications.web ? 'border-blue-600' : 'border-blue-300'}`}>
                    {notifications.web && <span className="w-4 h-4 rounded bg-blue-600 block"></span>}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )
      case 4:
        // Language and region
        return (
          <div className="max-w-lg w-full flex flex-col gap-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-blue-600"><Globe className="w-6 h-6 text-blue-600" /> Language and region</h2>
            <div className="flex flex-col gap-6">
              {/* Language */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <Globe className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium">Language</div>
                  <div className="text-gray-400 text-sm">Choose your preferred language for the interface.</div>
                </div>
                <select id="language" className="bg-blue-50 border border-blue-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                  <option>English</option>
                  <option>Vietnamese</option>
                  <option>Japanese</option>
                </select>
              </div>
              {/* Region */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <MapPin className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium">Region</div>
                  <div className="text-gray-400 text-sm">Set your time zone and region for accurate time display.</div>
                </div>
                <select id="region" className="bg-blue-50 border border-blue-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
                  <option>Asia/Ho_Chi_Minh</option>
                  <option>Asia/Tokyo</option>
                  <option>Europe/London</option>
                </select>
              </div>
            </div>
          </div>
        )
      case 5:
        // Delete Account
        return (
          <div className="max-w-lg w-full flex flex-col gap-6">
            <h2 className="text-2xl font-semibold mb-2 text-red-600 flex items-center gap-2"><Trash2 className="w-6 h-6 text-red-600" /> Delete Account</h2>
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <div className="font-semibold mb-1">Warning!</div>
              <div>
                Deleting your account is <b>permanent</b> and cannot be undone.<br />
                All your data will be lost. Please be sure before you continue.
              </div>
            </div>
            <button
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-6 py-2 shadow transition"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Your account would be deleted (mock).');
                }
              }}
            >
              Delete Account
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      {userRole === 'teacher' ? <SideBarTeacher /> : <SideBarStudent />}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#303345]">Settings</h1>
                </div>
            <div className="flex gap-8 mt-4">
              {/* Sidebar menu */}
              <div className="w-64 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
                {menuItems.map((item, idx) => (
                  <button
                    key={item.label}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left text-base  hover:bg-blue-50 transition-colors ${selectedTab === idx ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                    onClick={() => setSelectedTab(idx)}
                    type="button"
                  >
                    <span className={selectedTab === idx ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
                    <span className={selectedTab === idx ? 'text-blue-600' : 'text-gray-400'}>{item.label}</span>
                  </button>
                ))}
              </div>
              {/* Main content */}
              <div className="flex-1 p-8 flex flex-col gap-8 min-h-[500px]">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage