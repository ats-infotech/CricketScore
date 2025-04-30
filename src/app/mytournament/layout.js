'use client'
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Tournament from "./(page)";

export default function RootLayout({ children }) {
  const path = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [path])
  
  
  return (
    <>
      <Tournament />
      {children}
      <Box className='footerBackSide'></Box>
    </>
  )
}