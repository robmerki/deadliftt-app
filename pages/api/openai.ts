import type { NextApiRequest, NextApiResponse } from 'next'

import { Configuration, OpenAIApi } from 'openai'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // res.status(200).json(testData as unknown as string)
  const { category, keywords } = req.body

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: createPrompt(category, keywords),
    max_tokens: 2048,
  })

  res.status(200).json(completion.data.choices[0].text as unknown as string)
}

function createPrompt(category: string, keywords: string): string {
  return `I am a content strategist that his planning content for a client who is interested in making content about: ${category}
  I'd like for you to create a mind map of interesting content that could be related to ${category} and following keywords: ${keywords}.
  
  Please format the results as a nested JSON object with where the keys are the keywords and the values are the potential video titles.
  
  The results should have the following structure: 
  {
    "keyword1": {
      "subkeyword1": [
        "idea1",
        "idea2"
      ],
      "subkeyword2": [
        "idea1",
        "idea2"
      ]
    },
    "keyword2": {
      "subkeyword1": [
        "idea1",
        "idea2"
      ],
      "subkeyword2": [
        "idea1",
        "idea2"
      ]
    }
  }
  `
}
