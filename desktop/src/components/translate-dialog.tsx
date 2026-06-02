import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalStorage } from 'usehooks-ts'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Globe, Settings, ChevronDown, ChevronUp } from 'lucide-react'
import WhisperLanguages from '~/assets/whisper-languages.json'

export interface TranslateConfig {
	platform: 'claude' | 'gemini' | 'openai'
	claudeApiKey: string
	claudeModel: string
	geminiApiKey: string
	geminiModel: string
	openaiApiKey: string
	openaiBaseUrl: string
	openaiModel: string
	systemPrompt: string
	srcLang: string
	targetLang: string
}

interface TranslateDialogProps {
	onSubmit: (srcLang: string, targetLang: string, config: TranslateConfig) => void
	loading: boolean
}

export default function TranslateDialog({ onSubmit, loading }: TranslateDialogProps) {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [apiSettingsOpen, setApiSettingsOpen] = useState(false)

	// Persisted translation configuration via local storage
	const [platform, setPlatform] = useLocalStorage<'claude' | 'gemini' | 'openai'>('prefs_translate_platform', 'openai')
	const [claudeApiKey, setClaudeApiKey] = useLocalStorage<string>('prefs_translate_claude_api_key', '')
	const [claudeModel, setClaudeModel] = useLocalStorage<string>('prefs_translate_claude_model', 'claude-3-5-sonnet-latest')
	const [geminiApiKey, setGeminiApiKey] = useLocalStorage<string>('prefs_translate_gemini_api_key', '')
	const [geminiModel, setGeminiModel] = useLocalStorage<string>('prefs_translate_gemini_model', 'gemini-2.0-flash')
	const [openaiApiKey, setOpenaiApiKey] = useLocalStorage<string>('prefs_translate_openai_api_key', '')
	const [openaiBaseUrl, setOpenaiBaseUrl] = useLocalStorage<string>('prefs_translate_openai_base_url', '')
	const [openaiModel, setOpenaiModel] = useLocalStorage<string>('prefs_translate_openai_model', 'gpt-4o-mini')
	const [systemPrompt, setSystemPrompt] = useLocalStorage<string>('prefs_translate_system_prompt', 'Translate accurately, maintaining a natural, fluent, and conversational tone.')
	const [srcLang, setSrcLang] = useLocalStorage<string>('prefs_translate_src_lang', 'auto')
	const [targetLang, setTargetLang] = useLocalStorage<string>('prefs_translate_target_lang', 'vi')

	// Prepare language entries
	const langEntries = Object.entries(WhisperLanguages).map(([name, code]) => ({
		label: t(`language.${name}`, { defaultValue: name }),
		name,
		code,
	}))
	langEntries.sort((a, b) => a.label.localeCompare(b.label))

	function handleSubmit() {
		onSubmit(srcLang, targetLang, {
			platform,
			claudeApiKey,
			claudeModel,
			geminiApiKey,
			geminiModel,
			openaiApiKey,
			openaiBaseUrl,
			openaiModel,
			systemPrompt,
			srcLang,
			targetLang,
		})
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-muted-foreground hover:text-foreground"
					disabled={loading}>
					<Globe className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg rounded-2xl border-border/60 bg-card/95 p-6 shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
				<DialogHeader className="shrink-0">
					<DialogTitle className="text-lg font-semibold flex items-center gap-2">
						<Globe className="h-5 w-5 text-primary" />
						{t('common.translate')}
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 min-h-0">
					{/* Language Selectors */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label>{t('common.source-language')}</Label>
							<Select value={srcLang} onValueChange={setSrcLang}>
								<SelectTrigger>
									<SelectValue placeholder={t('common.source-language')} />
								</SelectTrigger>
								<SelectContent>
									{langEntries.map(({ label, code }) => (
										<SelectItem key={code} value={code}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<Label>{t('common.target-language')}</Label>
							<Select value={targetLang} onValueChange={setTargetLang}>
								<SelectTrigger>
									<SelectValue placeholder={t('common.target-language')} />
								</SelectTrigger>
								<SelectContent>
									{langEntries.filter(e => e.code !== 'auto').map(({ label, code }) => (
										<SelectItem key={code} value={code}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Tone / Voice Prompt */}
					<div className="space-y-1.5">
						<Label className="flex items-center gap-1.5">
							{t('common.system-prompt')}
						</Label>
						<Textarea
							value={systemPrompt}
							onChange={(e) => setSystemPrompt(e.target.value)}
							placeholder="Ví dụ: Dịch thân mật, dịch chuyên nghiệp, dịch hài hước..."
							className="min-h-[70px] text-sm"
						/>
						<p className="text-xs text-muted-foreground">{t('common.tone-voice-info')}</p>
					</div>

					{/* Collapsible API Configurations */}
					<div className="border border-border/60 rounded-xl overflow-hidden bg-background/20">
						<button
							type="button"
							onClick={() => setApiSettingsOpen(!apiSettingsOpen)}
							className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-sm font-medium">
							<span className="flex items-center gap-2">
								<Settings className="h-4 w-4 text-muted-foreground" />
								{t('common.api-settings')}
							</span>
							{apiSettingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
						</button>

						{apiSettingsOpen && (
							<div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/40">
								<div className="space-y-1.5">
									<Label>{t('common.llm-platform')}</Label>
									<Select value={platform} onValueChange={(val) => setPlatform(val as any)}>
										<SelectTrigger className="capitalize">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="openai">OpenAI Compatible</SelectItem>
											<SelectItem value="claude">Claude</SelectItem>
											<SelectItem value="gemini">Gemini</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{platform === 'claude' && (
									<>
										<div className="space-y-1.5">
											<Label>Claude API Key</Label>
											<Input
												type="password"
												value={claudeApiKey}
												onChange={(e) => setClaudeApiKey(e.target.value)}
												placeholder="sk-ant-..."
											/>
										</div>
										<div className="space-y-1.5">
											<Label>{t('common.llm-model')}</Label>
											<Input
												type="text"
												value={claudeModel}
												onChange={(e) => setClaudeModel(e.target.value)}
												placeholder="claude-3-5-sonnet-latest"
											/>
										</div>
									</>
								)}

								{platform === 'gemini' && (
									<>
										<div className="space-y-1.5">
											<Label>Gemini API Key</Label>
											<Input
												type="password"
												value={geminiApiKey}
												onChange={(e) => setGeminiApiKey(e.target.value)}
												placeholder="AIzaSy..."
											/>
										</div>
										<div className="space-y-1.5">
											<Label>{t('common.llm-model')}</Label>
											<Input
												type="text"
												value={geminiModel}
												onChange={(e) => setGeminiModel(e.target.value)}
												placeholder="gemini-2.0-flash"
											/>
										</div>
									</>
								)}

								{platform === 'openai' && (
									<>
										<div className="space-y-1.5">
											<Label>Base URL</Label>
											<Input
												type="text"
												value={openaiBaseUrl}
												onChange={(e) => setOpenaiBaseUrl(e.target.value)}
												placeholder="https://api.openai.com/v1"
											/>
										</div>
										<div className="space-y-1.5">
											<Label>API Key</Label>
											<Input
												type="password"
												value={openaiApiKey}
												onChange={(e) => setOpenaiApiKey(e.target.value)}
												placeholder="API key (nếu cần)"
											/>
										</div>
										<div className="space-y-1.5">
											<Label>{t('common.llm-model')}</Label>
											<Input
												type="text"
												value={openaiModel}
												onChange={(e) => setOpenaiModel(e.target.value)}
												placeholder="gpt-4o-mini"
											/>
										</div>
									</>
								)}
							</div>
						)}
					</div>
				</div>

				<Button
					onMouseDown={handleSubmit}
					disabled={loading}
					className="w-full shrink-0">
					{loading ? t('common.translating') : t('common.translate')}
				</Button>
			</DialogContent>
		</Dialog>
	)
}
