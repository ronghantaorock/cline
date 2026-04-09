import type { Mode } from "@shared/storage/types"
import React from "react"

export const HICAP_MODEL_PICKER_Z_INDEX = 1_000

export interface HicapModelPickerProps {
	isPopup?: boolean
	currentMode: Mode
}

// Hicap provider has been removed
const HicapModelPicker: React.FC<HicapModelPickerProps> = () => {
	return null
}

export default HicapModelPicker
