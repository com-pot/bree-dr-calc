export type DomainOptions = { [key: string]: any }
export type ItemSourceAccessor<T = any> = (search?: string, domainOptions?: DomainOptions) => T[] | Promise<T[]>

export default class ItemsSourceRegistry {
  private static instance: ItemsSourceRegistry
  private readonly registry: { [name: string]: ItemSourceAccessor }

  constructor() {
    this.registry = {}
  }

  static get singleInstance(): ItemsSourceRegistry {
    return this.instance || (this.instance = new ItemsSourceRegistry())
  }

  public registerItemsSource<T>(name: string, source: ItemSourceAccessor<T>): this {
    if (name in this.registry) {
      console.warn(`Item source '${name}' is being overwritten`)
    }
    this.registry[name] = source
    return this
  }

  public hasItemsSource(name: string): boolean {
    return name in this.registry
  }

  public getItemsSource<T>(name: string): ItemSourceAccessor<T> | undefined {
    return this.registry[name]
  }
}
