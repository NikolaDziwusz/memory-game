"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import Select from "./Select"

interface GameFormProps {
  handleSubmit: (e: React.FormEvent) => void
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  isFirstRender: boolean
}

export default function GameForm({ handleSubmit, handleChange, isFirstRender }: GameFormProps) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only focus the form when it reappears, not on first render
    !isFirstRender && divRef.current?.focus()
  }, [isFirstRender])

  return (
    <div className="form-container bg-white p-6 rounded-lg shadow-md w-full max-w-md" ref={divRef} tabIndex={-1}>
      <p className="mb-4 text-center text-gray-700">
        Customize the game by selecting an emoji category and number of memory cards
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select handleChange={handleChange} />

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      </form>
    </div>
  )
}

