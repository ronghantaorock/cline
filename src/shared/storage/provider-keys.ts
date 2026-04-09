// Map providers to their specific model ID keys

import { Secrets, SettingsKey } from "@shared/storage/state-keys"
import {
	ApiProvider,
	anthropicDefaultModelId,
	deepSeekDefaultModelId,
	geminiDefaultModelId,
	minimaxDefaultModelId,
	moonshotDefaultModelId,
	openAiNativeDefaultModelId,
	openRouterDefaultModelId,
} from "../api"

const ProviderKeyMap: Partial<Record<ApiProvider, string>> = {
	openrouter: "OpenRouterModelId",
	openai: "OpenAiModelId",
} as const

export const ProviderToApiKeyMap: Partial<Record<ApiProvider, keyof Secrets | (keyof Secrets)[]>> = {
	anthropic: "apiKey",
	openrouter: "openRouterApiKey",
	openai: "openAiApiKey",
	gemini: "geminiApiKey",
	"openai-native": "openAiNativeApiKey",
	deepseek: "deepSeekApiKey",
	qwen: "qwenApiKey",
	"qwen-code": "qwenApiKey",
	moonshot: "moonshotApiKey",
	minimax: "minimaxApiKey",
} as const

const ProviderDefaultModelMap: Partial<Record<ApiProvider, string>> = {
	anthropic: anthropicDefaultModelId,
	openrouter: openRouterDefaultModelId,
	openai: openAiNativeDefaultModelId,
	gemini: geminiDefaultModelId,
	minimax: minimaxDefaultModelId,
	moonshot: moonshotDefaultModelId,
	deepseek: deepSeekDefaultModelId,
} as const

/**
 * Get the provider-specific model ID key for a given provider and mode.
 * Different providers store their model IDs in different state keys.
 */
export function getProviderModelIdKey(provider: ApiProvider, mode: "act" | "plan"): SettingsKey {
	const keySuffix = ProviderKeyMap[provider]
	if (keySuffix) {
		// E.g. actModeOpenAiModelId, planModeOpenAiModelId, etc.
		return `${mode}Mode${keySuffix}` as SettingsKey
	}

	// For providers without a specific key (anthropic, gemini, bedrock, etc.),
	// they use the generic actModeApiModelId/planModeApiModelId
	return `${mode}ModeApiModelId`
}

export function getProviderDefaultModelId(provider: ApiProvider): string | null {
	return ProviderDefaultModelMap[provider] || ""
}
