/**
 * Logging utilities
 */

// User messages
const createLog = (suffix, name = 'workspace-resolver', subName = '') => (...messages) => {
  messages.forEach(message => {
    if (message instanceof Error) {
      console.log(`${suffix}\x1b[0m \x1b[2m⌈${name}${subName}\x1b[0m\x1b[2m⌋\x1b[0m`)
      console.log(message)
    } else {
      console.log(`${suffix}\x1b[0m \x1b[2m⌈${name}${subName}\x1b[0m\x1b[2m⌋\x1b[0m: ${message}\x1b[0m`)
    }
  })
}

const logParams = (obj, params = [], nest = '') => {
  const existingParams = params.filter(param => Object.prototype.hasOwnProperty.call(obj, param))
  existingParams.forEach((param, i) => {
    const endLine = params.length === i + 1 ? '' : ','
    if (obj[param]) {
      if (typeof obj[param] === 'object') {
        let startObj = '{'
        let endObj = '}'
        if (Array.isArray(obj[param])) {
          startObj = '['
          endObj = ']'
        }
        console.log(`${nest}${param}: ${startObj}`)
        logParams(obj[param], Object.keys(obj[param]), nest + '  ')
        console.log(`${nest}${endObj}${endLine}`)
      } else {
        console.log(`${nest}${param}: ${JSON.stringify(obj[param])}${endLine}`)
      }
    }
  })
  if (!nest) console.log('\n')
}

const logRequest = (request, params = logRequest.options) => logParams(request, params)
logRequest.options = [
  'context',
  'path',
  'request',
  'query',
  'directory',
  'file',
  'descriptionFilePath',
  'descriptionFileData',
  'descriptionFileRoot',
  'relativePath',
]

const logStart = (text, em = '-') => console.log(`\n\n${text}:\n${Array.from(Array(text.length + 2)).join(em)}`)

module.exports = {
  logParams,
  logRequest,
  logStart,
  error: createLog('\x1b[31m⚠︎'),
  info: createLog('\x1b[36mℹ︎'),
  logSpawn: {
    error: (subName = '', ...messages) => createLog('\x1b[31m⚠︎', 'workspace-resolver:\x1b[1m', subName)(...messages),
    info: (subName = '', ...messages) => createLog('\x1b[36mℹ︎', 'workspace-resolver:\x1b[1m', subName)(...messages),
  },
}
