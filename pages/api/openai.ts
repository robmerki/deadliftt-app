import type { NextApiRequest, NextApiResponse } from 'next'

import { Configuration, OpenAIApi } from 'openai'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { category, keywords } = req.body

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  console.log(category, keywords)

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: createPrompt(category, keywords),
    max_tokens: 2048,
  })

  res.status(200).json(completion.data.choices[0].text as unknown as string)
}

function createPrompt(category: string, keywords: string): string {
  return `I am a YouTube strategist that his planning content for a client who is interested in making content about: ${category}
  I'd like for you to do a mind map of every category that the following keywords could touch: ${keywords}.
  
  Please format the results as a nested JSON object where the keys are the keywords and the values are the categories that the keyword could touch.`
}
