const fs = require('node:fs')
const path = require('node:path')
const readline = require('node:readline')

const SRC = 'C:\\Users\\User\\.config\\opencode\\opencode.jsonc'
const BACKUP_DIR = path.join(__dirname, '.opencode')
const DEST = path.join(BACKUP_DIR, 'opencode.jsonc')

function exportAction() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  fs.copyFileSync(SRC, DEST)
  console.log('Backed up opencode.jsonc')
}

function importAction() {
  fs.copyFileSync(DEST, SRC)
  console.log('Restored opencode.jsonc')
}

readline.createInterface({ input: process.stdin, output: process.stdout })
  .question('Enter 1 to backup, 2 to restore: ', (choice) => {
    ({ 1: exportAction, 2: importAction }[choice] || (() => console.log('Invalid choice.')))()
    process.exit()
  })
