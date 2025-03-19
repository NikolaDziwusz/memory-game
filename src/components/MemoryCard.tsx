import EmojiButton from "./EmojiButton"

interface MemoryCardProps {
  data: any[]
  selectedCards: any[]
  matchedCards: any[]
  handleClick: (name: string, index: number) => void
}

export default function MemoryCard({ data, selectedCards, matchedCards, handleClick }: MemoryCardProps) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {data.map((emoji, index) => {
        // Check if card is selected or matched
        const selectedCardEntry = selectedCards.find((card) => card.index === index)
        const matchedCardEntry = matchedCards.find((card) => card.index === index)

        return (
          <li
            key={index}
            className={`card-item rounded-lg overflow-hidden ${
              matchedCardEntry ? "card-item-matched" : selectedCardEntry ? "card-item-selected" : ""
            }`}
          >
            <EmojiButton
              emoji={emoji}
              index={index}
              selectedCardEntry={selectedCardEntry}
              matchedCardEntry={matchedCardEntry}
              handleClick={handleClick}
            />
          </li>
        )
      })}
    </ul>
  )
}

