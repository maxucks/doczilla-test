import { Game, State } from "./alg"

let state: State = [
  ["04", "04", "02", "05"],
  ["08", "08", "01", "03"],
  ["05", "07", "07", "06"],
  ["05", "02", "03", "05"],
  ["07", "08", "06", "01"],
  ["02", "01", "02", "06"],
  ["08", "07", "04", "04"],
  ["01", "03", "03", "06"],
  [],
  [],
  [],
]

const game = new Game({ tubeHeight: 4 })
const solution = game.solve(state)

if (solution) {
  for (const move of solution) {
    state = game.move(state, move)
    console.log("Move:", move)
    console.log(state, "\n")
  }
} else {
  console.log("No solutions")
}
