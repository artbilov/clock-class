// import classes at the main entry point of the app
import { Clock } from './clock.js'
import { DateControl } from './date-control.js'
import { Time } from './time.js'
import { Story } from './story.js'

// Use the main entry point of the app
main()

// Define function main to be called at the main entry point of the app
function main() {
  // Create instances of the classes
  const clock = new Clock()
  const dateControl = new DateControl()
  const story = new Story()
  const time = new Time()

  // Build main elements of DOM and add properties to them
  const aiClock = document.createElement('section')
  const apiKeyInput = document.createElement('input')
  apiKeyInput.id = 'api-key-input'
  apiKeyInput.placeholder = 'Insert your OpenAI API key.'
  const timeBlock = document.createElement('time')
  aiClock.className = 'ai-clock'

  // Create tree structure of DOM
  aiClock.append(apiKeyInput, timeBlock)
  document.body.append(aiClock)
  clock.appendTo(timeBlock)
  dateControl.appendTo(timeBlock)
  story.appendTo(aiClock)


  // Add event listener to the input field for the API-KEY value to get from the user
  apiKeyInput.addEventListener('keydown', e => {
    if (e.key == 'Enter') {
      story.setApiKey(apiKeyInput.value)
      apiKeyInput.value = ''
      apiKeyInput.placeholder = 'Your API-KEY aquired!'
    }
  })

  // Add event listener to the time block to update the clock with the current time and date when the time is changed by the user
  time.addEventListener('change', e => {
    const { date } = e.detail

    clock.update(date)
    dateControl.update(date)
  })

  // Add event listener to the clock to start and stop the clock  
  clock.addEventListener('stoprequest', () => time.stop())
  clock.addEventListener('startrequest', () => time.start())

  // Add event listener to the clock to send shift requests
  clock.addEventListener('shiftrequest', e => {
    const { unit, amount } = e.detail
    time.shift(unit, amount)
  })

  // Add event listener to the date control to send shift requests
  dateControl.addEventListener('shiftrequest', e => {
    const { unit, amount } = e.detail
    time.shift(unit, amount)
  })

  // Add event listener to the date control to send story requests
  dateControl.addEventListener('storyrequest', () => {
    const date = time.date
    story.request(date)
  })

  story.addEventListener('ready', () => dateControl.allowTrips())

  time.start()
}