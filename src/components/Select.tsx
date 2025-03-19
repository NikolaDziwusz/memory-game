"use client"

import type React from "react"

import Option from "./Option"

const data = {
  category: [
    { name: "Animals & Nature", value: "animals-and-nature" },
    { name: "Food & Drink", value: "food-and-drink" },
    { name: "Travel & Places", value: "travel-and-places" },
    { name: "Activities", value: "activities" },
    { name: "Objects", value: "objects" },
  ],
  number: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }, { value: 50 }],
}

interface SelectProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function Select({ handleChange }: SelectProps) {
  const selectEl = Object.entries(data).map(([key, value]) => (
    <div key={key} className="form-inner-wrapper">
      <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
        Select {key}
      </label>
      <select
        name={key}
        id={key}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <Option valueArray={value} />
      </select>
    </div>
  ))

  return <>{selectEl}</>
}

