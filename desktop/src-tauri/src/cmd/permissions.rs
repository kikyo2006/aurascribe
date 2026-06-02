#[tauri::command]
pub async fn request_system_audio_permission() -> bool {
    true
}

#[tauri::command]
pub async fn open_system_audio_settings() {
    #[cfg(target_os = "macos")]
    {
        let _ = std::process::Command::new("open")
            .arg("x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture")
            .status();
    }
}

