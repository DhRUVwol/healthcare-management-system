// Save this as scripts/check-env.js
const OpenAI = require('openai')
require('dotenv').config()

async function checkOpenAIConfig() {
  console.log('Checking OpenAI configuration...')
  
  try {
    if (!process.env.local.OPENAI_API_KEY) {
      console.error('❌ ERROR: OPENAI_API_KEY environment variable is not set')
      console.log('Make sure you have a .env file with OPENAI_API_KEY or set it in your environment')
      return
    }
    
    console.log('✅ OPENAI_API_KEY environment variable is set')
    
    // Try to init OpenAI and make a simple request
    const openai = new OpenAI({
      apiKey: process.env.local.OPENAI_API_KEY
    })
    
    console.log('Attempting to connect to OpenAI API...')
    
    const models = await openai.models.list()
    
    console.log('✅ Successfully connected to OpenAI API')
    console.log(`Available models: ${models.data.length}`)
    
  } catch (error) {
    console.error('❌ Failed to connect to OpenAI API:', error.message)
    console.error('Please check your API key and network connection')
  }
}

checkOpenAIConfig()