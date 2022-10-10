import { CollectionController } from "../collection.types"

type NormalizeCallback<I, T> = (item: I) => T

type FetchingOptions<T> = {
  normalizeCollection: NormalizeCallback<T[], any[]>
}

export default function fetchingCollection<T>(url: string, options?: FetchingOptions<T>): CollectionController<T> {
  const retrieve = () => {
    let result = fetch(url)
      .then((response) => response.json())

    if (options && options.normalizeCollection) {
      result = result.then(options.normalizeCollection)
    }

    return result
  }

  return {
    retrieve,
  }
}