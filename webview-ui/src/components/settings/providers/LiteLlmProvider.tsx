import type { Mode } from "@shared/storage/types"
import React from "react"

interface LiteLlmProviderProps {
	currentMode: Mode
	isPopup?: boolean
	showModelOptions?: boolean
}

// LiteLLM provider has been removed
const LiteLlmProvider: React.FC<LiteLlmProviderProps> = () => {
	return null
}

export default LiteLlmProvider
