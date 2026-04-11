import { spawn } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import waitOn from 'wait-on'

const host = '127.0.0.1'
const cwd = process.cwd()

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function findOpenPort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.unref()
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(findOpenPort(startPort + 1))
        return
      }

      reject(error)
    })

    server.listen(startPort, host, () => {
      const address = server.address()

      server.close(() => {
        if (typeof address === 'object' && address?.port) {
          resolve(address.port)
          return
        }

        reject(new Error('Unable to determine open port for preview server.'))
      })
    })
  })
}

const port = await findOpenPort(4173)
const baseUrl = `http://${host}:${port}`

const preview = spawn(npmCommand(), ['run', 'preview', '--', '--host', host, '--port', String(port), '--strictPort'], {
  cwd,
  stdio: 'inherit',
})

let settled = false

function shutdown(code = 0) {
  if (settled) {
    return
  }

  settled = true
  preview.kill('SIGTERM')
  process.exit(code)
}

preview.on('exit', (code) => {
  if (!settled && code && code !== 0) {
    process.exit(code)
  }
})

try {
  await waitOn({
    resources: [`${baseUrl}/`],
    timeout: 30_000,
    validateStatus: (status) => status >= 200 && status < 500,
  })

  const audit = spawn(process.execPath, [path.resolve('scripts/visual-audit.mjs'), `--base-url=${baseUrl}`], {
    cwd,
    stdio: 'inherit',
  })

  audit.on('exit', (code) => shutdown(code ?? 0))
  audit.on('error', () => shutdown(1))
} catch (error) {
  console.error('Unable to start local preview for visual audit.')
  console.error(error)
  shutdown(1)
}
