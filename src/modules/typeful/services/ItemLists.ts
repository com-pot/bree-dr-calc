import ItemsSourceRegistry, {DomainOptions} from "./ItemsSourceRegistry";


export default class ItemLists {
  constructor(private readonly registry: ItemsSourceRegistry) {
  }

  static get singleInstance(): ItemLists {
    return new ItemLists(ItemsSourceRegistry.singleInstance)
  }

  public fetchItems<T>(sourceName: string, search?: string, domain?: DomainOptions | string): T[] | Promise<T[]> {
    const source = this.registry.getItemsSource<T>(sourceName)
    if (!source) {
      throw new Error(`Items source '${sourceName}' does not exist`)
    }
    if (typeof domain === "string") {
      domain = ItemLists.parseDomain(domain)
    }

    return source(search, domain)
  }

  private static parseDomain(domain: string): DomainOptions {
    const parseRule = (rule: string) => {
      const eq = rule.indexOf('=')
      const name = rule.substring(0, eq)
      const value = rule.substring(eq + 1)
      return [name, value]
    }

    return Object.fromEntries(domain.split('|').map(parseRule))
  }
}
