/* Comment stripping utility: JS/JSX via strip-comments, CSS via strip-css-comments */
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const frontendDir = path.join(root, 'frontend')

function reqFromFrontend(mod) {
  return require(require.resolve(mod, { paths: [frontendDir] }))
}

const fg = reqFromFrontend('fast-glob')
const stripJS = reqFromFrontend('strip-comments')
const stripCSSmod = reqFromFrontend('strip-css-comments')
const stripCSS = stripCSSmod && stripCSSmod.default ? stripCSSmod.default : stripCSSmod

const patterns = [
  'frontend/**/*.{js,jsx,css}',
  'backend/**/*.js',
]

const ignore = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.vite/**',
]

;(async () => {
  const files = await fg(patterns, { cwd: root, absolute: true, ignore, dot: true })
  let changed = 0
  for (const file of files) {
    try {
      const ext = path.extname(file).toLowerCase()
      const src = fs.readFileSync(file, 'utf8')
      let out = src

      if (ext === '.css') {
        out = stripCSS(src, { preserve: false })
      } else if (ext === '.js' || ext === '.jsx') {
        // Strip standard JS comments
        out = stripJS(src)
        // Additionally strip JSX comments of the form {/* ... */}
        if (ext === '.jsx') {
          out = out.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
        }
      } else {
        continue
      }

      if (out !== src) {
        fs.writeFileSync(file, out)
        changed++
      }
    } catch (err) {
      console.error(`[strip-comments] Failed for ${file}:`, err.message)
    }
  }
  console.log(`[strip-comments] Processed ${files.length} files, modified ${changed}.`)
})()
