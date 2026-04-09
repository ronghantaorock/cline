import type { ApiProvider } from "@shared/api"

function normalizeModelId(modelId: string): string {
	return modelId.trim().toLowerCase()
}

/**
 * Filters OpenRouter model IDs based on provider-specific rules.
 * @param modelIds Array of model IDs to filter
 * @param provider The current API provider
 * @returns Filtered array of model IDs
 */
export function filterOpenRouterModelIds(modelIds: string[], provider: ApiProvider): string[] {
	// Return all models for supported providers
	return modelIds
}
