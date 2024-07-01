import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes'
import { ThemeProvider } from "@/providers/theme-provider";

const Layout = ({children}:{children:React.ReactNode}) => {
  return ( 
    <ClerkProvider appearance={{
    baseTheme: dark }}>{children}</ClerkProvider>
  )
}
    export default Layout
