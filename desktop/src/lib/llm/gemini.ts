import { fetch } from '@tauri-apps/plugin-http'
import { Llm, type LlmConfig } from './index'

export function defaultConfig(language = 'English'): LlmConfig {
	return {
		enabled: false,
		model: 'gemini-2.0-flash',
		platform: 'gemini',
		prompt: `Output only the requested content. No introductions, explanations, or commentary.\n\nWrite a concise summary of this transcript in ${language} using markdown. Include:\n- A short overview paragraph\n- 3-5 key takeaways as bullet points\n- Action items as a checklist if there are any\n\n"""\n%s\n"""`,
		maxTokens: 8192,
		claudeApiKey: '',
		ollamaBaseUrl: '',
		openaiBaseUrl: '',
		openaiApiKey: '',
		geminiApiKey: '',
	}
}

export class Gemini implements Llm {
	private config: LlmConfig

	constructor(config: LlmConfig) {
		this.config = config
	}

	async ask(prompt: string): Promise<string> {
		const model = this.config.model || 'gemini-2.0-flash'
		const apiKey = this.config.geminiApiKey || ''
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

		const body = JSON.stringify({
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
			generationConfig: {
				maxOutputTokens: this.config.maxTokens || 8192,
			},
		})

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		})

		if (!response.ok) {
			console.error(`Gemini request details: `, body)
			throw new Error(`Gemini: ${response.status} - ${response.statusText}`)
		}

		const data = await response.json()
		return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
	}
}
