export type State = Tube[]

export type Tube = string[]

export type Move = {
  from: number
  to: number
}

type GameOptions = {
  tubeHeight: number
}

export class Game {
  visited = new Set()

  constructor(private options: GameOptions) {}

  public toString = (state: State) => state.map((tube) => tube.join("")).join("|")

  public isSorted = (state: State): boolean => {
    for (const tube of state) {
      const topColor = tube[0]

      const hasNotSameColors = tube.length !== 0 && !tube.every((color) => color === topColor)
      if (tube.length > this.options.tubeHeight || hasNotSameColors) {
        return false
      }
    }
    return true
  }

  public move = (state: State, { from, to }: Move): State => {
    const copy = state.map((tube) => [...tube])

    const [tube, target] = [copy[from]!, copy[to]!]
    const topColor = tube[tube.length - 1]!

    while (tube.length > 0 && target.length < this.options.tubeHeight && tube[tube.length - 1] === topColor) {
      const top = tube.pop()!
      target.push(top)
    }

    return copy
  }

  public getMoves = (state: State): Move[] => {
    const moves: Move[] = []

    for (let i = 0; i < state.length; i++) {
      const tube = state[i]!
      if (tube.length === 0) continue

      const topColor = tube[tube.length - 1]

      for (let j = 0; j < state.length; j++) {
        if (i === j) continue
        const target = state[j]!

        if (target.length === this.options.tubeHeight) continue
        if (target.length === 0 || target[target.length - 1] === topColor) {
          moves.push({ from: i, to: j })
        }
      }
    }

    return moves
  }

  public solve = (state: State, solution: Move[] = []): Move[] | null => {
    const key = this.toString(state)
    if (this.visited.has(key)) return null
    if (this.isSorted(state)) return solution

    this.visited.add(key)

    const moves = this.getMoves(state)

    for (const move of moves) {
      const next: State = this.move(state, move)
      const result = this.solve(next, [...solution, move])

      if (result) return result
    }

    return null
  }
}
