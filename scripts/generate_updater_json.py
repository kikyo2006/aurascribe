#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

def run_cmd(args):
    result = subprocess.run(args, capture_output=True, text=True, check=True)
    return result.stdout.strip()

def main():
    repo_root = Path(__file__).resolve().parent.parent
    tauri_conf_path = repo_root / "desktop" / "src-tauri" / "tauri.conf.json"
    
    # Read the version from tauri.conf.json
    with open(tauri_conf_path, "r", encoding="utf-8") as f:
        tauri_conf = json.load(f)
    
    version = tauri_conf["version"]
    tag = f"v{version}"
    repo = os.environ.get("GITHUB_REPOSITORY")
    if not repo:
        print("Error: GITHUB_REPOSITORY environment variable not set.")
        return 1
        
    print(f"Generating latest.json for release {tag} in repo {repo}...")
    
    # 1. Fetch release assets via GitHub CLI
    try:
        assets_json = run_cmd(["gh", "release", "view", tag, "--json", "assets", "--repo", repo])
    except subprocess.CalledProcessError as err:
        print(f"Error fetching release assets: {err.stderr}")
        return 1
        
    assets = json.loads(assets_json)["assets"]
    
    # Create temp directory for signatures
    temp_dir = repo_root / "temp_sigs"
    temp_dir.mkdir(exist_ok=True)
    
    # Download all signature (.sig) files
    print("Downloading signature files...")
    try:
        subprocess.run(["gh", "release", "download", tag, "--pattern", "*.sig", "--dir", str(temp_dir), "--repo", repo, "--clobber"], check=True)
    except subprocess.CalledProcessError as err:
        print(f"Error downloading signatures: {err}")
        return 1
        
    platforms = {}
    
    # Map installer assets to tauri platform keys using their signatures
    for asset in assets:
        name = asset["name"]
        # Use target release URL (e.g. releases/download/v3.0.20/...) so updater works instantly after publishing draft
        download_url = f"https://github.com/{repo}/releases/download/{tag}/{name}"
        
        if name.endswith(".sig"):
            continue
            
        sig_file = temp_dir / f"{name}.sig"
        if not sig_file.exists():
            print(f"No signature file found for {name}, skipping...")
            continue
            
        with open(sig_file, "r", encoding="utf-8") as f:
            signature = f.read().strip()
            
        # Map filenames to Tauri's update target keys
        keys = []
        if "aarch64" in name or "arm64" in name:
            if name.endswith(".app.tar.gz") or name.endswith(".dmg"):
                keys = ["darwin-aarch64", "darwin-aarch64-app"]
            elif name.endswith(".deb"):
                keys = ["linux-aarch64", "linux-aarch64-deb"]
            elif name.endswith(".rpm"):
                keys = ["linux-aarch64-rpm"]
        elif "x86_64" in name or "x64" in name or "amd64" in name:
            if name.endswith(".app.tar.gz") or name.endswith(".dmg"):
                keys = ["darwin-x86_64", "darwin-x86_64-app"]
            elif name.endswith(".exe") or name.endswith(".msi"):
                keys = ["windows-x86_64", "windows-x86_64-nsis"]
            elif name.endswith(".deb"):
                keys = ["linux-x86_64", "linux-x86_64-deb"]
            elif name.endswith(".rpm"):
                keys = ["linux-x86_64-rpm"]
                
        for key in keys:
            platforms[key] = {
                "signature": signature,
                "url": download_url
            }
            print(f"Mapped asset '{name}' to tauri platform '{key}'")
            
    if not platforms:
        print("Warning: No platforms were mapped. latest.json might be empty.")
        
    # Build final updater json structure
    updater_data = {
        "version": version,
        "notes": f"## What's New in v{version} 🚀",
        "pub_date": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "platforms": platforms
    }
    
    updater_json_path = repo_root / "latest.json"
    with open(updater_json_path, "w", encoding="utf-8") as f:
        json.dump(updater_data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated latest.json at {updater_json_path}")
    
    # 2. Upload combined latest.json back to the GitHub Release
    print("Uploading latest.json to release...")
    try:
        subprocess.run(["gh", "release", "upload", tag, str(updater_json_path), "--repo", repo, "--clobber"], check=True)
    except subprocess.CalledProcessError as err:
        print(f"Error uploading latest.json: {err}")
        return 1
        
    print("Release update finished successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
