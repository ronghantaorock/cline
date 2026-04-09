import type { Mode } from "@shared/storage/types"
import React from "react"

export interface RequestyModelPickerProps {
	isPopup?: boolean
	currentMode: Mode
}

// Requesty provider has been removed
const RequestyModelPicker: React.FC<RequestyModelPickerProps> = () => {
	return null
}

export default RequestyModelPicker
