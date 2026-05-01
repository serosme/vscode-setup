const fs = require('node:fs')
const path = require('node:path')
const readline = require('node:readline')

const ZED_DIR = 'C:\\Users\\User\\AppData\\Roaming\\Zed'
const BACKUP_DIR = path.join(__dirname, 'zed')

const FILES = ['settings.json', 'keymap.json']

function exportAction() {
  FILES.forEach((f) => {
    const src = path.join(ZED_DIR, f)
    if (fs.existsSync(src))
      fs.copyFileSync(src, path.join(BACKUP_DIR, f))
  })
  console.log('Exported settings.json and keymap.json')
}

function importAction() {
  FILES.forEach((f) => {
    const dest = path.join(ZED_DIR, f)
    const src = path.join(BACKUP_DIR, f)
    if (fs.existsSync(src)) {
      fs.mkdirSync(ZED_DIR, { recursive: true })
      fs.copyFileSync(src, dest)
    }
  })
  console.log('Imported settings.json and keymap.json')
}

readline.createInterface({ input: process.stdin, output: process.stdout })
  .question('Enter 1 to export, 2 to import: ', (choice) => {
    ({ 1: exportAction, 2: importAction }[choice] || (() => console.log('Invalid choice.')))()
    process.exit()
  })
