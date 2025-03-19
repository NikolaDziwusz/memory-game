"use client"

import type React from "react"

import {useState, useEffect} from "react"
import MemoryCard from "./MemoryCard"
import GameForm from "./GameForm"
import GameOver from "./GameOver"
import AssistiveTechInfo from "./AssistiveTechInfo"
import ErrorCard from "./ErrorCard"
import {shuffleArray} from "../utils/shuffle"
import {fetchEmojis} from "../utils/api"
import GameHistory from "./GameHistory/GameHistory"

export default function MemoryGame() {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const [formData, setFormData] = useState({
        category: "animals-and-nature",
        number: 10,
    })
    const [isGameOn, setIsGameOn] = useState(false)
    const [emojisData, setEmojisData] = useState<any[]>([])
    const [selectedCards, setSelectedCards] = useState<any[]>([])
    const [matchedCards, setMatchedCards] = useState<any[]>([])
    const [allCardsMatched, setAllCardsMatched] = useState(false)
    const [isError, setIsError] = useState(false)
    const [attempts, setAttempts] = useState(0)
    const [startTime, setStartTime] = useState<number | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null

        if (isGameOn && startTime && !allCardsMatched) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
            }, 1000)
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [isGameOn, startTime, allCardsMatched])

    // Check for matches when two cards are selected
    useEffect(() => {
        if (selectedCards.length === 2) {
            // Increment attempts counter
            setAttempts((prev) => prev + 1)

            if (selectedCards[0].name === selectedCards[1].name) {
                setMatchedCards([...matchedCards, ...selectedCards])
                setSelectedCards([])
            } else {
                // Reset selection after a short delay if no match
                const timer = setTimeout(() => {
                    setSelectedCards([])
                }, 1000)
                return () => clearTimeout(timer)
            }
        }
    }, [selectedCards, matchedCards])

    // Check if all cards are matched
    useEffect(() => {
        if (emojisData.length > 0 && matchedCards.length === emojisData.length) {
            setAllCardsMatched(true)

            // Save game to localStorage
            const gameData = {
                difficulty: formData.number === 10 ? "easy" : formData.number === 20 ? "medium" : "hard",
                attempts,
                duration: elapsedTime,
                date: new Date().toISOString(),
            }

            // Get existing history or initialize empty array
            const historyString = localStorage.getItem("memory-game-history")
            const history = historyString ? JSON.parse(historyString) : []

            // Add new game and keep only last 10 games
            history.push(gameData)
            const trimmedHistory = history.slice(-10)

            // Save back to localStorage
            localStorage.setItem("memory-game-history", JSON.stringify(trimmedHistory))
        }
    }, [matchedCards, emojisData, attempts, elapsedTime, formData.number])

    const startGame = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsError(false)
        setAttempts(0)
        setStartTime(Date.now())
        setElapsedTime(0)

        try {
            const response = await fetchEmojis(formData.category)

            if (!response.ok) {
                throw new Error("Could not fetch data from API")
            }

            const data = await response.json()

            // Get random emojis
            const randomEmojis = getRandomEmojis(data, formData.number / 2)

            // Create pairs and shuffle
            const pairedEmojis = [...randomEmojis, ...randomEmojis]
            const shuffledEmojis = shuffleArray(pairedEmojis)

            setEmojisData(shuffledEmojis)
            setIsGameOn(true)
            setIsFirstRender(false)
            setMatchedCards([])
            setAllCardsMatched(false)
        } catch (error) {
            console.error(error)
            setIsError(true)
            setIsFirstRender(false)
        }
    }

    const getRandomEmojis = (data: any[], count: number) => {
        const randomIndices: number[] = []
        const dataLength = data.length

        // Generate unique random indices
        for (let i = 0; i < count; i++) {
            const randomNum = Math.floor(Math.random() * dataLength)

            if (!randomIndices.includes(randomNum)) {
                randomIndices.push(randomNum)
            } else {
                i--
            }
        }

        // Get emojis at random indices
        return randomIndices.map((index) => data[index])
    }

    const turnCard = (name: string, index: number) => {
        if (selectedCards.length < 2) {
            setSelectedCards([...selectedCards, {name, index}])
        }
    }

    const resetGame = () => {
        setIsGameOn(false)
        setSelectedCards([])
        setMatchedCards([])
        setAllCardsMatched(false)
        setAttempts(0)
        setElapsedTime(0)
        setStartTime(null)
    }

    const resetError = () => {
        setIsError(false)
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }))
    }

    // Format time for display (mm:ss)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <h1 className="text-4xl font-bold mb-8 text-center">Memory Game</h1>

            {!isGameOn && !isError && (
                <GameForm handleSubmit={startGame} handleChange={handleFormChange} isFirstRender={isFirstRender}/>
            )}

            {isError && <ErrorCard resetError={resetError}/>}

            {isGameOn && !allCardsMatched && (
                <div className="w-full max-w-md mb-4 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <span className="text-gray-700">Attempts: </span>
                            <span className="font-bold">{attempts}</span>
                        </div>
                        <div>
                            <span className="text-gray-700">Time: </span>
                            <span className="font-bold">{formatTime(elapsedTime)}</span>
                        </div>
                    </div>
                </div>
            )}

            {isGameOn && !allCardsMatched && <AssistiveTechInfo emojisData={emojisData} matchedCards={matchedCards}/>}

            {isGameOn && (
                <div className="w-full max-w-4xl">
                    {allCardsMatched && <GameOver handleClick={resetGame}/>}

                    <MemoryCard
                        data={emojisData}
                        selectedCards={selectedCards}
                        matchedCards={matchedCards}
                        handleClick={turnCard}
                    />
                </div>
            )}
            <div className="w-full max-w-4xl">
                <GameHistory/>
            </div>
        </main>
    )
}

