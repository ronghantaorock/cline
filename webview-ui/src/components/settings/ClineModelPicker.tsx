import type { Mode } from "@shared/storage/types"
import React from "react"

export interface ClineModelPickerProps {
	isPopup?: boolean
	currentMode: Mode
}

// Cline provider has been removed
const ClineModelPicker: React.FC<ClineModelPickerProps> = () => {
	return null
}

export default ClineModelPicker
