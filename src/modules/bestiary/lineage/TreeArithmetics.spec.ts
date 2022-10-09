import {expect} from "chai"

import TreeArithmetics from "./TreeArithmetics";

describe("TreeArray with 2 ancestors per instance", () => {
  type RelationName = 'mother' | 'father'

  const treeArray = new TreeArithmetics({
    mother: 0,
    father: 1,
  })


  describe('find position from root', () => {
    const cases: [number, RelationName[]][] = [
      [0, []],
      [1, ['mother']],
      [2, ['father']],
      [7, ['mother', 'mother', 'mother']],
      [9, ['mother', 'father', 'mother']],
      [13, ['father', 'father', 'mother']],
    ]

    const assertPosition = (expectedIndex: number, ...path: RelationName[]) => {
      expect(treeArray.getOffset(...path)).to.equal(expectedIndex)
    }

    cases.forEach(([expectedIndex, path]) => {
      const pathStr = ['target'].concat(path).join('.')
      it('indexes ' + pathStr + ' correctly', () => assertPosition(expectedIndex, ...path))
    })
  })

  describe('find position from specified offset', () => {
    const cases: [number, RelationName[], number][] = [
      [0, ['mother'], 1],
      [1, ['father'], 4],
      [2, ['mother'], 5],
      [1, ['mother', 'father'], 8],
    ]

    const assertOffset = (expectedIndex: number, pivotOffset: number, path: RelationName[]) => {
      expect(treeArray.getRelativeOffset(pivotOffset, ...path)).to.equal(expectedIndex)
    }

    cases.forEach(([pivotOffset, path, expectedOffset]) => {
      const pathStr = [pivotOffset].concat(path as any[]).join('.')
      it('indexes ' + pathStr + ' correctly', () => assertOffset(expectedOffset, pivotOffset, path))
    })
  })

  describe('find generation number', () => {
    const cases: [number, number][] = [
      [0, 0],

      [1, 1],
      [2, 1],

      [3, 2],
      [6, 2],

      [7, 3],
      [14, 3],

      [15, 4],
    ]

    const assertGeneration = (offset: number, expectedGeneration: number) => {
      return expect(treeArray.getLevel(offset)).to.equal(expectedGeneration)
    }

    cases.forEach(([treeOffset, expectedGeneration]) => {
      it(`Identifies offset ${treeOffset}`, () => assertGeneration(treeOffset, expectedGeneration))
    })
  })
})

describe("TreeArray with single ancestor (basically a weird array)", () => {
  const treeArray = new TreeArithmetics({
    cellularPredecessor: 0,
  })
  const cases: [number, 'cellularPredecessor'[], number][] = [
    [0, ['cellularPredecessor', 'cellularPredecessor'], 2],
    [2, [], 2],
  ]
  const assertOffset = (expectedOffset: number, pivot: number, path: 'cellularPredecessor'[]) => {
    expect(treeArray.getRelativeOffset(pivot, ...path)).to.equal(expectedOffset)
  }

  cases.forEach(([pivot, path, expectedOffset]) => {
    const pathStr = [pivot].concat(path as any[]).join('.')
    it('indexes ' + pathStr + ' correctly', () => assertOffset(expectedOffset, pivot, path))
  })
})


describe("TreeArray with three ancestors ", () => {
  type Predecessor = 'wisdom' | 'strength' | 'courage'
  const treeArray = new TreeArithmetics({
    wisdom: 0,
    strength: 1,
    courage: 2,
  })

  const cases: [number, Predecessor[], number][] = [
    [0, ['wisdom', 'courage'], 6],
    [0, ['strength', 'courage'], 9],
    [0, ['courage', 'courage'], 12],
    [2, ['wisdom'], 7],
  ]
  const assertOffset = (expectedOffset: number, pivot: number, path: Predecessor[]) => {
    expect(treeArray.getRelativeOffset(pivot, ...path)).to.equal(expectedOffset)
  }

  cases.forEach(([pivot, path, expectedOffset]) => {
    const pathStr = [pivot].concat(path as any[]).join('.')
    it('indexes ' + pathStr + ' correctly', () => assertOffset(expectedOffset, pivot, path))
  })
})
