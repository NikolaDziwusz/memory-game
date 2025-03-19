import { useGameStore } from "../../store/gameStore"
import Card from "../Card/Card"
import "./GameBoard.css"

const GameBoard = () => {
  const { cards, difficulty } = useGameStore((state) => ({
    cards: state.cards,
    difficulty: state.difficulty,
  }))

  return (
    <div className="game-board" data-difficulty={difficulty}>
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  )
}

export default GameBoard

