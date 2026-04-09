import {
	ApiConfiguration,
	ApiProvider,
	anthropicDefaultModelId,
	anthropicModels,
	claudeCodeDefaultModelId,
	claudeCodeModels,
	deepSeekDefaultModelId,
	deepSeekModels,
	geminiDefaultModelId,
	geminiModels,
	internationalQwenDefaultModelId,
	internationalQwenModels,
	ModelInfo,
	mainlandQwenDefaultModelId,
	mainlandQwenModels,
	minimaxDefaultModelId,
	minimaxModels,
	moonshotDefaultModelId,
	moonshotModels,
	openAiModelInfoSaneDefaults,
	openAiNativeDefaultModelId,
	openAiNativeModels,
	openRouterDefaultModelId,
	openRouterDefaultModelInfo,
	qwenCodeDefaultModelId,
	qwenCodeModels,
} from "@shared/api"
import { Mode } from "@shared/storage/types"
import * as reasoningSupport from "@shared/utils/reasoning-support"

export function supportsReasoningEffortForModelId(modelId?: string, _allowShortOpenAiIds = false): boolean {
	return reasoningSupport.supportsReasoningEffortForModel(modelId)
}

export function getModelsForProvider(
	provider: ApiProvider,
	apiConfiguration?: ApiConfiguration,
): Record<string, ModelInfo> | undefined {
	switch (provider) {
		case "anthropic":
			return anthropicModels
		case "claude-code":
			return claudeCodeModels
		case "gemini":
			return geminiModels
		case "openai-native":
			return openAiNativeModels
		case "deepseek":
			return deepSeekModels
		case "qwen":
			return apiConfiguration?.qwenApiLine === "china" ? mainlandQwenModels : internationalQwenModels
		case "qwen-code":
			return qwenCodeModels
		case "minimax":
			return minimaxModels
		case "moonshot":
			return moonshotModels
		case "openrouter":
		case "openai":
		case "vscode-lm":
		default:
			return undefined
	}
}

export interface NormalizedApiConfig {
	selectedProvider: ApiProvider
	selectedModelId: string
	selectedModelInfo: ModelInfo
}

export function normalizeApiConfiguration(
	apiConfiguration: ApiConfiguration | undefined,
	currentMode: Mode,
): NormalizedApiConfig {
	const provider =
		(currentMode === "plan" ? apiConfiguration?.planModeApiProvider : apiConfiguration?.actModeApiProvider) || "anthropic"

	const modelId = currentMode === "plan" ? apiConfiguration?.planModeApiModelId : apiConfiguration?.actModeApiModelId

	const getProviderData = (models: Record<string, ModelInfo>, defaultId: string) => {
		let selectedModelId: string
		let selectedModelInfo: ModelInfo
		if (modelId && modelId in models) {
			selectedModelId = modelId
			selectedModelInfo = models[modelId]
		} else {
			selectedModelId = defaultId
			selectedModelInfo = models[defaultId]
		}
		return {
			selectedProvider: provider,
			selectedModelId,
			selectedModelInfo,
		}
	}

	switch (provider) {
		case "anthropic":
			return getProviderData(anthropicModels, anthropicDefaultModelId)
		case "claude-code":
			return getProviderData(claudeCodeModels, claudeCodeDefaultModelId)
		case "gemini":
			return getProviderData(geminiModels, geminiDefaultModelId)
		case "openai-native":
			return getProviderData(openAiNativeModels, openAiNativeDefaultModelId)
		case "deepseek":
			return getProviderData(deepSeekModels, deepSeekDefaultModelId)
		case "qwen":
			const qwenModels = apiConfiguration?.qwenApiLine === "china" ? mainlandQwenModels : internationalQwenModels
			const qwenDefaultId =
				apiConfiguration?.qwenApiLine === "china" ? mainlandQwenDefaultModelId : internationalQwenDefaultModelId
			return getProviderData(qwenModels, qwenDefaultId)
		case "qwen-code":
			return getProviderData(qwenCodeModels, qwenCodeDefaultModelId)
		case "minimax":
			return getProviderData(minimaxModels, minimaxDefaultModelId)
		case "moonshot":
			return getProviderData(moonshotModels, moonshotDefaultModelId)
		case "openrouter":
			const openRouterModelId =
				currentMode === "plan" ? apiConfiguration?.planModeOpenRouterModelId : apiConfiguration?.actModeOpenRouterModelId
			const openRouterModelInfo =
				currentMode === "plan"
					? apiConfiguration?.planModeOpenRouterModelInfo
					: apiConfiguration?.actModeOpenRouterModelInfo
			return {
				selectedProvider: provider,
				selectedModelId: openRouterModelId || openRouterDefaultModelId,
				selectedModelInfo: openRouterModelInfo || openRouterDefaultModelInfo,
			}
		case "openai":
			const openAiModelId =
				currentMode === "plan" ? apiConfiguration?.planModeOpenAiModelId : apiConfiguration?.actModeOpenAiModelId
			const openAiModelInfo =
				currentMode === "plan" ? apiConfiguration?.planModeOpenAiModelInfo : apiConfiguration?.actModeOpenAiModelInfo
			return {
				selectedProvider: provider,
				selectedModelId: openAiModelId || "",
				selectedModelInfo: openAiModelInfo || openAiModelInfoSaneDefaults,
			}
		case "vscode-lm":
			const vsCodeLmModelSelector =
				currentMode === "plan"
					? apiConfiguration?.planModeVsCodeLmModelSelector
					: apiConfiguration?.actModeVsCodeLmModelSelector
			return {
				selectedProvider: provider,
				selectedModelId: vsCodeLmModelSelector ? `${vsCodeLmModelSelector.vendor}/${vsCodeLmModelSelector.family}` : "",
				selectedModelInfo: {
					...openAiModelInfoSaneDefaults,
					supportsImages: false,
				},
			}
		default:
			return getProviderData(anthropicModels, anthropicDefaultModelId)
	}
}

