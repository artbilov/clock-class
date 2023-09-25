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

function runClock() {
  intervalId = setInterval(animateClock, 100)
}

function animateClock() {
  const date = new Date()

  const hoursTurn = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 43200
  const minutesTurn = (date.getMinutes() * 60 + date.getSeconds()) / 3600
  const secondsTurn = date.getSeconds() / 60
  const year = date.getFullYear()
  const iMonth = date.getMonth()
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][iMonth]

  hourHand.style.rotate = hoursTurn + 'turn'
  minuteHand.style.rotate = minutesTurn + 'turn'
  secondHand.style.rotate = secondsTurn + 'turn'
  yearP.innerText = year
  monthP.innerText = month
  dateP.innerText = date.getDate()
  meridiem.innerText = date.getHours() < 12 ? 'AM' : 'PM'
  customDate = date
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
  showCustomDate()
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

function showCustomDate() {
  const year = customDate.getFullYear()
  const iMonth = customDate.getMonth()
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][iMonth]

  yearP.innerText = year
  monthP.innerText = month
  dateP.innerText = customDate.getDate()
}





