import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WebDesigner Tool',
  description: "This project aims to provide a user-friendly web-based editor for creating and designing. Whether you're looking to create rich text documents, embed media, or structure your content, this tool has got you covered.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