export function getModeSpecificFields(apiConfiguration: ApiConfiguration | undefined, mode: Mode) {
	if (!apiConfiguration) {
		return {
			apiProvider: undefined,
			apiModelId: undefined,
			openAiModelId: undefined,
			openRouterModelId: undefined,
			openAiModelInfo: undefined,
			openRouterModelInfo: undefined,
			vsCodeLmModelSelector: undefined,
			thinkingBudgetTokens: undefined,
			reasoningEffort: undefined,
		}
	}

	const openRouterModelId =
		mode === "plan" ? apiConfiguration.planModeOpenRouterModelId : apiConfiguration.actModeOpenRouterModelId
	const openRouterModelInfo =
		mode === "plan" ? apiConfiguration.planModeOpenRouterModelInfo : apiConfiguration.actModeOpenRouterModelInfo

	return {
		apiProvider: mode === "plan" ? apiConfiguration.planModeApiProvider : apiConfiguration.actModeApiProvider,
		apiModelId: mode === "plan" ? apiConfiguration.planModeApiModelId : apiConfiguration.actModeApiModelId,
		openAiModelId: mode === "plan" ? apiConfiguration.planModeOpenAiModelId : apiConfiguration.actModeOpenAiModelId,
		openRouterModelId,
		openAiModelInfo: mode === "plan" ? apiConfiguration.planModeOpenAiModelInfo : apiConfiguration.actModeOpenAiModelInfo,
		openRouterModelInfo,
		vsCodeLmModelSelector:
			mode === "plan" ? apiConfiguration.planModeVsCodeLmModelSelector : apiConfiguration.actModeVsCodeLmModelSelector,
		thinkingBudgetTokens:
			mode === "plan" ? apiConfiguration.planModeThinkingBudgetTokens : apiConfiguration.actModeThinkingBudgetTokens,
		reasoningEffort: mode === "plan" ? apiConfiguration.planModeReasoningEffort : apiConfiguration.actModeReasoningEffort,
	}
}

export async function syncModeConfigurations(
	apiConfiguration: ApiConfiguration | undefined,
	sourceMode: Mode,
	handleFieldsChange: (updates: Partial<ApiConfiguration>) => Promise<void>,
): Promise<void> {
	if (!apiConfiguration) {
		return
	}

	const sourceFields = getModeSpecificFields(apiConfiguration, sourceMode)
	const { apiProvider } = sourceFields

	if (!apiProvider) {
		return
	}

	const updates: Partial<ApiConfiguration> = {
		planModeApiProvider: sourceFields.apiProvider,
		actModeApiProvider: sourceFields.apiProvider,
		planModeThinkingBudgetTokens: sourceFields.thinkingBudgetTokens,
		actModeThinkingBudgetTokens: sourceFields.thinkingBudgetTokens,
		planModeReasoningEffort: sourceFields.reasoningEffort,
		actModeReasoningEffort: sourceFields.reasoningEffort,
	}

	switch (apiProvider) {
		case "openrouter":
			updates.planModeOpenRouterModelId = sourceFields.openRouterModelId
			updates.actModeOpenRouterModelId = sourceFields.openRouterModelId
			updates.planModeOpenRouterModelInfo = sourceFields.openRouterModelInfo
			updates.actModeOpenRouterModelInfo = sourceFields.openRouterModelInfo
			break

		case "openai":
			updates.planModeOpenAiModelId = sourceFields.openAiModelId
			updates.actModeOpenAiModelId = sourceFields.openAiModelId
			updates.planModeOpenAiModelInfo = sourceFields.openAiModelInfo
			updates.actModeOpenAiModelInfo = sourceFields.openAiModelInfo
			break

		case "vscode-lm":
			updates.planModeVsCodeLmModelSelector = sourceFields.vsCodeLmModelSelector
			updates.actModeVsCodeLmModelSelector = sourceFields.vsCodeLmModelSelector
			break

		case "anthropic":
		case "claude-code":
		case "gemini":
		case "openai-native":
		case "deepseek":
		case "qwen":
		case "qwen-code":
		case "minimax":
		case "moonshot":
		default:
			updates.planModeApiModelId = sourceFields.apiModelId
			updates.actModeApiModelId = sourceFields.apiModelId
			break
	}

	await handleFieldsChange(updates)
}

export { filterOpenRouterModelIds } from "@shared/utils/model-filters"

export const getProviderInfo = (
	provider: ApiProvider,
	apiConfiguration: any,
	effectiveMode: "plan" | "act",
): { modelId?: string; baseUrl?: string; helpText: string } => {
	switch (provider) {
		case "openai":
			return {
				modelId:
					effectiveMode === "plan" ? apiConfiguration.planModeOpenAiModelId : apiConfiguration.actModeOpenAiModelId,
				baseUrl: apiConfiguration.openAiBaseUrl,
				helpText: "Add your OpenAI API key and endpoint",
			}
		case "vscode-lm":
			return {
				modelId: undefined,
				baseUrl: undefined,
				helpText: "Select a VS Code language model from settings",
			}
		default:
			return {
				modelId: undefined,
				baseUrl: undefined,
				helpText: "Configure this provider in model settings",
			}
	}
}
