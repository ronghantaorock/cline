import type { Mode } from "@shared/storage/types"
import React from "react"

export interface VercelModelPickerProps {
	isPopup?: boolean
	currentMode: Mode
}

// Vercel AI Gateway provider has been removed
const VercelModelPicker: React.FC<VercelModelPickerProps> = () => {
	return null
}

export default VercelModelPicker
