import {create} from "zustand"
import {generateCards} from "../utils/cardUtils"
import {saveGameToHistory} from "../utils/historyUtils"

export type Difficulty = "easy" | "medium" | "hard"

export interface Card {
    id: number
    imageId: number
    isFlipped: boolean
    isMatched: boolean
}

interface GameState {
    cards: Card[]
    difficulty: Difficulty
    attempts: number
    startTime: number | null
    currentTime: number
    isGameStarted: boolean
    isGameOver: boolean
    flippedCards: number[]

    // Actions
    startGame: (difficulty: Difficulty) => void
    resetGame: () => void
    flipCard: (id: number) => void
    updateTimer: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
    cards: [],
    difficulty: "medium",
    attempts: 0,
    startTime: null,
    currentTime: 0,
    isGameStarted: false,
    isGameOver: false,
    flippedCards: [],

    startGame: (difficulty: Difficulty) => {
        const cardCount = difficulty === "easy" ? 12 : difficulty === "medium" ? 18 : 24
        const cards = generateCards(cardCount)

        set({
            cards,
            difficulty,
            attempts: 0,
            startTime: Date.now(),
            currentTime: 0,
            isGameStarted: true,
            isGameOver: false,
            flippedCards: [],
        })

        // Start the timer
        const timerInterval = setInterval(() => {
            const {updateTimer, isGameOver} = get()

            if (isGameOver) {
                clearInterval(timerInterval)
                return
            }

            updateTimer()
        }, 1000)

        // Clean up timer when game is reset or completed
        return () => clearInterval(timerInterval)
    },

    resetGame: () => {
        set({
            cards: [],
            attempts: 0,
            startTime: null,
            currentTime: 0,
            isGameStarted: false,
            isGameOver: false,
            flippedCards: [],
        })
    },

    flipCard: (id: Card["id"]) => {
        const {cards, flippedCards, attempts} = get()

        // Don't allow flipping if two cards are already flipped and not matched
        if (flippedCards.length === 2) return

        // Don't allow flipping already matched or flipped cards
        const card = cards.find((c) => c.id === id)
        if (!card || card.isFlipped || card.isMatched) return

        // Flip the card
        const updatedCards = cards.map((c: Card) => (c.id === id ? {...c, isFlipped: true} : c))

        const updatedFlippedCards = [...flippedCards, id]

        set({cards: updatedCards, flippedCards: updatedFlippedCards})

        // Check for matches if two cards are flipped
        if (updatedFlippedCards.length === 2) {
            const firstCard = cards.find((c: Card) => c.id === updatedFlippedCards[0])
            const secondCard = cards.find((c: Card) => c.id === updatedFlippedCards[1])

            // Increment attempts
            set({attempts: attempts + 1})

            if (firstCard && secondCard && firstCard.imageId === secondCard.imageId) {
                // Match found
                setTimeout(() => {
                    set((state) => ({
                        cards: state.cards.map((c: Card) =>
                            c.id === firstCard.id || c.id === secondCard.id ? {...c, isMatched: true} : c,
                        ),
                        flippedCards: [],
                    }))

                    // Check if game is over
                    const {cards: updatedCards, attempts, difficulty, currentTime} = get()
                    const allMatched = updatedCards.every((c: Card) => c.isMatched)

                    if (allMatched) {
                        const gameData = {
                            difficulty,
                            attempts,
                            duration: currentTime,
                            date: new Date().toISOString(),
                        }

                        saveGameToHistory(gameData)
                        set({isGameOver: true})
                    }
                }, 1000)
            } else {
                // No match
                setTimeout(() => {
                    set((state) => ({
                        cards: state.cards.map((c: Card) => (updatedFlippedCards.includes(c.id) ? {
                            ...c,
                            isFlipped: false
                        } : c)),
                        flippedCards: [],
                    }))
                }, 1000)
            }
        }
    },

    updateTimer: () => {
        const {startTime} = get()
        if (startTime) {
            const currentTime = Math.floor((Date.now() - startTime) / 1000)
            set({currentTime})
        }
    },
}))

