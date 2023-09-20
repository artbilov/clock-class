const [hourHand] = document.getElementsByClassName('hours')
const [minuteHand] = document.getElementsByClassName('minutes')
const [secondHand] = document.getElementsByClassName('seconds')


setInterval(animateClock, 100)

function animateClock() {
  const date = new Date()
  const hoursTurn = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 43200
  const minutesTurn = (date.getMinutes() * 60 + date.getSeconds()) / 3600
  const secondsTurn = date.getSeconds() / 60

  hourHand.style.rotate = hoursTurn + 'turn'
  minuteHand.style.rotate = minutesTurn + 'turn'
  secondHand.style.rotate = secondsTurn + 'turn'
}
