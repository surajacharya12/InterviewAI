'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  HelpCircle,
  Compass,
  FileQuestion
} from 'lucide-react'

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Question', href: '/question', icon: FileQuestion },
    { name: 'Explore Interview', href: '/explore', icon: Compass },
    { name: 'How it works?', href: '/howItWorks', icon: HelpCircle },
  ]

  return (
    <header className="sticky top-0 z-50 w-[114%] bg-gray-300 dark:bg-black shadow-md backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              InterviewAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={name}
                  href={href}
                  className={`group flex items-center gap-1 font-medium transition duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  <span
                    className={`${
                      isActive ? 'underline underline-offset-4' : 'group-hover:underline underline-offset-4'
                    }`}
                  >
                    {name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* User Button + Hamburger */}
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black px-4 pb-4 pt-2 shadow-md transition-all duration-300">
          <nav className="flex flex-col space-y-4">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 font-medium transition duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
