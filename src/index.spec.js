const WorkspaceResolver = require('./index')

describe('WorkspaceResolver', () => {
  it('exports prepare-workspace-alias', () => {
    expect(WorkspaceResolver.resolve).toBeTruthy()
  })
  it('exports spawn-watch-process', () => {
    expect(WorkspaceResolver.spawn).toBeTruthy()
  })
})
