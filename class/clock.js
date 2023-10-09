export { Clock }

class Clock {
  constructor() {
    this.render()
    // this.assignListeners()
  }

  render() {
    const clockContainer = document.createElement('div')
    const marksContainer = document.createElement('ol')
    const marks = 'I,II,III,IV,V,VI,VII,VIII,IX,X,XI,XII'.split(',').map(hour => {
      const mark = document.createElement('li')
      mark.className = 'mark'
      mark.dataset.hour = hour
      return mark
    })

    const meridiem = document.createElement('div')

    const [secHand, minHand, hourHand] = ['sec', 'min', 'hour'].map(unit => {
      const hand = document.createElement('div')
      hand.className = `hand ${unit}`
      return hand
    })

    clockContainer.className = 'clock'
    marksContainer.className = 'marks'
    meridiem.className = 'meridiem'

    marksContainer.append(...marks)
    clockContainer.append(marksContainer, meridiem, secHand, minHand, hourHand)
    this.element = clockContainer
    Object.assign(this, { secHand, minHand, hourHand, meridiem })
  }

  appendTo(parent) {
    parent.append(this.element)
  }

  update(date) {
    const hoursTurn = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 43200
    const minutesTurn = (date.getMinutes() * 60 + date.getSeconds()) / 3600
    const secondsTurn = date.getSeconds() / 60

    this.hourHand.style.rotate = hoursTurn - (hoursTurn > 0.5) + 'turn'
    this.minHand.style.rotate = minutesTurn - (minutesTurn > 0.5) + 'turn'
    this.secHand.style.rotate = secondsTurn - (secondsTurn > 0.5) + 'turn'
    this.meridiem.innerText = date.getHours() < 12 ? 'AM' : 'PM'
  }
}