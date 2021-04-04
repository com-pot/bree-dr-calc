import {ItemSourceAccessor} from "../services/ItemsSourceRegistry";

type NormalizeCallback<I, T> = (item: I) => T

type FetchingOptions<T> = {
  normalizeCollection: NormalizeCallback<T[], any[]>
}

export default function fetchingItemsSource<T>(url: string, options?: FetchingOptions<T>): ItemSourceAccessor<T> {
  return () => {
    let result = fetch(url)
      .then((response) => response.json())

    if (options && options.normalizeCollection) {
      result = result.then(options.normalizeCollection)
    }

    return result
  }
}
