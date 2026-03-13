const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const readline = require("readline");

const CODE_CLI = "C:\\Users\\User\\scoop\\apps\\vscode\\current\\bin\\code.cmd";
const SETTINGS_PATH = "C:\\Users\\User\\scoop\\persist\\vscode\\data\\user-data\\User\\settings.json";
const VSCODE_DIR = path.join(__dirname, ".vscode");

if (!fs.existsSync(VSCODE_DIR)) fs.mkdirSync(VSCODE_DIR, { recursive: true });

const execPowerShell = (cmd) => {
  const res = spawnSync("powershell", ["-NoProfile", "-Command", cmd], { encoding: "utf8" });
  return res.status === 0 ? res.stdout.trim().split(/\r?\n/).filter(Boolean) : [];
};

const installExtension = (ext) => spawnSync(CODE_CLI, ["--install-extension", ext], { stdio: "ignore" });

const exportAction = () => {
  const settingsSrc = path.join(VSCODE_DIR, "settings.json");
  if (fs.existsSync(SETTINGS_PATH)) fs.copyFileSync(SETTINGS_PATH, settingsSrc);
  
  const exts = execPowerShell("code --list-extensions");
  fs.writeFileSync(
    path.join(VSCODE_DIR, "extensions.json"),
    JSON.stringify({ recommendations: exts }, null, 2)
  );
  
  console.log(`Exported settings.json and ${exts.length} extensions`);
};

const importAction = () => {
  const settingsSrc = path.join(VSCODE_DIR, "settings.json");
  if (fs.existsSync(settingsSrc)) {
    fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
    fs.copyFileSync(settingsSrc, SETTINGS_PATH);
  }

  const extFile = path.join(VSCODE_DIR, "extensions.json");
  if (fs.existsSync(extFile)) {
    const { recommendations = [] } = JSON.parse(fs.readFileSync(extFile, "utf8"));
    recommendations.forEach(ext => {
      console.log(`Installing ${ext} ...`);
      installExtension(ext);
    });
    console.log("Finished installing extensions");
  }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Enter 1 to export, 2 to import: ", choice => {
  choice === "1" ? exportAction() : choice === "2" ? importAction() : console.log("Invalid choice.");
  rl.close();
});