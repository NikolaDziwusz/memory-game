"use client"

import { useGameStore, type Card as CardType } from "../../store/gameStore"
import "./Card.css"

interface CardProps {
  card: CardType
}

const Card = ({ card }: CardProps) => {
  const flipCard = useGameStore((state) => state.flipCard)

  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      flipCard(card.id)
    }
  }

  return (
    <div
      className="card"
      data-flipped={card.isFlipped || card.isMatched}
      data-matched={card.isMatched}
      onClick={handleClick}
    >
      <div className="card__inner">
        <div className="card__front"></div>
        <div className="card__back">
          <div className="card__image" data-image-id={card.imageId}></div>
        </div>
      </div>
    </div>
  )
}

export default Card

