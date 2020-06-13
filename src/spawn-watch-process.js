const { spawn } = require('child_process')
const { logSpawn } = require('./log')

const subProcesses = {} // subprocesses from spawnWatchProcess
const spawnWatchProcess = ({ pkgName, pkgPath }, manager = 'npm', cmds = ['run', 'watch'], logWatchOutput = true) => new Promise((resolve, reject) => {
  if (subProcesses[pkgName]) {
    // process already running
    logSpawn.info(pkgName, 'watch process is already running, skipping')
    return
  }
  logSpawn.info(pkgName, `"$ ${manager} ${cmds.join(' ')}" process spawned in "${pkgPath}"`)
  const child = spawn(manager, cmds, {
    stdio: 'pipe',
    cwd: pkgPath,
  })
  subProcesses[pkgName] = child
  if (logWatchOutput) {
    // standard info in child process
    child.stdout.on('data', data => {
      logSpawn.info(pkgName, data)
    })
    // errors thrown in child process
    child.stderr.on('data', errorData => {
      try {
        const errorText = errorData.toString().trim()
        if (errorText) {
          logSpawn.error(pkgName, errorText)
        }
      } catch (e) {
        // do not log exceptions in child error logging
      }
    })
  }
  child.on('close', code => {
    subProcesses[pkgName] = false // reset
    if (code > 0) {
      reject(new Error(`error(code: ${code}) running watch script for ${pkgName}`))
    } else {
      logSpawn.info(pkgName, `watch process has closed for ${pkgName}`)
      resolve()
    }
  })
}).catch(e => {
  logSpawn.error(pkgName, e)
})

module.exports = spawnWatchProcess
