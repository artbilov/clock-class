import { Clock } from './clock.js'
import { DateControl } from './date-control.js'
import { Time } from './time.js'
import { Message } from './message.js'

main()

function main() {
  const clock = new Clock()
  const dateControl = new DateControl()
  const time = new Time()

  const aiClock = document.createElement('section')
  const timeBlock = document.createElement('time')
  aiClock.className = 'ai-clock'

  aiClock.append(timeBlock)
  document.body.append(aiClock)
  clock.appendTo(timeBlock)
  dateControl.appendTo(timeBlock)

  time.addEventListener('change', e => {
    const { date } = e.detail

    clock.update(date)
    dateControl.update(date)
  })

  clock.addEventListener('stoprequest', () => time.stop())
  clock.addEventListener('startrequest', () => time.start())
  clock.addEventListener('shiftrequest', e => {
    const { unit, amount } = e.detail
    time.shift(unit, amount)
  })

  dateControl.addEventListener('shiftrequest', e => {
    const { unit, amount } = e.detail
    time.shift(unit, amount)
  })

  time.start()
}









