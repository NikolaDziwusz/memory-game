"use client"

import { useState, useEffect } from "react"
import { getGameHistory, type GameHistoryItem } from "@/utils/historyUtils.ts"
import { formatTime } from "@/utils/timeUtils.ts"
import "./GameHistory.css"

const GameHistory = () => {
  const [history, setHistory] = useState<GameHistoryItem[]>([])

  // Refresh history when component mounts and after each game
  useEffect(() => {
    const loadHistory = () => {
      setHistory(getGameHistory())
    }

    loadHistory()

    // Also refresh when localStorage changes (for multi-tab support)
    window.addEventListener("storage", loadHistory)

    return () => {
      window.removeEventListener("storage", loadHistory)
    }
  }, [getGameHistory()])

  if (history.length === 0) {
    return (
      <div className="game-history game-history--empty">
        <h3 className="game-history__title">Game History</h3>
        <p className="game-history__empty-message">No games played yet.</p>
      </div>
    )
  }

  return (
    <div className="game-history">
      <h3 className="game-history__title">Game History</h3>
      <div className="game-history__list">
        {history.map((game, index) => (
          <div key={index} className="game-history__item" data-testid="history-item">
            <div className="game-history__detail">
              <span className="game-history__label">Difficulty:</span>
              <span className="game-history__value">{game.difficulty}</span>
            </div>
            <div className="game-history__detail">
              <span className="game-history__label">Attempts:</span>
              <span className="game-history__value">{game.attempts}</span>
            </div>
            <div className="game-history__detail">
              <span className="game-history__label">Duration:</span>
              <span className="game-history__value">{formatTime(game.duration)}</span>
            </div>
            <div className="game-history__detail">
              <span className="game-history__label">Date:</span>
              <span className="game-history__value">{new Date(game.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameHistory

