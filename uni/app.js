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
onmouseup = handleDrop
// onclick = handleClick

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

  // const rotateAngOnStartDeg = prevAngle > 0 ? prevAngle * (180 / Math.PI) : (2 * Math.PI + prevAngle) * (180 / Math.PI)

  onmousemove = (e) => {
  const prevAngle = parseFloat(hourHand.style.rotate)
  const x0 = clock.offsetLeft + clock.offsetWidth / 2
  const y0 = clock.offsetTop + clock.offsetHeight / 2
  const x = e.pageX
  const y = e.pageY
  const angle = calculateRotationAngle(x, y, x0, y0)
  const deltaAngle = angle - prevAngle
  customDate.setTime(customDate.getTime() + deltaAngle * 3600e3)
  console.log({ prevAngle, angle, deltaAngle, customDate })
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
  body.style.userSelect = null
}


function calculateRotationAngle(x, y, x0, y0) {
  var deltaX = x - x0
  var deltaY = y - y0
  var angleRadians = Math.atan2(deltaX, -deltaY)

  // console.log({ x, y, x0, y0, angleRadians })
  // var angleDegrees = angleRadians >= 0 ? angleRadians * (180 / Math.PI) : (2 * Math.PI - Math.abs(angleRadians)) * (180 / Math.PI)
  // var hours = Math.abs(Math.floor(angleDegrees / 30))


  // console.log({ aR: angleRadians, aD: angleDegrees, ang0: rotateAngOnStartDeg, h: hours, l: laps,  })

  return angleRadians / (2 * Math.PI)
}



