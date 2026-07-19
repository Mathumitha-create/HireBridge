// Dynamic question bank and generator for HireBridge
// Supports role-specific questions with difficulty and topic tags.

const ALLOWED_ROLES = [
  "Software Developer",
  "Data Analyst",
  "AI / ML Engineer",
  "HR / Management",
];

const QUESTION_BANK = {
  "Software Developer": [
    { difficulty: "easy", topic: "fundamentals", question_type: "conceptual", text: "In your own words, what is the difference between a function and a class in a language you use often?" },
    { difficulty: "easy", topic: "frontend", question_type: "conceptual", text: "Describe how the browser handles an HTTP GET request from typing a URL to rendering the page." },
    { difficulty: "easy", topic: "basics", question_type: "conceptual", text: "Can you explain what version control is and why it's important in software development?" },
    { difficulty: "easy", topic: "debugging", question_type: "debugging", text: "Look at this code snippet. Can you identify what's wrong and explain how you would fix it?",
      code_snippet: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}
// Bug: Array index out of bounds` },
    { difficulty: "medium", topic: "backend", question_type: "conceptual", text: "How would you design a simple authentication flow for a web app using an API and a database?" },
    { difficulty: "medium", topic: "dsa", question_type: "conceptual", text: "Explain when you would use a hash map versus an array, and why." },
    { difficulty: "medium", topic: "performance", question_type: "debugging", text: "This React component is causing performance issues. What's the problem and how would you optimize it?",
      code_snippet: `function UserList({ users }) {
  return (
    <div>
      {users.map((user) => {
        const processedData = expensiveOperation(user);
        return <UserCard key={user.id} data={processedData} />;
      })}
    </div>
  );
}
// Issue: Expensive operation runs on every render` },
    { difficulty: "medium", topic: "api", question_type: "conceptual", text: "Describe how you would design a RESTful API for a blog platform. What endpoints would you create?" },
    { difficulty: "medium", topic: "coding", question_type: "coding", text: "Write a function that removes duplicate values from an array while preserving the original order. Explain your approach.",
      code_snippet: `function removeDuplicates(arr) {
  // Your implementation here
  
}

// Example: [1, 2, 2, 3, 4, 3, 5] → [1, 2, 3, 4, 5]` },
    { difficulty: "hard", topic: "system_design", question_type: "conceptual", text: "How would you design a scalable API for a code-submission platform that must handle concurrent requests and background processing?" },
    { difficulty: "hard", topic: "architecture", question_type: "conceptual", text: "Explain the trade-offs between microservices and monolithic architecture. When would you choose one over the other?" },
    { difficulty: "hard", topic: "debugging_advanced", question_type: "debugging", text: "This async code has a subtle race condition. Can you identify it and propose a solution?",
      code_snippet: `async function processOrders(orderIds) {
  let totalRevenue = 0;
  
  orderIds.forEach(async (id) => {
    const order = await fetchOrder(id);
    totalRevenue += order.amount;
  });
  
  return totalRevenue;
}
// Bug: totalRevenue returns before async operations complete` },
  ],

  "Data Analyst": [
    { difficulty: "easy", topic: "sql", question_type: "coding", text: "Write a SQL query to count the number of users who signed up in the last 7 days.",
      code_snippet: `SELECT -- Your query here
FROM users
WHERE -- Filter condition

-- Table: users (id, name, signup_date)` },
    { difficulty: "easy", topic: "cleaning", question_type: "conceptual", text: "Describe your approach when you find many missing values in a numeric column." },
    { difficulty: "easy", topic: "basics", question_type: "conceptual", text: "What is the difference between mean, median, and mode? When would you use each?" },
    { difficulty: "easy", topic: "tools", question_type: "conceptual", text: "What data analysis tools or software are you most comfortable with, and why?" },
    { difficulty: "medium", topic: "pandas", question_type: "coding", text: "Using Pandas, write code to group sales data by region and compute total revenue per region.",
      code_snippet: `import pandas as pd

# df has columns: region, product, revenue
df = pd.DataFrame(...)

# Your code here
result = ` },
    { difficulty: "medium", topic: "viz", question_type: "conceptual", text: "Which visualization would you use to compare the distribution of two numeric variables, and why?" },
    { difficulty: "medium", topic: "analysis", question_type: "conceptual", text: "How would you approach analyzing customer churn data to identify key patterns?" },
    { difficulty: "medium", topic: "joins", question_type: "conceptual", text: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN with a practical example." },
    { difficulty: "hard", topic: "insights", question_type: "conceptual", text: "You see a sudden spike in churn rate in your dashboard. Walk me through how you would investigate and validate the cause." },
    { difficulty: "hard", topic: "prediction", question_type: "conceptual", text: "How would you build a predictive model to forecast next quarter's sales based on historical data?" },
    { difficulty: "hard", topic: "debugging_sql", question_type: "debugging", text: "This SQL query is supposed to find top customers but returns incorrect results. What's wrong?",
      code_snippet: `SELECT customer_id, SUM(order_total)
FROM orders
WHERE order_date > '2024-01-01'
ORDER BY SUM(order_total) DESC
LIMIT 10;

-- Error: Column 'customer_id' must appear in GROUP BY` },
  ],

  "AI / ML Engineer": [
    { difficulty: "easy", topic: "basics", question_type: "conceptual", text: "What is the difference between supervised and unsupervised learning? Give one example of each." },
    { difficulty: "easy", topic: "overfitting", question_type: "conceptual", text: "How would you explain overfitting to a non-technical stakeholder?" },
    { difficulty: "easy", topic: "algorithms", question_type: "conceptual", text: "Can you explain the difference between classification and regression problems?" },
    { difficulty: "easy", topic: "preprocessing", question_type: "coding", text: "Write code to normalize a dataset using min-max scaling. Explain why this is important.",
      code_snippet: `import numpy as np

def normalize_data(data):
    # Your implementation here
    # Apply min-max scaling: (x - min) / (max - min)
    pass

# Example: [1, 2, 3, 4, 5] → [0, 0.25, 0.5, 0.75, 1.0]` },
    { difficulty: "medium", topic: "evaluation", question_type: "conceptual", text: "For an imbalanced binary classification problem, which metrics would you focus on and why?" },
    { difficulty: "medium", topic: "training", question_type: "conceptual", text: "Describe the steps you follow to take a raw dataset to a trained model ready for evaluation." },
    { difficulty: "medium", topic: "features", question_type: "conceptual", text: "What is feature engineering and why is it important? Give an example from your experience." },
    { difficulty: "medium", topic: "model_debug", question_type: "debugging", text: "This model training code has an issue causing poor performance. What's the problem?",
      code_snippet: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X_train, X_test, y_train, y_test = train_test_split(X, y)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.fit_transform(X_test)

model.fit(X_train_scaled, y_train)

# Bug: Test data scaling is wrong` },
    { difficulty: "hard", topic: "deployment", question_type: "conceptual", text: "How would you design a pipeline to deploy, monitor, and periodically retrain a production ML model?" },
    { difficulty: "hard", topic: "optimization", question_type: "conceptual", text: "Explain how you would optimize a deep learning model that's too slow for production use." },
    { difficulty: "hard", topic: "ethics", question_type: "conceptual", text: "How would you detect and mitigate bias in a machine learning model used for loan approvals?" },
  ],

  "HR / Management": [
    { difficulty: "easy", topic: "communication", question_type: "conceptual", text: "Tell me about a time you had to explain a difficult message to a team member. How did you approach it?" },
    { difficulty: "easy", topic: "teamwork", question_type: "conceptual", text: "How do you build trust with a new team you are leading?" },
    { difficulty: "easy", topic: "motivation", question_type: "conceptual", text: "What strategies do you use to keep your team motivated during challenging projects?" },
    { difficulty: "easy", topic: "feedback", question_type: "conceptual", text: "How do you approach giving constructive feedback to underperforming team members?" },
    { difficulty: "medium", topic: "conflict", question_type: "conceptual", text: "Describe a situation where two key team members disagreed strongly. How would you handle it as their manager?" },
    { difficulty: "medium", topic: "leadership", question_type: "conceptual", text: "How do you balance delivering results with supporting your team's well-being?" },
    { difficulty: "medium", topic: "delegation", question_type: "conceptual", text: "How do you decide which tasks to delegate and which to handle yourself?" },
    { difficulty: "medium", topic: "performance", question_type: "conceptual", text: "What's your approach to setting clear performance expectations for your team?" },
    { difficulty: "hard", topic: "strategy", question_type: "conceptual", text: "You have to lead a major change initiative with tight deadlines and some resistance. How would you plan and execute it?" },
    { difficulty: "hard", topic: "culture", question_type: "conceptual", text: "How would you transform a team with low morale and poor collaboration into a high-performing unit?" },
    { difficulty: "hard", topic: "crisis", question_type: "conceptual", text: "Describe how you would handle a situation where a critical project is failing and stakeholders are losing confidence." },
  ],
};

function pickNextDifficulty(lastScore) {
  if (lastScore == null || Number.isNaN(lastScore)) return "easy";
  if (lastScore <= 4) return "easy";
  if (lastScore <= 7) return "medium";
  return "hard";
}

function generateNextQuestion({ role, lastScore = null, lastTopic = null, askedTopics = [], askedQuestions = [] }) {
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error(`Unsupported role: ${role}`);
  }

  const questions = QUESTION_BANK[role] || [];
  if (!questions.length) {
    throw new Error(`No questions configured for role: ${role}`);
  }

  const targetDifficulty = pickNextDifficulty(lastScore);

  // Filter by difficulty first
  let candidates = questions.filter((q) => q.difficulty === targetDifficulty);
  
  // CRITICAL: Filter out questions that have already been asked (by exact text match)
  if (askedQuestions && askedQuestions.length > 0) {
    const notAskedYet = candidates.filter((q) => !askedQuestions.includes(q.text));
    if (notAskedYet.length > 0) {
      candidates = notAskedYet;
      console.log(`✅ ${candidates.length} new questions available at ${targetDifficulty} difficulty`);
    } else {
      // All questions at this difficulty have been asked, log warning
      console.log(`⚠️ All ${targetDifficulty} questions already asked, may need to reuse or expand question bank`);
    }
  }
  
  // Secondary filter: Try to avoid repeating topics
  if (askedTopics && askedTopics.length > 0 && candidates.length > 1) {
    const notAskedTopics = candidates.filter((q) => !askedTopics.includes(q.topic));
    if (notAskedTopics.length > 0) {
      candidates = notAskedTopics;
    } else if (lastTopic) {
      // If all topics asked, at least avoid the immediate last topic
      const nonRepeats = candidates.filter((q) => q.topic !== lastTopic);
      if (nonRepeats.length > 0) {
        candidates = nonRepeats;
      }
    }
  }

  // If we filtered too much and have no candidates, expand back to unused questions at target difficulty
  if (candidates.length === 0) {
    candidates = questions.filter((q) => 
      q.difficulty === targetDifficulty && !askedQuestions.includes(q.text)
    );
  }
  
  // If still no candidates (all questions asked), use all questions at target difficulty
  if (candidates.length === 0) {
    candidates = questions.filter((q) => q.difficulty === targetDifficulty);
    console.log(`⚠️ Reusing questions - all ${targetDifficulty} questions have been asked before`);
  }
  
  // Last resort: use all questions
  if (candidates.length === 0) {
    candidates = questions;
  }

  // Pick a random question from candidates
  const next = candidates[Math.floor(Math.random() * candidates.length)];

  // Build response with all fields (backwards compatible)
  const response = {
    question: next.text,
    topic_tag: next.topic,
    next_question_difficulty: next.difficulty,
    question_type: next.question_type || "conceptual", // Default to conceptual
  };

  // Add code_snippet only if present (additive field)
  if (next.code_snippet) {
    response.code_snippet = next.code_snippet;
  }

  return response;
}

module.exports = {
  ALLOWED_ROLES,
  generateNextQuestion,
};
