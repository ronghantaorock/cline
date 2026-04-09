import type { Mode } from "@shared/storage/types"
import React from "react"

export interface BasetenModelPickerProps {
	isPopup?: boolean
	currentMode: Mode
}

// Baseten provider has been removed
const BasetenModelPicker: React.FC<BasetenModelPickerProps> = () => {
	return null
}

export default BasetenModelPicker
