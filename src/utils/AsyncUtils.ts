export function resolveAfter<T>(timeout: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value as T), timeout))
}
