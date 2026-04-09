import type { Mode } from "@shared/storage/types"
import React from "react"

export interface FireworksModelPickerProps {
	isPopup?: boolean
	currentMode: Mode
}

// Fireworks provider has been removed
const FireworksModelPicker: React.FC<FireworksModelPickerProps> = () => {
	return null
}

export default FireworksModelPicker
