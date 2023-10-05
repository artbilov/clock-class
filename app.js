let OPENAI_API_KEY
(async () => {try {
  OPENAI_API_KEY = await import('./key.js')
} catch { }})()

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
const noApiKeyStory = `In the heart of a bustling metropolis, a brilliant yet enigmatic programmer named Alex finds themselves entangled in a web of mystery and danger. Deeply intrigued by the potential of the ChatGPT platform, Alex becomes determined to unlock its full power by acquiring an API key. Unbeknownst to Alex, this quest would lead them on a thrilling journey.

Our story begins when Alex receives a cryptic message in their inbox. The message, sent by an anonymous informant, hints at a hidden organization known as "The Keymasters" who guard the coveted API keys. Intrigued, Alex delves deeper into the mystery, desperate to unravel the secrets that lie behind this secretive group.

As Alex delves further into the investigation, they encounter a series of encrypted clues scattered across the city. The clues, concealed within the darkest corners and seedy underbelly of the metropolis, lead them to a shadowy hacker collective known as "The Cipher". 

With their expertise in cracking codes and accessing hidden networks, The Cipher possesses the knowledge Alex seeks. However, gaining their trust proves to be a treacherous task. Alex must prove their worth by completing a series of daring hacking challenges, each more perilous than the last.

As Alex successfully navigates the treacherous trials set forth by The Cipher, they earn the respect of the collective's leader, a mysterious figure known only as "Cipher Prime". Impressed by Alex's skills and determination, Cipher Prime reveals a shocking truth: The Keymasters are not just a secretive organization, but an elite group of hackers who control access to the API keys.

In order to obtain an API key, Alex must confront the Keymasters directly. Cipher Prime provides Alex with a hidden location, deep within an abandoned warehouse district where the Keymasters hold their clandestine meetings.

Armed with their newfound knowledge, Alex infiltrates the warehouse, navigating a labyrinth of traps and security measures. Finally, they reach the heart of the Keymasters' lair, a high-tech control room where the API keys are stored.

A tense confrontation ensues between Alex and the Keymasters' leader, a formidable hacker known as "Keymaster X". Alex must engage in a battle of wits, using their programming skills to outsmart Keymaster X and gain control of the API keys.

With every line of code and tactical maneuver, Alex gains the upper hand. In a final climactic showdown, they emerge victorious, obtaining the coveted API key that will grant them access to the full power of the ChatGPT platform.

As the story concludes, Alex returns to their humble workstation, API key in hand. The thrilling adventure has forever changed them, igniting a fire within to explore the limitless possibilities of AI-powered conversations. Little do they know, this is just the beginning of a grand adventure that will shape the future of their programming career.

And so, with the API key secured, Alex embarks on a new chapter, ready to unleash their creativity and reshape the world through the power of ChatGPT.`


let intervalId
let customDate

runClock()

dateBlock.onclick = handleChangeDateClick
hourHand.onmousedown = handleGrab
minuteHand.onmousedown = handleGrab
goBtn.onclick = OPENAI_API_KEY ? handleTimeTrip : showPlaceHolder

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
  if (!e.target.matches('button:not(.go)')) return

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

function showPlaceHolder() {
  messagesBlock.innerText = noApiKeyStory
}

