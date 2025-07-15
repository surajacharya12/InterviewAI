"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  useUser,
} from "@clerk/nextjs";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "sonner"; // ✅ Import the toaster
import Header from "./dashboard/_components/Header"; // Import Header
import { usePathname } from "next/navigation"; // Import usePathname

export const UserDetailContext = createContext();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function InnerProvider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const createOrFetchUser = async () => {
      try {
        if (!user) return;

        const res = await axios.post("/api/user", {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        });

        setUserDetail(res.data.user || null);
      } catch (err) {
        console.error("User create error:", err);
      }
    };

    createOrFetchUser();
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {/* Show Header on all pages except home page ('/') */}
      {pathname !== "/" && <Header />}
      {children}
    </UserDetailContext.Provider>
  );
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <InnerProvider>
            {children}
            <Toaster richColors position="top-right" /> {/* ✅ Toast container */}
          </InnerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
