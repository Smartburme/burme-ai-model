const API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

async function queryGemini(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024
                }
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "တောင်းပန်ပါသည်၊ အချိန်အနည်းငယ်ကြာပြီးနောက် ထပ်ကြိုးစားပါ။";
    }
}

async function queryGeminiWithImage(prompt, imageData) {
    try {
        // Compress image first
        const compressedImage = await ImageProcessor.compressImage(imageData);
        const imageBase64 = compressedImage.split(',')[1];
        
        const response = await fetch(`${VISION_API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: imageBase64
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini Vision API:', error);
        return "ပုံကိုအသုံးပြုရာတွင်အမှားတစ်ခုဖြစ်နေပါသည်။ နောက်မှထပ်ကြိုးစားပါ။";
    }
                    }
