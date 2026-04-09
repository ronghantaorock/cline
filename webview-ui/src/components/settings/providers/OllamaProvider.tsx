import type { Mode } from "@shared/storage/types"
import React from "react"

interface OllamaProviderProps {
	currentMode: Mode
	isPopup?: boolean
	showModelOptions?: boolean
}

// Ollama provider has been removed
const OllamaProvider: React.FC<OllamaProviderProps> = () => {
	return null
}

export default OllamaProvider
