import opentype from 'opentype.js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fontPath = resolve(__dirname, '../node_modules/@fontsource/caveat/files/caveat-latin-400-normal.woff')
const fontBuffer = readFileSync(fontPath)
const font = opentype.parse(fontBuffer.buffer)

const path = font.getPath('PJS', 0, 52, 56)
const d = path.toPathData(2)

console.log('viewBox bounds:', path.getBoundingBox())
console.log('')
console.log('SVG path d:')
console.log(d)
