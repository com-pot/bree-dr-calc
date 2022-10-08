import {inject} from "vue"
import CollectionsService from "./CollectionsService"

export * from "./Collection"

export {default as CollectionsService} from "./CollectionsService"
export {default as collectionPage} from "./partials/collectionPage"

export const useCollections = () => inject<CollectionsService>('vtf-collections')!
