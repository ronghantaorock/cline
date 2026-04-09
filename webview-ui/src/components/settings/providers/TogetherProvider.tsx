import type { Mode } from "@shared/storage/types"
import React from "react"

interface TogetherProviderProps {
	currentMode: Mode
	isPopup?: boolean
	showModelOptions?: boolean
}

// Together provider has been removed
const TogetherProvider: React.FC<TogetherProviderProps> = () => {
	return null
}

export default TogetherProvider
