"use client"

import type React from "react"

import { useState } from "react"
import type { Difficulty } from "../../store/gameStore"
import "./DifficultySelector.css"

interface DifficultySelectorProps {
  onStart: (difficulty: Difficulty) => void
}

const difficultyInfo = {
  easy: { pairs: 6, label: "Easy (6 pairs)" },
  medium: { pairs: 9, label: "Medium (9 pairs)" },
  hard: { pairs: 12, label: "Hard (12 pairs)" },
}

const DifficultySelector = ({ onStart }: DifficultySelectorProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium")

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDifficulty(e.target.value as Difficulty)
  }

  const handleStartGame = () => {
    onStart(selectedDifficulty)
  }

  return (
    <div className="difficulty-selector">
      <div className="difficulty-selector__options">
        {(Object.keys(difficultyInfo) as Difficulty[]).map((difficulty) => (
          <label key={difficulty} className="difficulty-selector__option">
            <input
              type="radio"
              name="difficulty"
              value={difficulty}
              checked={selectedDifficulty === difficulty}
              onChange={handleDifficultyChange}
              data-testid={`difficulty-${difficulty}`}
            />
            <span className="difficulty-selector__label">{difficultyInfo[difficulty].label}</span>
          </label>
        ))}
      </div>

      <button className="difficulty-selector__button" onClick={handleStartGame} data-testid="start-game-button">
        Start Game
      </button>
    </div>
  )
}

export default DifficultySelector

