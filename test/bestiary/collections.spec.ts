import { describe, expect, test } from "vitest";
import localCollection from "@typeful/storage/collection/controllers/localCollection"

describe('demo beasts', async () => {
  const beasts = (await import("../../public/api/bestiary/demo-beasts.json")).default
  const collection = localCollection(() => beasts)

  test('filter only males', () => {
    const result = collection.retrieve([
      {prop: ['general', 'sex'], op: '=', args: ['m']},
    ], [
      [['general', 'name'], 'asc'],
    ], {perPage: 5})
    expect(result.pagination?.totalItems).to.equal(28)
    const names = result.items.map((beast) => beast.general.name)
    expect(names).to.deep.equal(['Alter', 'Art', 'Bojar', 'Brok', 'Charles'])
  })
})
