import OPENAI_API_KEY from './key.js'

const { body } = document
const clock = document.getElementById('clock')
const [meridiem] = document.getElementsByClassName('meridiem')
const hourHand = document.getElementById('hour')
const minuteHand = document.getElementById('min')
const secondHand = document.getElementById('sec')
const [dateBlock] = document.getElementsByClassName('date')
const [yearP, monthP, dateP] = document.querySelectorAll('.date p')
const goBtn = document.querySelector('.go')
const messagesBlock = document.querySelector('.messages>p')
const noApiKeyStory = ''


let intervalId
let customDate

runClock()

dateBlock.onclick = handleChangeDateClick
hourHand.onmousedown = handleGrab
minuteHand.onmousedown = handleGrab
// goBtn.onclick = OPENAI_API_KEY ? handleTimeTrip
//   : messagesBlock.innerText = 'hello'
goBtn.onclick = handleTimeTrip

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
  const step = e.ctrlKey ? e.shiftKey ? 1000 : 10 : e.shiftKey ? 100 : 1

  if (btn.matches('.year>.up')) {
    incrementYear(step)
  } else if (btn.matches('.year>.down')) {
    decrementYear(step)
  } else if (btn.matches('.month>.up')) {
    incrementMonth(step)
  } else if (btn.matches('.month>.down')) {
    decrementMonth(step)
  } else if (btn.matches('.day>.up')) {
    incrementDay(step)
  } else if (btn.matches('.day>.down')) {
    decrementDay(step)
  }

  stopClock()
  showDate(customDate)
}

function stopClock() {
  clearInterval(intervalId)
}

function incrementYear(step) {
  customDate.setFullYear(customDate.getFullYear() + step)
}

function decrementYear(step) {
  customDate.setFullYear(customDate.getFullYear() - step)
}

function incrementMonth(step) {
  customDate.setMonth(customDate.getMonth() + step)
}

function decrementMonth(step) {
  customDate.setMonth(customDate.getMonth() - step)
}

function incrementDay(step) {
  customDate.setDate(customDate.getDate() + step)
}

function decrementDay(step) {
  customDate.setDate(customDate.getDate() - step)
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

async function handleTimeTrip() {
  messagesBlock.innerText = 'Loading...'
  goBtn.disabled = true

  const prompt = `The date is ${customDate}. Write a story relevant to this date with real (preferably) or fictional characters. Mention multiple historical events of different kinds closest before this date through the story. If the date is in the future to you come up with some plausible futuristic story of possible future for this date. Not more than 4 paragraphs.`

  const url = 'https://api.openai.com/v1/chat/completions';


  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  };

  const data = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: data
  })
  const answer = await response.json()
  messagesBlock.innerText = answer.choices[0].message.content
  goBtn.disabled = false
}


