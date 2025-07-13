const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
  } = require('@google/generative-ai');
  
  const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const GenAi = new GoogleGenerativeAI(apikey);
 
  // Define model config parts
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM,
    },
  ];
  
  // Initialize model
  const model = GenAi.getGenerativeModel({
    model: 'gemini-2.5-pro',
    generationConfig,
    safetySettings,
  });
  

     export const chatSession = model.startChat({
      generationConfig,
      safetySettings,
    });
  

  