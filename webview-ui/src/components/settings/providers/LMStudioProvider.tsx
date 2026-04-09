import type { Mode } from "@shared/storage/types"
import React from "react"

interface LMStudioProviderProps {
	currentMode: Mode
	isPopup?: boolean
	showModelOptions?: boolean
}

// LM Studio provider has been removed
const LMStudioProvider: React.FC<LMStudioProviderProps> = () => {
	return null
}

export default LMStudioProvider
