const WorkspaceResolver = require('./index')

describe('WorkspaceResolver', () => {
  it('exports prepare-workspace-alias', () => {
    expect(WorkspaceResolver.aliases).toBeTruthy()
  })
  it('exports spawn-watch-process', () => {
    expect(WorkspaceResolver.spawnWatchProcess).toBeTruthy()
  })
})
