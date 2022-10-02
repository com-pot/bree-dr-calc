export type FieldPathRaw = readonly string[]
export type FieldPath = FieldPathRaw & {strSafe: ReturnType<typeof pathToStr>}

export function creatPath(...parts: string[]): FieldPath {
  return Object.assign(parts, {strSafe: pathToStr(parts)})
}
export function pathToStr(path: FieldPathRaw | FieldPath): string {
  if ('strSafe' in path) {
    return path.strSafe
  }

  return path.join('_')
}
