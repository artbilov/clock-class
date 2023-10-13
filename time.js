export { Time }

class Time extends EventTarget {
  constructor() {
    super()
    this.currentShift = { year: 0, month: 0, day: 0, hour: 0, min: 0, sec: 0 }
  }

  start() {
    this.timerId = setInterval(() => this.signalChange(), 100)
  }

  stop() {
    clearInterval(this.timerId)
  }

  signalChange() {
    const date = new Date()
    const { year, month, day, hour, min, sec } = this.currentShift
    date.setFullYear(date.getFullYear() + year, date.getMonth() + month, date.getDate() + day)
    date.setHours(date.getHours() + hour, date.getMinutes() + min, date.getSeconds() + sec)
    this.date = date
    const detail = { date }
    const e = new CustomEvent('change', { detail })

    this.dispatchEvent(e)
  }

  shift(unit, amount) {
    this.currentShift[unit] += amount
    this.signalChange()
  }
}