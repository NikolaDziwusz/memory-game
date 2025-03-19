"use client"

import { useRef, useEffect } from "react"

interface ErrorCardProps {
  resetError: () => void
}

export default function ErrorCard({ resetError }: ErrorCardProps) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    divRef.current?.focus()
  }, [])

  return (
    <div className="bg-red-100 p-6 rounded-lg shadow-md w-full max-w-md text-center" ref={divRef} tabIndex={-1}>
      <p className="text-xl font-bold text-red-800 mb-2">Sorry, there was an error!</p>
      <p className="text-red-700 mb-4">We couldn't fetch the emoji data. Please try again.</p>

      <button
        onClick={resetError}
        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Restart Game
      </button>
    </div>
  )
}

