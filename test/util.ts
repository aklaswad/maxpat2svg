import { describe, expect, it } from "vitest"
import { makeTree } from '../src/util'

describe('makeTree', () => {
  it('can build tree', () => {
    const args = [
      { path: [ 'foo', 'bar' ], item: 1 },
      { path: [ 'foo', 'baz' ], item: 2 },
      { path: [ 'fizz', 'buzz' ], item: 3 }
    ]
    const res = makeTree(args)
    expect(res).to.deep.equal([
      {
        path: 'fizz',
        nodes: [
          { path: 'buzz', item: 3 }
        ]
      },
      {
        path: 'foo',
        nodes: [
          { path: 'bar', item: 1 },
          { path: 'baz', item: 2 }
        ]
      }
    ])
  })

  it('allows to be leaf and children in same path', () => {
    const args = [
      { path: [ 'foo', 'bar' ], item: 1 },
      { path: [ 'foo', 'bar', 'baz' ], item: 2 },
    ]
    const res = makeTree(args)
    expect(res).to.deep.equal([
      {
        path: 'foo',
        nodes: [
          {
            path: 'bar',
            item: 1,
            nodes: [
              { path: 'baz', item: 2 }
            ]
          }
        ]
      }
    ])
  })
})