import json
import os
import shutil
import subprocess
from pathlib import Path

DEFAULT_CODE = Path(r"C:\Users\User\scoop\apps\vscode\current\bin\code.cmd")
DEFAULT_SETTINGS = Path(
    r"C:\Users\User\scoop\persist\vscode\data\user-data\User\settings.json"
)

script_dir = Path(__file__).resolve().parent
os.chdir(script_dir)

VSCODE_DIR = script_dir / ".vscode"
VSCODE_DIR.mkdir(parents=True, exist_ok=True)


def list_extensions(code_cli: Path):
    res = subprocess.run(
        [str(code_cli), "--list-extensions"], capture_output=True, text=True
    )
    return [ln.strip() for ln in (res.stdout or "").splitlines() if ln.strip()]


def install_extension(code_cli: Path, ext: str):
    subprocess.run(
        [str(code_cli), "--install-extension", ext], capture_output=True, text=True
    )


def export_action(code_cli: Path, settings_path: Path):
    if settings_path.exists():
        shutil.copy2(settings_path, VSCODE_DIR / "settings.json")
        print("Exported settings.json")
    exts = list_extensions(code_cli)
    (VSCODE_DIR / "extensions.json").write_text(
        json.dumps({"recommendations": exts}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"Exported {len(exts)} extensions")


def import_action(code_cli: Path, settings_path: Path):
    src = VSCODE_DIR / "settings.json"
    if src.exists():
        settings_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, settings_path)
        print("Imported settings.json")
    ext_file = VSCODE_DIR / "extensions.json"
    if ext_file.exists():
        data = json.loads(ext_file.read_text(encoding="utf-8"))
        for ext in data.get("recommendations", []):
            print(f"Installing {ext} ...")
            install_extension(code_cli, ext)
        print("Finished installing extensions")


def main():
    code_cli = DEFAULT_CODE
    settings_path = DEFAULT_SETTINGS

    choice = input("Enter 1 to export, 2 to import: ").strip()
    if choice == "1":
        export_action(code_cli, settings_path)
    elif choice == "2":
        import_action(code_cli, settings_path)
    else:
        print("Invalid choice.")


if __name__ == "__main__":
    main()
