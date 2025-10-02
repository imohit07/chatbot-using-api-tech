// Vercel Serverless Function for Gemini API
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, imageData } = req.body;
    
    if (!message && !imageData) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    // Get API key from environment variables
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Construct the API URL
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    // Prepare the request body
    const parts = [];
    
    if (message) {
      parts.push({ text: message });
    }
    
    if (imageData && imageData.data && imageData.mime_type) {
      parts.push({
        inline_data: {
          mime_type: imageData.mime_type,
          data: imageData.data
        }
      });
    }

    const requestBody = {
      contents: [{
        parts: parts
      }]
    };

    // Make request to Gemini API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to get response from AI',
        details: errorData
      });
    }

    const data = await response.json();
    
    // Extract the response text
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      return res.status(500).json({ error: 'Invalid response from AI' });
    }

    // Clean up the response (remove markdown formatting)
    const cleanResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '$1').trim();

    res.status(200).json({ 
      response: cleanResponse,
      success: true 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
