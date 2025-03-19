"use client"

import { decode } from "html-entities"

interface EmojiButtonProps {
  emoji: any
  index: number
  selectedCardEntry: any
  matchedCardEntry: any
  handleClick: (name: string, index: number) => void
}

export default function EmojiButton({
  emoji,
  index,
  selectedCardEntry,
  matchedCardEntry,
  handleClick,
}: EmojiButtonProps) {
  // Determine button content based on card state
  const buttonContent = selectedCardEntry || matchedCardEntry ? decode(emoji.htmlCode[0]) : "?"

  // Determine aria label for accessibility
  const buttonAria = matchedCardEntry
    ? `${decode(emoji.name)}. Matched.`
    : selectedCardEntry
      ? `${decode(emoji.name)}. Not matched yet.`
      : "Card upside down."

  // Determine button style based on card state
  const buttonStyle = matchedCardEntry
    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
    : selectedCardEntry
      ? "bg-yellow-100 text-gray-800 shadow-md transform -rotate-y-180"
      : "bg-blue-500 text-white hover:bg-blue-600"

  return (
    <button
      className={`w-full h-24 text-2xl font-bold transition-all duration-300 ${buttonStyle}`}
      onClick={selectedCardEntry ? undefined : () => handleClick(emoji.name, index)}
      disabled={matchedCardEntry}
      aria-label={`Position ${index + 1}: ${buttonAria}`}
      aria-live="polite"
      tabIndex={matchedCardEntry ? -1 : 0}
    >
      {buttonContent}
    </button>
  )
}

