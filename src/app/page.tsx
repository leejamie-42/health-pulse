'use client'
import { useEffect, useState } from 'react'

import Image from "next/image";

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2x1 font-bold">Fullstack Next.js 15 + TypeScript </h1>
      <p className="mt-4 text-gray-700">API Response: {message}</p>
    </main>
  )
}
