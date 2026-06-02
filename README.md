<p align="center">
  <a target="blank" href="https://github.com/kikyo2006/aurascribe">
    <img
        width="96px"
        alt="AuraScribe logo"
        src="./design/logo.png"
    />
  </a>
</p>

<h1 align="center">AuraScribe - Transcribe on your own!</h1>

<p align="center">
  <strong>⌨️ Transcribe audio / video offline using OpenAI Whisper</strong>
  <br/>
</p>

<p align="center">
  <a target="_blank" href="https://github.com/kikyo2006/aurascribe/releases/latest">
    📥 Download AuraScribe
  </a>
  &nbsp; | &nbsp;
  <a target="_blank" href="https://github.com/kikyo2006/aurascribe">Give it a Star ⭐</a>
  &nbsp; | &nbsp;
  <a target="_blank" href="https://github.com/kikyo2006/aurascribe/issues">Report an Issue 🐛</a>
</p>

> **Forked from [Vibe](https://github.com/thewh1teagle/vibe) by [thewh1teagle](https://github.com/thewh1teagle)** — all core transcription engine credits go to the original project.

<hr />

# Features 🌟

- 🌍 Transcribe almost every language
- 🔒 Ultimate privacy: fully offline transcription, no data ever leaves your device
- 🎨 User friendly design
- 🎙️ Transcribe audio / video
- 🎶 Option to transcribe audio from popular websites (YouTube, Vimeo, Facebook, Twitter and more!)
- 📂 Batch transcribe multiple files!
- 📝 Support `SRT`, `VTT`, `TXT`, `HTML`, `PDF`, `JSON`, `DOCX` formats
- 👀 Realtime preview
- ✨ Summarize transcripts: Get quick, multilingual summaries using the Claude API
- 🧠 Ollama support: Do local AI analysis and batch summaries with Ollama
- 🌐 Translate to English from any language
- 🖨️ Print transcript directly to any printer
- 🔄 Automatic updates
- 💻 Optimized for `GPU` (`macOS`, `Windows`, `Linux`)
- 🎮 Optimized for `Nvidia` / `AMD` / `Intel` GPUs! (`Vulkan`/`CoreML`)
- 🔧 Total Freedom: Customize Models Easily via Settings
- ⚙️ Model arguments for advanced users
- ⏳ Transcribe system audio
- 🎤 Transcribe from microphone
- 🖥️ CLI support: Use AuraScribe directly from the command line interface! (see `--help`)
- 👥 Speaker diarization
- 🎬 Stable timestamps mode for subtitle/movie-grade timing (VAD-backed, slower)
- 📥 Integrate custom models from your own site
- 📹 Choose caption length optimized for videos / reels
- ⚡ HTTP API with Swagger docs! (use `--server` and open `http://<host>:3022/docs` for docs)

# Supported platforms 🖥️

`macOS`
`Windows`
`Linux`

# Getting Started 🚀

## Build from source

Get started with local development by following the guide in [docs/building.md](docs/building.md).

## Add translation 🌐

1. Copy `en` from `desktop/src-tauri/locales` folder to a new directory, e.g. `pt-BR` (use [BCP47 language code](https://gist.github.com/thewh1teagle/c8877e5c4c5e2780754ddd065ae2592e))
2. Change every value in the files there to the new language and keep the keys as is
3. Open a PR / issue on [GitHub](https://github.com/kikyo2006/aurascribe)

# Docs 📄

See [docs/](https://github.com/kikyo2006/aurascribe/tree/main/docs) for additional documentation.

# Issue Report 🐛

You can open a [new issue](https://github.com/kikyo2006/aurascribe/issues/new?assignees=kikyo2006&labels=bug&projects=&template=bug_report.yaml&title=[Short+title]) and it's recommended to check [debug.md](docs/debug.md) first.

# Privacy Policy 🔒

AuraScribe performs all transcription locally on your device. No audio, video, or transcript data is ever sent to external servers. Your privacy is fully protected.

# Credits

Thanks to [thewh1teagle/vibe](https://github.com/thewh1teagle/vibe) for the original open source project that AuraScribe is based on.

Thanks to [tauri.app](https://tauri.app/) for making the best apps framework I ever seen.

Thanks to [github.com/whisper.cpp](https://github.com/ggerganov/whisper.cpp) for outstanding interface for the AI model.

Thanks to [openai.com](https://openai.com/) for their amazing [Whisper model](https://openai.com/research/whisper).

Thanks to [github.com](https://github.com/) for their support in open source projects, providing infrastructure completely free.

And for all the amazing open source frameworks and libraries which this project uses...
