// Copy and paste this code on console of your browser devtool to run

// config
const apiKey = 'APIKEY'
const sendMode = true // will automatically go to next question after answering
const model = "llama3-70b-8192"

// select element with question and options
const element = document.querySelector('.formulation.clearfix')
let userPrompt = element?.innerHTML.trim()

if (!userPrompt) {
  console.error("Não foi possível achar a questão")
}

userPrompt += "\n Cite apenas qual é a opção correta (A, B, C, D ou E) dessa forma: RESPOSTA CORRETA: A."

const apiEndpoint = 'https://api.groq.com/openai/v1/chat/completions'

const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
}

const data = {
  messages: [
    {
      role: "user",
      content: userPrompt,
    },
  ],
  model,
}

fetch(apiEndpoint, {
  method: 'POST',
  headers,
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(results => {
    console.log(JSON.stringify(results, null, 2))

    const responseText = results.choices[0].message.content

    const textToCheck = "RESPOSTA CORRETA: "

    const answerStartIndex = responseText.indexOf(textToCheck)
    if (answerStartIndex === -1) {
      throw new Error("Resposta correta não encontrada")
    }

    const initialAnswerIndex = answerStartIndex + textToCheck.length

    const lastAnswerIndex = responseText.slice(initialAnswerIndex).indexOf(".", initialAnswerIndex)

    const answer = responseText.slice(initialAnswerIndex, lastAnswerIndex).trim().toLowerCase()

    console.info('Answer:', answer)

    const anwerMap = {
      "a": "0",
      "b": "1",
      "c": "2",
      "d": "3",
      "e": "4"
    }

    const allInputs = document.querySelectorAll('input')

    let selectedAny = false


    allInputs.forEach(input => {
      if (input.name?.includes("answer") && input.value === anwerMap[answer]) {
        input.checked = true
        selectedAny = true

        console.log('Selected input value:', input.value, 'Answer:', answer)
      }
    })

    if (!selectedAny) {
      throw new Error("Não foi possível selecionar a resposta")
    }

    if (sendMode) {
      allInputs.forEach(input => {
        if (input.name?.includes("submit") && input.value === "Verificar") {
          input.click()
        }
      })


      allInputs.forEach(input => {
        if (input.name?.includes("next") && input.value === "Próxima página") {
          input.click()
        }
      })
    }
  })
  .catch(error => {
    console.error('Error:', error)
  })
