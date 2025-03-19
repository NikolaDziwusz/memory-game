import type { Card } from "../store/gameStore"

// Total number of unique images available
const TOTAL_IMAGES = 12

export const generateCards = (count: number): Card[] => {
  // Ensure count is even
  const adjustedCount = count % 2 === 0 ? count : count + 1

  // Determine how many unique pairs we need
  const pairsCount = adjustedCount / 2

  // Generate unique image IDs for the pairs
  const imageIds = Array.from({ length: pairsCount }, (_, i) => i % TOTAL_IMAGES)

  // Create pairs of cards with the same imageId
  const cards: Card[] = []

  imageIds.forEach((imageId, index) => {
    // Create two cards with the same imageId (a pair)
    cards.push({
      id: index * 2,
      imageId,
      isFlipped: false,
      isMatched: false,
    })

    cards.push({
      id: index * 2 + 1,
      imageId,
      isFlipped: false,
      isMatched: false,
    })
  })

  // Shuffle the cards
  return shuffleArray(cards)
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray
}

