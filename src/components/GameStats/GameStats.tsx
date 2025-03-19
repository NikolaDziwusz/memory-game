"use client"

import { useEffect } from "react"
import { useGameStore } from "../../store/gameStore"
import { formatTime } from "../../utils/timeUtils"

const GameStats = () => {
  const { attempts, currentTime, updateTimer, isGameStarted } = useGameStore((state) => ({
    attempts: state.attempts,
    currentTime: state.currentTime,
    updateTimer: state.updateTimer,
    isGameStarted: state.isGameStarted,
  }))

  useEffect(() => {
    if (!isGameStarted) return

    const interval = setInterval(() => {
      updateTimer()
    }, 1000)

    return () => clearInterval(interval)
  }, [updateTimer, isGameStarted])

  return (
    <div className="game-stats">
      <div className="game-stats__item">
        <span className="game-stats__label">Attempts:</span>
        <span className="game-stats__value" data-testid="attempts-counter">
          {attempts}
        </span>
      </div>
      <div className="game-stats__item">
        <span className="game-stats__label">Time:</span>
        <span className="game-stats__value" data-testid="time-counter">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  )
}

export default GameStats

