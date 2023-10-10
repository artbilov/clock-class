export { Clock }

class Clock extends EventTarget {
  constructor() {
    super()
    this.render()
    this.assignListeners()
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

  assignListeners() {
    this.element.onmousedown = (e) => {
      if (!e.target.matches('.hand')) return

      const hand = e.target
      const { x0, y0 } = this.getCenter()
      let ratio = 1

      this.requestStop()
      document.body.style.userSelect = 'none'

      if (hand == this.hourHand) {
        this.minHand.hidden = true
        this.secHand.hidden = true
        ratio = 3600
      }

      if (hand == this.minHand) {
        this.secHand.hidden = true
        ratio = 60
      }

      window.onmouseup = () => {
        this.requestStart()
        this.minHand.hidden = false
        this.secHand.hidden = false
        document.body.style.userSelect = null
        window.onmousemove = null
        window.onmouseup = null
      }

      window.onmousemove = e => {
        const x = e.pageX
        const y = e.pageY
        const prevAngle = parseFloat(hand.style.rotate)
        const angle = calculateRotationAngle(x, y, x0, y0)
        const deltaAngle = angle - prevAngle
        const s = (deltaAngle + (deltaAngle < -0.5) - (deltaAngle > 0.5)) * ratio

        this.requestShift(s)
        spot.style.left = x + 'px'
        spot.style.top = y + 'px'

      }
    }
  }

  requestStop() {
    const e = new CustomEvent('stoprequest')
    this.dispatchEvent(e)
  }

  requestStart() {
    const e = new CustomEvent('startrequest')
    this.dispatchEvent(e)
  }

  requestShift(s) {
    const detail = { unit: 'sec', amount: s }
    const e = new CustomEvent('shiftrequest', { detail })
    this.dispatchEvent(e)
  }

  getCenter() {
    const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = this.element
    const x0 = offsetLeft + offsetWidth / 2
    const y0 = offsetTop + offsetHeight / 2

    return { x0, y0 }
  }
}


function calculateRotationAngle(x, y, x0, y0) {
  var deltaX = x - x0
  var deltaY = y - y0
  var angleRadians = Math.atan2(deltaX, -deltaY)

  return angleRadians / (2 * Math.PI)
}
