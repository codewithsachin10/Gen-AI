export const generateStudyContent = async (text) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const prompt = `You are an AI study assistant.

Analyze the given text and generate:
1. A short and clear summary (2–3 sentences)
2. Key points (3–5 bullet points)
3. 5 multiple-choice questions (MCQs) with:
   * 4 options each
   * One correct answer clearly marked

Rules:
* Keep language simple and clear
* Questions should test understanding
* Avoid repetition
* Format response in structured JSON like:
{
"summary": "...",
"key_points": ["...", "..."],
"mcqs": [
{
"question": "...",
"options": ["A...", "B...", "C...", "D..."],
"answer": "A"
}
]
}

Text:
${text}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "StudyGenius"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Very reliable for structured JSON
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      throw new Error(errorData.error?.message || "Request Failed");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export const getMockData = (text) => {
  return {
    summary: "This is a Demo Summary generated because there was an issue connecting to the AI API. It highlights the core concepts found in your text and provides a structured overview.",
    key_points: [
      "Core concept identification: The system analyzes your input for major themes.",
      "Key insight extraction: Important sentences are distilled into actionable points.",
      "Knowledge verification: MCQs are generated to test your understanding of the material."
    ],
    mcqs: [
      {
        question: "What happened to the AI request?",
        options: ["It succeeded", "It encountered an error and used fallback data", "The text was too long", "The server is offline"],
        answer: "B"
      },
      {
        question: "How can you fix this?",
        options: ["Ensure the API key is correct", "Check your internet connection", "Try a different model", "Any of the above"],
        answer: "D"
      },
      {
        question: "What is the primary goal of StudyGenius?",
        options: ["To play games", "To summarize notes and create quizzes", "To watch videos", "To chat with friends"],
        answer: "B"
      },
      {
        question: "What is OpenRouter?",
        options: ["A search engine", "An AI model aggregator", "A social network", "A cloud storage provider"],
        answer: "B"
      },
      {
        question: "Is this a real AI response?",
        options: ["Yes", "No, it is a high-quality fallback", "Maybe", "I don't know"],
        answer: "B"
      }
    ]
  };
};
