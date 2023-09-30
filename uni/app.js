const { body } = document
const clock = document.getElementById('clock')
const [meridiem] = document.getElementsByClassName('meridiem')
const hourHand = document.getElementById('hour')
const minuteHand = document.getElementById('min')
const secondHand = document.getElementById('sec')
const [dateBlock] = document.getElementsByClassName('date')
const [yearP, monthP, dateP] = document.querySelectorAll('.date p')

let intervalId
let customDate

runClock()

dateBlock.onclick = handleChangeDateClick
hourHand.onmousedown = handleGrab
minuteHand.onmousedown = handleGrab

function runClock() {
  intervalId = setInterval(animateClock, 100)
}

function animateClock() {
  const date = new Date()

  showDate(date)
  customDate = date
}

function showDate(date,) {
  const hoursTurn = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 43200
  const minutesTurn = (date.getMinutes() * 60 + date.getSeconds()) / 3600
  const secondsTurn = date.getSeconds() / 60
  const year = date.getFullYear()
  const iMonth = date.getMonth()
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][iMonth]

  hourHand.style.rotate = hoursTurn - (hoursTurn > 0.5) + 'turn'
  minuteHand.style.rotate = minutesTurn - (minutesTurn > 0.5) + 'turn'
  secondHand.style.rotate = secondsTurn - (secondsTurn > 0.5) + 'turn'
  yearP.innerText = year
  monthP.innerText = month
  dateP.innerText = date.getDate()
  meridiem.innerText = date.getHours() < 12 ? 'AM' : 'PM'
}

function handleChangeDateClick(e) {
  if (!e.target.matches('button')) return

  const btn = e.target

  if (btn.matches('.year>.up')) {
    incrementYear()
  } else if (btn.matches('.year>.down')) {
    decrementYear()
  } else if (btn.matches('.month>.up')) {
    incrementMonth()
  } else if (btn.matches('.month>.down')) {
    decrementMonth()
  } else if (btn.matches('.day>.up')) {
    incrementDay()
  } else if (btn.matches('.day>.down')) {
    decrementDay()
  }

  stopClock()
  showDate(customDate)
}

function stopClock() {
  clearInterval(intervalId)
}

function incrementYear() {
  customDate.setFullYear(customDate.getFullYear() + 1)
}

function decrementYear() {
  customDate.setFullYear(customDate.getFullYear() - 1)
}

function incrementMonth() {
  customDate.setMonth(customDate.getMonth() + 1)
}

function decrementMonth() {
  customDate.setMonth(customDate.getMonth() - 1)
}

function incrementDay() {
  customDate.setDate(customDate.getDate() + 1)
}

function decrementDay() {
  customDate.setDate(customDate.getDate() - 1)
}

function handleGrab(e) {
  body.style.userSelect = 'none'
  const x0 = clock.offsetLeft + clock.offsetWidth / 2
  const y0 = clock.offsetTop + clock.offsetHeight / 2
  const hand = e.target
  let ratio = 60e3

  if (hand == hourHand) {
    minuteHand.hidden = true
    ratio = 3600e3
  }
  onmouseup = handleDrop
  secondHand.hidden = true

  onmousemove = (e) => {
    const x = e.pageX
    const y = e.pageY
    const prevAngle = parseFloat(hand.style.rotate)
    const angle = calculateRotationAngle(x, y, x0, y0)
    const deltaAngle = angle - prevAngle
    customDate.setTime(customDate.getTime() + (deltaAngle + (deltaAngle < -0.5) - (deltaAngle > 0.5)) * ratio)
    // console.log({ prevAngle, angle, deltaAngle, customDate })
    showDate(customDate)

  }
}

function handleClick(e) {
  const x0 = clock.offsetLeft + clock.offsetWidth / 2
  const y0 = clock.offsetTop + clock.offsetHeight / 2
  const x = e.pageX
  const y = e.pageY

  const angle = calculateRotationAngle(x, y, x0, y0)
  console.log(angle)
  // hourHand.style.rotate = angle + 'rad'
}

function handleDrop() {
  onmousemove = null
  onmouseup = null
  body.style.userSelect = null
  minuteHand.hidden = false
  secondHand.hidden = false
  customDate.setSeconds(Math.round(customDate.getSeconds() / 60) * 60)
  showDate(customDate)
}


function calculateRotationAngle(x, y, x0, y0) {
  var deltaX = x - x0
  var deltaY = y - y0
  var angleRadians = Math.atan2(deltaX, -deltaY)

  return angleRadians / (2 * Math.PI)
}



