type LinkOffsetSpec<T extends object> = { [key in keyof T]: number }
type TreeOffset = number
type TreeLevel = number

const optimizedLevelChunkStart: { [link: number]: (level: TreeLevel) => TreeOffset } = {
  1: (l) => l,
  2: (l) => 2 ** l - 1,
}

export default class TreeArithmetics<R extends object, K extends keyof R> {
  private readonly linkCount: number

  constructor(private readonly linkOffsets: LinkOffsetSpec<R>) {
    this.linkCount = Object.keys(linkOffsets).length

    if (this.linkCount < 1) {
      throw new Error("Invalid ancestor count")
    }
    if (this.linkCount in optimizedLevelChunkStart) {
      this.getLevelChunkStart = optimizedLevelChunkStart[this.linkCount]
    }
  }

  public get linkNames(): K[] {
    // TODO: This might not be too effective?
    return Object.keys(this.linkOffsets) as unknown as K[]
  }

  public getOffset(...path: K[]): TreeOffset {
    return this.getRelativeOffset(0, ...path)
  }

  public getRelativeOffset(offset: number, ...path: K[]): TreeOffset {
    const currentGeneration = this.getLevel(offset)
    const currentGenerationStart = this.getLevelChunkStart(currentGeneration)
    const currentGenerationOffset = offset - currentGenerationStart

    const targetGeneration = currentGeneration + path.length
    const targetGenerationStart = this.getLevelChunkStart(targetGeneration)
    let targetGenerationOffset = 0

    for (let gen = 0; gen < path.length; gen++) {
      const link = path[gen]
      const genWeight = this.linkCount ** (targetGeneration - 1 - (gen + currentGeneration))
      targetGenerationOffset += this.linkOffsets[link] * genWeight
    }

    return targetGenerationStart + currentGenerationOffset * this.linkCount ** (targetGeneration - currentGeneration) + targetGenerationOffset
  }

  public getLevel(offset: TreeOffset): TreeLevel {
    let gen = 0
    while (this.getLevelChunkStart(gen + 1) <= offset) {
      gen += 1
    }

    return gen
  }

  public getLevelChunkStart(g: TreeLevel): TreeOffset {
    return (this.linkCount ** g - 1) / (this.linkCount - 1)
  }
}
