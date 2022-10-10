import BeastFamilyTree, {RelationName} from "../model/BeastFamilyTree";
import {Beast} from "../model/Bestiary";

const relations: RelationName[] = ['father', 'mother']

type BeastOccurrence = {
  tree: RelationName,
  level: number,
  treeOffset: number,
}

type TreesByRelation = { [relation: string]: BeastFamilyTree }
type PresenceMap = Map<string, BeastOccurrence[]>

export const calculateSharedPresence = (ancestryTrees: TreesByRelation): PresenceMap | null => {
  if (!ancestryTrees || relations.some((relation) => !ancestryTrees[relation])) {
    return null
  }

  const map: PresenceMap = new Map()
  const addBeast = (beast: Beast, tree: RelationName, level: number, treeOffset: number) => {
    if (!map.has(beast.id)) {
      map.set(beast.id, [])
    }
    map.get(beast.id)!.push({tree, level, treeOffset})
  }
  relations.forEach((relation) => {
    ancestryTrees[relation].forEach((beast, level, treeOffset) => addBeast(beast, relation, level, treeOffset))
  })

  return map
}

export const filterCoveredPredecessors = <T = Beast>(
  occurrences: MultiOccurrenceEntry<T>[],
  ancestryTrees: TreesByRelation
): MultiOccurrenceEntry<T>[] => {
  const coveredPositions: { [position: string]: boolean } = {}

  const markAncestorsCovered = (occurrence: BeastOccurrence): number => {
    const tree = ancestryTrees[occurrence.tree]
    let cover = 0
    tree.forEachPredecessors(occurrence.treeOffset, (offset) => {
      coveredPositions[occurrence.tree + '-' + offset] = true
      cover++
    })
    return cover

  }

  occurrences.forEach((entry) => {
    entry.occurrences.forEach(((o) => markAncestorsCovered(o)))
  })


  return occurrences.map((occurrence) => {
    const allCovered = occurrence.occurrences.every((occurrence) => {
      return coveredPositions[occurrence.tree + '-' + occurrence.treeOffset]
    })

    return {...occurrence, fullyCoveredByPredecessors: allCovered}
  })
}

export type MultiOccurrenceEntry<T = Beast> = {
  beast: T,
  occurrences: BeastOccurrence[],
  fullyCoveredByPredecessors: boolean,
}

type IdentityFn<T, TOut = T> = (item: T) => TOut

export function aggregateMultiOccurrence<TOut>(
  occurrences: Map<string, BeastOccurrence[]>,
  getBeast: IdentityFn<string, TOut>,
): MultiOccurrenceEntry<TOut>[] {

  const multiPresence: MultiOccurrenceEntry<TOut>[] = []

  occurrences.forEach((occurrences, id) => {
    if (!occurrences || occurrences.length < 2) {
      return
    }
    multiPresence.push({
      beast: getBeast(id),
      occurrences,
      fullyCoveredByPredecessors: false,
    })
  })

  return multiPresence
}

export function evaluateWrightCoefficient<T extends Beast = Beast>(input?: MultiOccurrenceEntry<T>[]): number {
  if (!input) {
    return -1
  }

  return input.reduce((sum, beastPresence) => sum + evaluateBeastOccurrences(beastPresence), 0)
}

const evaluateBeastOccurrences = <T extends Beast>(entry: MultiOccurrenceEntry<T>): number => {
  if (entry.occurrences.length < 2 || entry.fullyCoveredByPredecessors) {
    return 0
  }

  let levelCoefficient = 1
  entry.occurrences.forEach((occurrence) => levelCoefficient += occurrence.level)

  const beastWeight = 0.5 ** levelCoefficient
  const beastCoefficient = 1 + (entry.beast.lineage.wright || 0)

  return beastWeight * beastCoefficient
}
