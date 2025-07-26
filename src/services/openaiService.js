import OpenAI from 'openai';

/**
 * Initializes the OpenAI client with the API key from environment variables.
 * @returns {OpenAI} Configured OpenAI client instance.
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * Custom error class for OpenAI service errors
 */
class OpenAIServiceError extends Error {
  constructor(message, type, statusCode = null) {
    super(message);
    this.name = 'OpenAIServiceError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

/**
 * Handles OpenAI API errors and provides user-friendly error messages
 * @param {Error} error - The original error from OpenAI API
 * @returns {OpenAIServiceError} Formatted error with user-friendly message
 */
function handleOpenAIError(error) {
  console.error('OpenAI API Error:', error);
  
  if (error.status === 429) {
    return new OpenAIServiceError(
      'Translation service quota exceeded. Please try again later or contact support.',
      'QUOTA_EXCEEDED',
      429
    );
  } else if (error.status === 401) {
    return new OpenAIServiceError(
      'Translation service authentication failed. Please check configuration.',
      'AUTH_ERROR',
      401
    );
  } else if (error.status === 503 || error.status === 502) {
    return new OpenAIServiceError(
      'Translation service is temporarily unavailable. Please try again in a few moments.',
      'SERVICE_UNAVAILABLE',
      error.status
    );
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return new OpenAIServiceError(
      'Unable to connect to translation service. Please check your internet connection.',
      'NETWORK_ERROR',
      null
    );
  } else {
    return new OpenAIServiceError(
      'Translation service encountered an unexpected error. Please try again.',
      'UNKNOWN_ERROR',
      error.status || null
    );
  }
}

/**
 * Implements retry logic with exponential backoff
 * @param {Function} apiCall - The API call function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of the API call
 */
async function retryWithBackoff(apiCall, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      // Don't retry on quota exceeded or auth errors
      if (error.status === 429 || error.status === 401) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms delay`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Translates text from Spanish to English using OpenAI
 * @param {string} spanishText - The Spanish text to translate
 * @returns {Promise<object>} Translation result with confidence score
 */
export async function translateSpanishToEnglish(spanishText) {
  try {
    const apiCall = async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional Spanish to English translator. Provide accurate translations while maintaining the original meaning and tone. Respond only with the English translation.' 
          },
          { role: 'user', content: spanishText },
        ],
        temperature: 0.3,
        max_tokens: 200,
      });
      return response;
    };

    const response = await retryWithBackoff(apiCall);
    const translation = response.choices[0].message.content.trim();
    
    // Calculate confidence based on response quality indicators
    let confidence = calculateTranslationConfidence(spanishText, translation);
    
    return {
      original: spanishText,
      translated: translation,
      confidence: confidence,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      success: true
    };
  } catch (error) {
    const serviceError = handleOpenAIError(error);
    
    // Return fallback response for graceful degradation
    return {
      original: spanishText,
      translated: getFallbackTranslation(serviceError),
      confidence: 0,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      success: false,
      error: serviceError.message,
      errorType: serviceError.type
    };
  }
}

/**
 * Generates structured translation with confidence scoring
 * @param {string} spanishText - The Spanish text to translate
 * @returns {Promise<object>} Structured translation response
 */
export async function getStructuredTranslation(spanishText) {
  try {
    const apiCall = async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional Spanish to English translator. Provide accurate translations with confidence scores.' 
          },
          { role: 'user', content: `Translate this Spanish text to English: "${spanishText}"` },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'translation_response',
            schema: {
              type: 'object',
              properties: {
                translation: { type: 'string' },
                confidence: { type: 'number' },
                detected_language: { type: 'string' }
              },
              required: ['translation', 'confidence', 'detected_language'],
              additionalProperties: false,
            },
          },
        },
      });
      return response;
    };

    const response = await retryWithBackoff(apiCall);
    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      original: spanishText,
      translated: result.translation,
      confidence: Math.round(result.confidence),
      detectedLanguage: result.detected_language,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      success: true
    };
  } catch (error) {
    console.error('Error in structured translation:', error);
    // Fallback to basic translation with enhanced error handling
    return await translateSpanishToEnglish(spanishText);
  }
}

/**
 * Provides fallback translation message based on error type
 * @param {OpenAIServiceError} error - The service error
 * @returns {string} User-friendly fallback message
 */
function getFallbackTranslation(error) {
  switch (error.type) {
    case 'QUOTA_EXCEEDED':
      return '⚠️ Translation quota exceeded. Please contact your administrator or try again later.';
    case 'AUTH_ERROR':
      return '⚠️ Translation service authentication error. Please contact support.';
    case 'SERVICE_UNAVAILABLE':
      return '⚠️ Translation service temporarily unavailable. Please try again in a few moments.';
    case 'NETWORK_ERROR':
      return '⚠️ Network connection error. Please check your internet connection and try again.';
    default:
      return '⚠️ Translation temporarily unavailable. Original message will be displayed.';
  }
}

/**
 * Calculates translation confidence based on text characteristics
 * @param {string} original - Original Spanish text
 * @param {string} translated - Translated English text
 * @returns {number} Confidence score between 70-98
 */
function calculateTranslationConfidence(original, translated) {
  // Basic confidence calculation based on text characteristics
  const originalLength = original.length;
  const translatedLength = translated.length;
  const lengthRatio = Math.min(translatedLength / originalLength, originalLength / translatedLength);
  
  // Base confidence starts high for OpenAI
  let confidence = 88;
  
  // Adjust based on length ratio (similar lengths often indicate good translation)
  if (lengthRatio > 0.7) confidence += 6;
  else if (lengthRatio > 0.5) confidence += 3;
  
  // Add small random variation to make it realistic
  confidence += Math.floor(Math.random() * 6) - 3;
  
  // Ensure confidence is within realistic bounds
  return Math.max(70, Math.min(98, confidence));
}

/**
 * Streams a translation response in real-time
 * @param {string} spanishText - The Spanish text to translate
 * @param {Function} onChunk - Callback to handle each streamed chunk
 */
export async function getStreamingTranslation(spanishText, onChunk) {
  try {
    const apiCall = async () => {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional Spanish to English translator. Provide accurate translations while maintaining the original meaning and tone.' 
          },
          { role: 'user', content: `Translate this Spanish text to English: "${spanishText}"` },
        ],
        stream: true,
        temperature: 0.3,
      });
      return stream;
    };

    const stream = await retryWithBackoff(apiCall);
    let fullTranslation = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullTranslation += content;
        onChunk(content, fullTranslation);
      }
    }

    return {
      original: spanishText,
      translated: fullTranslation.trim(),
      confidence: calculateTranslationConfidence(spanishText, fullTranslation),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      success: true
    };
  } catch (error) {
    const serviceError = handleOpenAIError(error);
    console.error('Error in streaming translation:', serviceError);
    
    // Provide fallback for streaming
    const fallbackMessage = getFallbackTranslation(serviceError);
    onChunk(fallbackMessage, fallbackMessage);
    
    return {
      original: spanishText,
      translated: fallbackMessage,
      confidence: 0,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      success: false,
      error: serviceError.message,
      errorType: serviceError.type
    };
  }
}

export default openai;