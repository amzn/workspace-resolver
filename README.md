# Workspace Resolver
[![npm version](https://img.shields.io/npm/v/workspace-resolver.svg?style=flat-square)](https://www.npmjs.com/package/workspace-resolver)
![License](https://img.shields.io/npm/l/workspace-resolver?style=flat-square)

Utility for development on multiple library packages in a workspace. Creates aliases for library packages so you don't have to rebuild both packages to see changes. This can be considered an alternative to [monorepos](https://github.com/lerna/lerna) and [`npm-link`](https://docs.npmjs.com/cli/link).


## Terminology

* `<app>`: Is your main application package. This package is responsible for bundling an asset for use with a server or as a static website. It imports one or more `<library>` packages.
* `<library>`: Is any of the packages that are imported by the `<app>` package. When releasing this package, it should transpile code into javascript that can be understood by the node version used in the `<app>` package (usually indicated by the `package.json#engines` property in the `<library>/package.json`).
* **workspace**: Refers the parent directory of the `<app>` and `<library>` packages.


```
└── workspace
    ├── library-1
    ├── library-2
    └── app
```


## [Basic Usage]
[Basic Usage]: #-basic-usage-

Basic usage instructions for the main 2 utilities, `spawn` and `resolve`.

### [`resolve`]
[`resolve`]: #-resolve-

Creates an object map of `<package#name>: <path-to-package-json>` that you can use in an alias configuration, such as [webpack#resolve.alias] parameter.

See the [`resolve` options] section for details for any of these options. Below are their default values. For the most part, `workspacePath`, `include` and `exclude` will likely be the ones you want to play with.

```js
import workspace from 'workspace-resolver'

workspace.resolve({
  deep: Infinity,
  exclude: [],
  include: [],
  lazyMatch: true,
  workspacePath: path.resolve('..'),
})

// {
//   'workspace-resolver': '/workspace/workspace-resolver',
//   'my-app': '/workspace/app',
// }
```

### [`spawn`]
[`spawn`]: #-spawn-

Spawns a process. See the [`spawn` options] section for details for any of these options.

```js
import workspace from 'workspace-resolver'

workspace.spawn({
  pkgName: 'workspace-resolver',
  pkgPath: path.resolve(__dirname, '..', 'WorkspaceResolver'),
}, 'npm', ['run', 'watch'])

```

### [Together]
[Together]: #-together-

If you are planning to spawn watch processes, you'll probably want to use these together:

```js
import workspace from 'workspace-resolver'

const alias = workspace.resolve({workspacePath: path.resolve(__dirname, '..')})

// Run "npm run watch" in all alias
Object.entries(alias).forEach(([pkgName, pkgPath]) => {
  workspace.spawn({ pkgName, pkgPath}, 'npm', ['run', 'watch'])
})

// Run "make build --watch" in a single alias
workspace.spawn({
  pkgName: 'workspace-resolver',
  pkgPath: alias['workspace-resolver'],
}, 'make', ['build', '--watch'])

```

## [Options]
[Options]: #-options-


### [`resolve` options]
[`resolve` options]: #-resolve-options-

| Field                | Type                   | Default                 | Description     |
| -------------------- | -----------------------|-------------------------|-----------------|
| `deep`               | `number`                 | `Infinity`            | How many directories deep to search (from `workspacePath`). If there are multiple `package.json` files in workspace, be sure to set `lazyMatch=false`. |
| `exclude`             | `[string]`               | `[]`                 | Array of glob patterns or package names to exclude. `'**/node_modules'` is always excluded. |
| `include`             | `[string]`               | `[]`                 | Array of package names that must match in order to be aliased. When specified with `exclude` or `aliasWatchPackagesOnly` all rules must pass. |
| `lazyMatch`          | `boolean`                | `true`                | Use the first matching `package.json` to indicate the alias directory for a given `package.json#name`. If `false`, matches will be greedy and the last match will be used for the `package.json#name` alias and watch path. |
| `workspacePath`      | `string`                 | `path.resolve('..')`  | Path to your workspace.  |

### [`spawn` options]
[`spawn` options]: #-spawn-

| Field                | Type                   | Default                 |  Description    |
| -------------------- | -----------------------|-------------------------|-----------------|
| `pkg.pkgName`               | `string`                 | `""`           | Npm package name (from `package.json#name` or package directory name in workspace dir) |
| `pkg.pkgPath`               | `string`                 | `""`           | Absolute path to package source root directory (the directory that contains `package.json`) |
| `manager`               | `string`                 | `"npm"`            | Executable that handles installing and packaging. |
| `args`               | `[string]`                 | `["run", "watch"]`  | Array of arguments to pass to the `manager`. |
| `logWatchProcesses`          | `boolean`                 | `true`       | Set to `false` to suppress output from watch sub processes. |


## [Common Integration Tips]
[Common Integration Tips]: #-common-integration-tips-

Below are suggested uses for integrating these utilities with other build tools. If you would like to create a plugin for any of these; 1. You are awesome! ❤️ 2. Please let us know by creating a ticket so we can reference your plugin in these docs.

* Webpack: [WorkspaceResolverWebpackPlugin] or manually with [webpack#resolve.alias]
* Rollup: [@rollup/plugin-alias](https://www.npmjs.com/package/@rollup/plugin-alias)
* TypeScript: [TypeScript alias guide](https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353)
* Babel: [babel-plugin-module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver)
* Other: [module-alias](https://www.npmjs.com/package/module-alias)

## [Contributing]
[Contributing]: #-contributing-

See [CONTRIBUTING].

## [Security]
[Security]: #-security-

See [CONTRIBUTING#security-issue-notifications](CONTRIBUTING.md#security-issue-notifications) for more information.

## [License]
[License]: #-license-

This project is licensed under the Apache-2.0 License.


[CONTRIBUTING]: CONTRIBUTING.md
[webpack#resolve.alias]: https://webpack.js.org/configuration/resolve/#resolvealias
