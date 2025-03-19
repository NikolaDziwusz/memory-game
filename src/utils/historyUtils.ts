export interface GameHistoryItem {
  difficulty: string
  attempts: number
  duration: number
  date: string
}

const HISTORY_KEY = "memory-game-history"

export const saveGameToHistory = (gameData: GameHistoryItem): void => {
  const history = getGameHistory()

  // Add the new game to history
  history.push(gameData)

  // Keep only the last 10 games
  const trimmedHistory = history.slice(-10)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))

  // Dispatch a storage event for multi-tab support
  window.dispatchEvent(new Event("storage"))
}

export const getGameHistory = (): GameHistoryItem[] => {
  const historyString = localStorage.getItem(HISTORY_KEY)

  if (!historyString) {
    return []
  }

  try {
    return JSON.parse(historyString)
  } catch (error) {
    console.error("Failed to parse game history:", error)
    return []
  }
}

export const clearGameHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY)
  window.dispatchEvent(new Event("storage"))
}

