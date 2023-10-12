export { Story }

let OPENAI_API_KEY
(async () => {
  try {
    ({ default: OPENAI_API_KEY } = await import('./key.js'))
  } catch { }
})()

class Story extends EventTarget {
  constructor() {
    super()
    this.render()
  }

  render() {
    const storyContainer = document.createElement('div')
    const storyP = document.createElement('p')
    storyContainer.className = 'story'
    storyContainer.append(storyP)
    this.element = storyContainer
    this.storyP = storyP
  }

  setApiKey(apiKey) {
    OPENAI_API_KEY = apiKey
  }

  async request(date) {
    if (!OPENAI_API_KEY) {
      this.storyP.innerText = noApiKeyStory
      setTimeout(() => this.signalReady(), 100)
      return
    }
    this.storyP.innerText = 'Loading...'

    const prompt = `The date is ${date}. Write a story relevant to this date with real (preferably) or fictional characters. Mention multiple historical events of different kinds closest before this date through the story. If the date is in the future to you come up with some plausible futuristic story of possible future for this date. Not more than 4 paragraphs. Response should start with Story Title in double asterisks.`
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
    this.storyP.innerHTML = answer.choices[0].message.content.replace(/\*\*(.*)\*\*\n/, '<h3>$1</h3>').replaceAll('\n\n', '<br><br>')
    this.signalReady()
  }

  appendTo(parent) {
    parent.append(this.element)
  }

  signalReady() {
    const e = new CustomEvent('ready')
    this.dispatchEvent(e)
  }
}

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


