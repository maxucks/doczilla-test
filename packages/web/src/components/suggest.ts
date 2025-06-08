type SuggestionCallback = (value: string, index: number) => Promise<void> | void
type InputChangeCallback = (value: string) => Promise<void> | void

export class InputSuggest {
  private input: HTMLInputElement
  private list: HTMLUListElement
  private suggestions: string[] = []
  private filtered: string[] = []
  private currentFocus: number = -1
  public onSelect: SuggestionCallback | null = null
  public onInputChange: InputChangeCallback | null = null

  constructor(inputSelector: string, listSelector: string) {
    this.input = document.querySelector(inputSelector) as HTMLInputElement
    this.list = document.querySelector(listSelector) as HTMLUListElement

    this.init()
  }

  private init() {
    this.input.addEventListener("input", async () => {
      await this.handleInput(false)
    })

    this.input.addEventListener("keydown", (e) => this.handleKeyDown(e))

    document.addEventListener("click", (e) => {
      if (!this.list.contains(e.target as Node) && e.target !== this.input) {
        this.hideList()
      }
    })
  }

  private async handleInput(ignoreCallback: boolean = true) {
    const value = this.input.value.trim()
    if (!ignoreCallback) {
      await this.onInputChange?.(value)
    }

    const lowerValue = value.toLowerCase()
    this.filtered = this.suggestions.filter((s) => s.toLowerCase().includes(lowerValue))
    this.currentFocus = -1
    this.renderList()
  }

  private handleKeyDown(e: KeyboardEvent) {
    const items = this.list.querySelectorAll("li")

    if (e.key === "ArrowDown") {
      this.currentFocus++
      this.highlight(items)
    } else if (e.key === "ArrowUp") {
      this.currentFocus--
      this.highlight(items)
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (this.currentFocus > -1 && items[this.currentFocus]) {
        items[this.currentFocus].click()
      }
    }
  }

  private highlight(items: NodeListOf<HTMLLIElement>) {
    if (!items.length) return
    if (this.currentFocus >= items.length) this.currentFocus = 0
    if (this.currentFocus < 0) this.currentFocus = items.length - 1
    items.forEach((item) => item.classList.remove("active"))
    items[this.currentFocus].classList.add("active")
    items[this.currentFocus].scrollIntoView({ block: "nearest" })
  }

  private renderList() {
    this.list.innerHTML = ""
    if (this.filtered.length === 0) {
      this.hideList()
      return
    }

    this.filtered.forEach((item) => {
      const li = document.createElement("li")
      li.textContent = item

      li.addEventListener("click", async () => {
        this.input.value = item
        const originalIndex = this.suggestions.findIndex((s) => s === item)
        await this.onSelect?.(item, originalIndex)
        this.hideList()
      })

      this.list.appendChild(li)
    })

    this.list.classList.remove("hidden")
  }

  private hideList() {
    this.list.innerHTML = ""
    this.list.classList.add("hidden")
    this.currentFocus = -1
  }

  public updateSuggestions(newSuggestions: string[]) {
    this.suggestions = newSuggestions
    this.handleInput()
  }

  public clear() {
    this.suggestions = []
    this.hideList()
  }
}
