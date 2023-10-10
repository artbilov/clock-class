export { DateControl }

class DateControl extends EventTarget {
  constructor() {
    super()
    this.render()
    this.assignListeners()
  }

  render() {
    const dateContainer = document.createElement('div')
    const [yearDiv, monthDiv, dayDiv] = 'year,month,day'.split(',').map(unit => {
      const unitBlock = document.createElement('div')
      const upBtn = document.createElement('button')
      const display = document.createElement('p')
      const downBtn = document.createElement('button')

      unitBlock.className = unit
      upBtn.className = 'up'
      upBtn.textContent = '▲'
      downBtn.className = 'down'
      downBtn.textContent = '▼'
      unitBlock.append(upBtn, display, downBtn)

      return unitBlock
    })

    dateContainer.className = 'date'
    dateContainer.append(yearDiv, monthDiv, dayDiv)

    const [yearDisplay, monthDisplay, dayDisplay] = dateContainer.querySelectorAll('p')

    this.element = dateContainer
    Object.assign(this, { yearDisplay, monthDisplay, dayDisplay })
  }

  appendTo(parent) {
    parent.append(this.element)
  }

  update(date) {
    const year = date.getFullYear()
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]

    this.yearDisplay.innerText = year
    this.monthDisplay.innerText = month
    this.dayDisplay.innerText = date.getDate()

  }

  assignListeners() {
    this.element.onclick = e => {
      if (!e.target.matches('button:not(.go)')) return

      const btn = e.target
      const step = e.ctrlKey ? e.shiftKey ? 1000 : 10 : e.shiftKey ? 100 : 1

      if (btn.matches('.year>.up')) {
        this.requestChange('year', step)
      } else if (btn.matches('.year>.down')) {
        this.requestChange('year', -step)
      } else if (btn.matches('.month>.up')) {
        this.requestChange('month', step)
      } else if (btn.matches('.month>.down')) {
        this.requestChange('month', -step)
      } else if (btn.matches('.day>.up')) {
        this.requestChange('day', step)
      } else if (btn.matches('.day>.down')) {
        this.requestChange('day', -step)
      }
    }
  }

  requestChange(unit, amount) {
    const detail = { unit, amount }
    const e = new CustomEvent('shiftrequest', { detail })
    this.dispatchEvent(e)
  }
}
