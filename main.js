const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const readline = require('node:readline')

const SETTINGS_PATH = 'C:\\Users\\User\\scoop\\persist\\vscode\\data\\user-data\\User\\settings.json'
const VSCODE_DIR = path.join(__dirname, '.vscode')
const EXTENSIONS_PATH = path.join(VSCODE_DIR, 'extensions.json')
const SETTINGS_DEST = path.join(VSCODE_DIR, 'settings.json')

fs.mkdirSync(VSCODE_DIR, { recursive: true })

function runPowerShell(cmd) {
  const res = spawnSync('powershell', ['-NoProfile', '-Command', cmd], { encoding: 'utf8' })
  if (res.status !== 0)
    console.error(res.stderr || res.stdout)
  return res.stdout.trim().split(/\r?\n/).filter(Boolean)
}

const installExtension = ext => runPowerShell(`code --install-extension ${ext}`)

function exportAction() {
  if (fs.existsSync(SETTINGS_PATH))
    fs.copyFileSync(SETTINGS_PATH, SETTINGS_DEST)

  const exts = runPowerShell('code --list-extensions')
  fs.writeFileSync(EXTENSIONS_PATH, JSON.stringify({ recommendations: exts }, null, 2))

  console.log(`Exported settings.json and ${exts.length} extensions`)
}

function importAction() {
  if (fs.existsSync(SETTINGS_DEST)) {
    fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true })
    fs.copyFileSync(SETTINGS_DEST, SETTINGS_PATH)
  }

  if (fs.existsSync(EXTENSIONS_PATH)) {
    const { recommendations = [] } = JSON.parse(fs.readFileSync(EXTENSIONS_PATH, 'utf8'))
    recommendations.forEach((ext) => {
      console.log(`Installing ${ext} ...`)
      installExtension(ext)
    })
    console.log('Finished installing extensions')
  }
}

readline.createInterface({ input: process.stdin, output: process.stdout })
  .question('Enter 1 to export, 2 to import: ', (choice) => {
    ({ 1: exportAction, 2: importAction }[choice] || (() => console.log('Invalid choice.')))()
    process.exit()
  })
