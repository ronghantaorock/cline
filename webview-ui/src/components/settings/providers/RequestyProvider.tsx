import type { Mode } from "@shared/storage/types"
import React from "react"

interface RequestyProviderProps {
	currentMode: Mode
	isPopup?: boolean
	showModelOptions?: boolean
}

// Requesty provider has been removed
const RequestyProvider: React.FC<RequestyProviderProps> = () => {
	return null
}

export default RequestyProvider
