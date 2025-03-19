"use client"

import { useRef, useEffect } from "react"

interface GameOverProps {
  handleClick: () => void
}

export default function GameOver({ handleClick }: GameOverProps) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    divRef.current?.focus()
  }, [])

  return (
    <div className="game-over bg-green-100 p-4 mb-6 rounded-lg text-center" ref={divRef} tabIndex={-1}>
      <p className="text-xl font-bold text-green-800 mb-4">Congratulations! You've matched all cards!</p>

      <button
        onClick={handleClick}
        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Play Again
      </button>
    </div>
  )
}

