const fg = require('fast-glob')
const path = require('path')

const getNodePackages = ({
  workspacePath,
  deep,
  exclude = [],
} = {}) => fg.sync(
  '**/package.json',
  {
    deep,
    absolute: true,
    cwd: workspacePath,
    ignore: ['**/node_modules', ...exclude],
  },
)

// do not alias if package.json#name is included in options.exclude
const passesExcludeCheck = ({ exclude }, pkgName, pkgPathBasename) => (
  !Array.isArray(exclude) ||
  !exclude.length ||
  (
    !~exclude.indexOf(pkgName) &&
    !~exclude.indexOf(pkgPathBasename) // caught by fast-glob#ignore only if workspacePath is parent of process.cwd()
  )
)

// do not alias if package.json#name is not included in options.include
const passesIncludeCheck = ({ include }, pkgName, pkgPathBasename) => (
  !Array.isArray(include) ||
  !include.length ||
  !!~include.indexOf(pkgName) ||
  !!~include.indexOf(pkgPathBasename)
)

// only alias watch packages if options.aliasWatchPackagesOnly
const passesWatchOnlyCheck = ({ aliasWatchPackagesOnly, watchPackages }, pkgName, pkgBasename) => (
  // aliasWatchPackagesOnly is false -> pass
  !aliasWatchPackagesOnly ||
  // watchPackages is not an object -> pass
  !(typeof watchPackages === 'object') ||
  // watchPackages is an empty object -> pass
  !Object.keys(watchPackages).length ||
  // watchPackages has key with pkgName -> pass
  watchPackages[pkgName] ||
  // watchPackages has a key with pkg basename -> pass
  watchPackages[pkgBasename]
)

const prepareWorkspaceAlias = ({
  deep = Infinity,
  workspacePath = path.resolve('..'),
  exclude,
  include,
  aliasWatchPackagesOnly, // @private
  watchPackages, // @private
  lazyMatch = true,
} = {}) => {
  const pkgPaths = getNodePackages({ workspacePath, deep, exclude })
  return pkgPaths.reduce((alias, pkgPath) => {
    const pkgPathBasename = path.basename(path.dirname(pkgPath))
    const pkgName = require(pkgPath).name
    if (
      // pkgName must pass option checks to be aliased
      passesExcludeCheck({ exclude }, pkgName, pkgPathBasename) &&
      passesIncludeCheck({ include }, pkgName, pkgPathBasename) &&
      passesWatchOnlyCheck({ aliasWatchPackagesOnly, watchPackages }, pkgName, pkgPathBasename)
    ) {
      if (!lazyMatch || !alias[pkgName]) {
        // will write over packages with multiple package.json
        alias[pkgName] = path.dirname(pkgPath)
      }
    }
    return alias
  }, {})
}

module.exports = prepareWorkspaceAlias
