import { Claude, deafultConfig as defaultClaudeConfig } from './claude'
import { Ollama, defaultConfig as defaultOllamaConfig } from './ollama'
import { OpenAICompatible, defaultConfig as defaultOpenAIConfig } from './openai'
import { Gemini, defaultConfig as defaultGeminiConfig } from './gemini'

export interface Llm {
	ask(prompt: string): Promise<string>
}

export interface LlmConfig {
	platform: 'ollama' | 'claude' | 'openai' | 'gemini'
	enabled: boolean
	prompt: string

	// Claude
	claudeApiKey: string
	model: string
	maxTokens?: number

	// Ollama
	ollamaBaseUrl: string

	// OpenAI Compatible
	openaiBaseUrl?: string
	openaiApiKey?: string

	// Gemini
	geminiApiKey?: string
}

export { Ollama, Claude, OpenAICompatible, Gemini, defaultClaudeConfig, defaultOllamaConfig, defaultOpenAIConfig, defaultGeminiConfig }

