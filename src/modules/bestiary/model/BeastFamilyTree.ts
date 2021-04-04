import {Beast, EntityState} from "@/modules/bestiary/model/Bestiary"
import TreeArithmetics from "@/utils/TreeArithmetics"

export type RelationName = 'mother' | 'father'
// eslint-disable-next-line
type ForEachCallback = (beast: Beast, level: number, treeOffset: number) => any

const ancestryArithmetics = new TreeArithmetics({
  father: 0,
  mother: 1,
})

/**
 * Keeps track of ancestors of given beast
 *
 * The beasts are stored in an array representing the ancestry tree (or a branching DAG in case of common ancestors).
 * Each member has a definitive place in this array following this logic:
 * - Members of generations generations are listed in ascending order
 * - For each member of current generation, in next generation ancestors follow in order of 'mother' and 'father'
 *
 * To visualise the generations structure, consult the following index map:
 *
 * | 0: T |  1: T.M |  3: T.M.M |  7: T.M.M.M
 * |      |         |  4: T.M.F |  8: T.M.M.F
 * |      |  2: T.F |  5: T.F.M |  9: T.M.F.M
 * |      |         |  6: T.F.F | 10: T.M.F.F
 * |      |         |           | 11: T.F.M.M
 * |      |         |           | 12  T.F.M.F
 * |      |         |           | 13  T.F.F.M
 * |      |         |           | 14  T.F.F.F
 *
 */
export default class BeastFamilyTree<ES extends EntityState = 'raw'> {

  public readonly treeArithmetics: typeof ancestryArithmetics

  private readonly beasts: Beast<ES>[]
  private readonly beastsIndex: Map<Beast['id'], number>

  constructor(beast: Beast<ES>, private readonly storeState: ES) {
    this.treeArithmetics = ancestryArithmetics

    this.beasts = [beast]
    this.beastsIndex = new Map()
    this.beastsIndex.set(beast.id, 0)
  }

  public putBeastPredecessor(beast: Beast<ES>, subject: Beast<ES>, relation: RelationName): void {
    const subjectOffset = this.beastsIndex.get(subject.id)
    if (typeof subjectOffset !== "number") {
      throw new Error("Subject beast is not in the BeastFamilyTree")
    }

    const targetOffset = this.treeArithmetics.getRelativeOffset(subjectOffset, relation)

    this.putBeast(beast, targetOffset)
  }

  public hasBeast<PES extends EntityState>(beast: Beast<PES>): boolean {
    return this.beastsIndex.has(beast.id)
  }

  public getBeast(id: string): Beast<ES> | null {
    const offset = this.beastsIndex.get(id) ?? -1
    if (offset === -1) {
      return null
    }

    return this.beasts[offset]
  }

  public getBeastByPath(...path: RelationName[]): Beast<ES> | null {
    const position = this.treeArithmetics.getOffset(...path)
    return this.beasts[position]
  }

  public forEach(callback: ForEachCallback): void {
    this.beasts.forEach((beast, i) => {
      if (!beast) {
        return
      }
      const level = this.treeArithmetics.getLevel(i)
      callback(beast, level, i)
    })
  }

  public forEachPredecessors(offset: number, callback: (offset: number) => any) {
    const toWalk = [offset]

    const walkOffset = (current: number) => {
      this.treeArithmetics.linkNames.forEach((relation) => {
        const relationOffset = this.treeArithmetics.getRelativeOffset(current, relation)
        if (relationOffset < this.beasts.length) {
          callback(relationOffset)
          toWalk.push(relationOffset)
        }
      })
    }

    while (toWalk.length) {
      walkOffset(toWalk.shift()!)
    }
  }

  private putBeast<PES extends EntityState>(beast: Beast<PES>, offset: number): void {
    this.beasts[offset] = this.normalizeForStore(beast)
    if (this.beastsIndex.has(beast.id)) {
      console.warn("Beast already present in family tree", beast)
    }
    this.beastsIndex.set(beast.id, offset)
  }

  private normalizeForStore<PES extends EntityState>(beast: Beast<ES | PES>): Beast<ES> {
    if (this.isStoreReady(beast)) {
      return beast
    }

    if (this.storeState === 'raw') {
      const b = beast as Beast<'populated'>
      return {
        ...b,
        general: {...beast.general},
        lineage: {
          ...b.lineage,
          mother: b.lineage.mother?.id,
          father: b.lineage.father?.id,
        }
      } as Beast<'raw'>
    }

    throw new Error("Normalization not supported")

  }

  private isStoreReady<PES extends EntityState>(beast: Beast<ES | PES>): beast is Beast<ES> {
    if (!beast.lineage.mother && !beast.lineage.father) {
      return true
    }

    if (this.storeState === 'raw') {
      return typeof beast.lineage.mother === 'string'
    }
    if (this.storeState === "populated") {
      return typeof beast.lineage.father === 'object'
    }

    return false
  }

}
