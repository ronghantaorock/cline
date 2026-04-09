import type { Mode } from "@shared/storage/types"
import React from "react"

export interface GroqModelPickerProps {
	isPopup?: boolean
	currentMode: Mode
}

// Groq provider has been removed
const GroqModelPicker: React.FC<GroqModelPickerProps> = () => {
	return null
}

export const GROQ_MODEL_PICKER_Z_INDEX = 1_000

export default GroqModelPicker
