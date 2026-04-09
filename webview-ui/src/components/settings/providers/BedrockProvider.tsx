import type { Mode } from "@shared/storage/types"
import React from "react"

interface BedrockProviderProps {
	currentMode: Mode
	isPopup?: boolean
	showModelOptions?: boolean
}

// Bedrock provider has been removed
const BedrockProvider: React.FC<BedrockProviderProps> = () => {
	return null
}

export default BedrockProvider
