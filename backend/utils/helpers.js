const buildContentPrompt = ({ topic, subject, contentType, difficulty, language }) => {
  const types = {
    notes: 'Comprehensive, structured study notes with explanations, key definitions, syntax, and bullet points',
    summary: 'A crisp, high-yield summary focusing on key takeaways, formulas, and critical insights',
    explanation: 'Simple, intuitive, beginner-friendly explanations using relatable analogies and conceptual breakdown',
    examples: 'Real-world practical examples, code snippets, industry applications, and case studies',
    exam_questions: 'High-frequency exam questions, probable viva/interview queries, and model answers',
    revision: 'Fast 5-minute revision flash-card style bullet points, key rules, and common mistakes to avoid',
  };

  const selectedTypeDescription = types[contentType] || types.notes;

  return `You are a world-class university professor and senior technical mentor.
Please generate educational content for the following request:

Subject: ${subject}
Topic: ${topic}
Type of Material: ${contentType.toUpperCase()} (${selectedTypeDescription})
Difficulty Level: ${difficulty}
Language: ${language || 'English'}

Instructions:
1. Provide rich Markdown formatting with headings (##, ###), bullet points, bold key terms, and code blocks where relevant.
2. Structure the content logically with clear progression.
3. Tailor explanations strictly to the "${difficulty}" level.
4. Include practical real-life examples and takeaways.
5. Maintain a professional, encouraging, and academically rigorous tone.`;
};

const buildQuizPrompt = ({ topic, subject, difficulty, numQuestions }) => {
  const count = parseInt(numQuestions, 10) || 5;

  return `You are an expert academic examiner. Create an objective multiple-choice quiz (MCQ) for students.

Subject: ${subject}
Topic: ${topic}
Target Difficulty: ${difficulty}
Number of Questions: ${count}

REQUIREMENTS:
1. Generate exactly ${count} multiple-choice questions.
2. Each question MUST have exactly 4 distinct options.
3. Provide the index of the correct answer (0, 1, 2, or 3).
4. Provide a clear, educational explanation for why that answer is correct.
5. Questions must be strictly relevant, pedagogically sound, and free of ambiguity.

Output JSON Format strictly matching:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Clear explanation of the correct answer."
    }
  ]
}`;
};

const buildRecommendationPrompt = ({ studentName, learningLevel, quizHistory, subjects }) => {
  return `You are an intelligent educational AI advisor. Analyze this student's performance profile and provide 3 to 5 targeted learning recommendations.

Student Name: ${studentName}
Current Level: ${learningLevel}
Available Subjects: ${JSON.stringify(subjects)}
Recent Quiz Results: ${JSON.stringify(quizHistory)}

Identify:
1. Weak topics where the student scored below 70% or struggled with time.
2. Strong topics where the student is ready for advanced challenges.
3. Logical next steps in their learning journey.

Output JSON Format strictly matching:
{
  "recommendations": [
    {
      "subjectName": "Name of Subject",
      "topicName": "Name of Topic",
      "reason": "Clear personalized explanation why this is recommended",
      "priority": "high", // "high" | "medium" | "low"
      "type": "study" // "study" | "practice" | "review" | "challenge"
    }
  ]
}`;
};

module.exports = {
  buildContentPrompt,
  buildQuizPrompt,
  buildRecommendationPrompt,
};
