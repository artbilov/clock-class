import { Clock } from './clock.js'
import { DateControl } from './date-control.js'
import { Time } from './time.js'
import { Story } from './story.js'

main()

function main() {
  const clock = new Clock()
  const dateControl = new DateControl()
  const story = new Story()
  const time = new Time()

  const aiClock = document.createElement('section')
  const apiKeyInput = document.createElement('input')
  apiKeyInput.id = 'api-key-input'
  apiKeyInput.placeholder = 'Insert your OpenAI API key.'

  const timeBlock = document.createElement('time')
  aiClock.className = 'ai-clock'

  aiClock.append(apiKeyInput, timeBlock)
  document.body.append(aiClock)
  clock.appendTo(timeBlock)
  dateControl.appendTo(timeBlock)
  story.appendTo(aiClock)

  apiKeyInput.addEventListener('keydown', e => {
    if (e.key == 'Enter') {
      story.setApiKey(apiKeyInput.value)
      apiKeyInput.value = ''
      apiKeyInput.placeholder = 'Your API-KEY aquired!'
    }
  })

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

  dateControl.addEventListener('storyrequest', () => {
    const date = time.date
    story.request(date)
  })

  story.addEventListener('ready', () => dateControl.allowTrips())

  time.start()
}









