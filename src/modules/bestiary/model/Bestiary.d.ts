import {GenderType} from "@/modules/bestiary/typeful/gender.type";

type Entity<IdType extends string | number> = { id: IdType }
type EntityState = 'raw' | 'populated'

type Relation<T extends Entity, M extends EntityState> = M extends 'raw' ? typeof T.id : T


export type Beast<ES extends EntityState = 'raw', NES extends EntityState = ES> = Entity<string> & {
  general: {
    name: string,
    breedingStation?: string,
    gender?: GenderType,
    evidenceCode?: string,
    birthDay?: string,
  },
  lineage: {
    mother?: Relation<Beast<NES>, ES>,
    father?: Relation<Beast<NES>, ES>,
    wright: number,
  },
}

export type BreedingStation = Entity<string> & {
  name: string,
  country: string,
}
