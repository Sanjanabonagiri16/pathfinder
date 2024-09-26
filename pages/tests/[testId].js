import { useRouter } from 'next/router';
import Test from '../../components/Test';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const testQuestions = {
  'emotional-intelligence': [
    {
      question: "How well can you recognize emotions in others?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "emotional-recognition",
      explanation: "Recognizing emotions in others is a key component of emotional intelligence. It involves observing facial expressions, body language, and tone of voice to understand how others are feeling."
    },
    {
      question: "How well can you understand your own emotions?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "self-awareness",
      explanation: "Self-awareness is the ability to understand your own emotions, thoughts, and feelings. It helps you identify your strengths, weaknesses, and triggers."
    },
    {
      question: "How well can you manage your emotions in stressful situations?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "emotional-regulation",
      explanation: "Emotional regulation involves managing your emotions in a healthy and adaptive way. This includes techniques like deep breathing, mindfulness, and positive self-talk."
    },
    {
      question: "How well can you empathize with others?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "empathy",
      explanation: "Empathy is the ability to understand and share the feelings of others. It involves putting yourself in someone else's shoes and responding with compassion and understanding."
    },
    {
      question: "How well can you handle conflicts and disagreements?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "social-skills",
      explanation: "Handling conflicts and disagreements requires effective communication, active listening, and the ability to find common ground. It's important to approach conflicts with a positive attitude and a focus on resolution."
    },
    {
      question: "How well can you motivate yourself?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "self-motivation",
      explanation: "Self-motivation is the ability to stay focused and driven, even when faced with challenges or setbacks. It involves setting clear goals, breaking them down into smaller tasks, and maintaining a positive mindset."
    },
    {
      question: "How well can you handle criticism and feedback?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "resilience",
      explanation: "Handling criticism and feedback requires a growth mindset, the ability to take constructive criticism, and the willingness to learn and improve. It's important to separate the feedback from your personal identity and focus on the information it provides."
    },
    {
      question: "How well can you build and maintain positive relationships?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "relationship-building",
      explanation: "Building and maintaining positive relationships involves active listening, empathy, and effective communication. It's important to show genuine interest in others, be respectful, and contribute positively to the relationship."
    },
    {
      question: "How well can you handle rejection and setbacks?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "resilience",
      explanation: "Resilience is the ability to bounce back from adversity, rejection, and setbacks. It involves maintaining a positive attitude, learning from experiences, and adapting to new situations."
    },
    {
      question: "How well can you handle change and uncertainty?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "flexibility",
      explanation: "Flexibility is the ability to adapt to change and uncertainty. It involves being open to new ideas, embracing challenges, and maintaining a positive attitude."
    },
    {
      question: "How well can you handle stress and pressure?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "stress-management",
      explanation: "Stress management involves techniques like deep breathing, exercise, and time management. It's important to prioritize tasks, delegate when necessary, and take breaks to maintain overall well-being."
    },
    {
      question: "How well can you handle difficult conversations?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "communication-skills",
      explanation: "Handling difficult conversations requires preparation, active listening, and effective communication. It's important to approach the conversation with a clear goal, be assertive, and maintain a positive attitude."
    },
    {
      question: "How well can you handle feedback from others?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "feedback-reception",
      explanation: "Handling feedback from others requires a growth mindset, the ability to take constructive criticism, and the willingness to learn and improve. It's important to separate the feedback from your personal identity and focus on the information it provides."
    },
    {
      question: "How well can you handle conflicts within a team?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "teamwork",
      explanation: "Handling conflicts within a team requires effective communication, active listening, and the ability to find common ground. It's important to approach conflicts with a positive attitude and a focus on resolution."
    },
    {
      question: "How well can you handle disagreements with superiors?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "professional-relationships",
      explanation: "Handling disagreements with superiors requires effective communication, the ability to present your case calmly and professionally, and the willingness to seek common ground. It's important to approach the conversation with a positive attitude and a focus on resolution."
    },
    {
      question: "How well can you handle difficult clients or customers?",
      options: ["Very well", "Somewhat well", "Not very well", "Not at all"],
      correctAnswer: "Very well",
      type: "customer-service",
      explanation: "Handling difficult clients or customers requires active listening, empathy, and effective communication. It's important to remain calm, understand the situation, and focus on resolving the issue."
    }
  ],
  'aptitude': [
    {
      question: "If 2x + 3 = 11, what is the value of x?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      type: "quantitative",
      explanation: "To solve for x, first subtract 3 from both sides of the equation to get 2x = 8. Then, divide both sides by 2 to get x = 4."
    },
    {
      question: "What is the square root of 144?",
      options: ["10", "12", "14", "16"],
      correctAnswer: "12",
      type: "quantitative",
      explanation: "The square root of 144 is 12 because 12 * 12 = 144."
    },
    {
      question: "If a car travels 60 miles in 2 hours, what is its average speed?",
      options: ["15 mph", "30 mph", "45 mph", "60 mph"],
      correctAnswer: "30 mph",
      type: "quantitative",
      explanation: "To calculate average speed, divide the total distance traveled by the total time taken. In this case, 60 miles / 2 hours = 30 mph."
    },
    {
      question: "What is the value of π (pi) to two decimal places?",
      options: ["3.14", "3.16", "3.18", "3.20"],
      correctAnswer: "3.14",
      type: "quantitative",
      explanation: "The value of π (pi) is approximately 3.14."
    },
    {
      question: "What is the result of 2^3?",
      options: ["4", "6", "8", "10"],
      correctAnswer: "8",
      type: "quantitative",
      explanation: "To calculate 2^3, multiply 2 by itself 3 times: 2 * 2 * 2 = 8."
    },
    {
      question: "If a rectangle has a length of 8 units and a width of 5 units, what is its area?",
      options: ["30 square units", "40 square units", "50 square units", "60 square units"],
      correctAnswer: "40 square units",
      type: "quantitative",
      explanation: "To calculate the area of a rectangle, multiply the length by the width: 8 units * 5 units = 40 square units."
    },
    {
      question: "What is the value of log10(1000)?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
      type: "quantitative",
      explanation: "The logarithm base 10 of 1000 is 3 because 10^3 = 1000."
    },
    {
      question: "What is the result of 10% of 200?",
      options: ["10", "20", "30", "40"],
      correctAnswer: "20",
      type: "quantitative",
      explanation: "To calculate 10% of 200, multiply 200 by 0.1: 200 * 0.1 = 20."
    },
    {
      question: "If a circle has a radius of 7 units, what is its circumference?",
      options: ["14π units", "21π units", "28π units", "35π units"],
      correctAnswer: "14π units",
      type: "quantitative",
      explanation: "The circumference of a circle is calculated using the formula 2πr, where r is the radius. In this case, 2 * π * 7 = 14π units."
    },
    {
      question: "What is the value of 5! (factorial of 5)?",
      options: ["10", "20", "30", "120"],
      correctAnswer: "120",
      type: "quantitative",
      explanation: "The factorial of 5 is calculated by multiplying all positive integers from 1 to 5: 5 * 4 * 3 * 2 * 1 = 120."
    },
    {
      question: "If a triangle has a base of 6 units and a height of 8 units, what is its area?",
      options: ["24 square units", "32 square units", "40 square units", "48 square units"],
      correctAnswer: "24 square units",
      type: "quantitative",
      explanation: "To calculate the area of a triangle, use the formula 0.5 * base * height. In this case, 0.5 * 6 * 8 = 24 square units."
    },
    {
      question: "What is the result of 3^2 + 4^2?",
      options: ["13", "25", "35", "41"],
      correctAnswer: "25",
      type: "quantitative",
      explanation: "To calculate 3^2 + 4^2, square each number and then add them together: 9 + 16 = 25."
    },
    {
      question: "What is the value of sin(30°) to two decimal places?",
      options: ["0.43", "0.50", "0.57", "0.60"],
      correctAnswer: "0.50",
      type: "quantitative",
      explanation: "The sine of 30° is 0.5."
    },
    {
      question: "What is the result of 100 ÷ 25?",
      options: ["2", "4", "6", "8"],
      correctAnswer: "4",
      type: "quantitative",
      explanation: "To divide 100 by 25, perform the division: 100 ÷ 25 = 4."
    },
    {
      question: "If a sphere has a radius of 3 units, what is its volume?",
      options: ["18π cubic units", "36π cubic units", "54π cubic units", "72π cubic units"],
      correctAnswer: "36π cubic units",
      type: "quantitative",
      explanation: "The volume of a sphere is calculated using the formula 4/3πr^3, where r is the radius. In this case, 4/3 * π * 3^3 = 36π cubic units."
    }
  ],
  'verbal-ability': [
    {
      question: "Choose the correct form of the verb: She _____ to the store yesterday.",
      options: ["go", "goes", "went", "gone"],
      correctAnswer: "went",
      type: "grammar",
      explanation: "The correct form of the verb in this sentence is 'went' because the subject 'she' is singular and the verb tense is past."
    },
    {
      question: "Which word is a synonym for 'happy'?",
      options: ["sad", "joyful", "angry", "tired"],
      correctAnswer: "joyful",
      type: "vocabulary",
      explanation: "The word 'joyful' is a synonym for 'happy'."
    },
    {
      question: "Identify the antonym of 'hot':",
      options: ["cold", "warm", "lukewarm", "freezing"],
      correctAnswer: "cold",
      type: "vocabulary",
      explanation: "The antonym of 'hot' is 'cold'."
    },
    {
      question: "Which sentence is grammatically correct?",
      options: ["I have been to the store.", "I have go to the store.", "I have went to the store.", "I have goed to the store."],
      correctAnswer: "I have been to the store.",
      type: "grammar",
      explanation: "The correct form of the verb in this sentence is 'have been' because the verb tense is present perfect."
    },
    {
      question: "Choose the word that completes the analogy: Cat is to kitten as dog is to _____.",
      options: ["puppy", "cub", "doggy", "doglet"],
      correctAnswer: "puppy",
      type: "analogical-reasoning",
      explanation: "The word that completes the analogy is 'puppy'."
    },
    {
      question: "Which word is a homophone for 'read'?",
      options: ["reed", "red", "ride", "raid"],
      correctAnswer: "reed",
      type: "vocabulary",
      explanation: "The word 'reed' is a homophone for 'read'."
    },
    {
      question: "Identify the antonym of 'loud':",
      options: ["soft", "quiet", "silent", "noisy"],
      correctAnswer: "soft",
      type: "vocabulary",
      explanation: "The antonym of 'loud' is 'soft'."
    },
    {
      question: "Which sentence is grammatically correct?",
      options: ["She has been to the store.", "She have been to the store.", "She have go to the store.", "She have goed to the store."],
      correctAnswer: "She has been to the store.",
      type: "grammar",
      explanation: "The correct form of the verb in this sentence is 'has been' because the verb tense is present perfect."
    },
    {
      question: "Choose the word that completes the analogy: Bird is to nest as fish is to _____.",
      options: ["pond", "lake", "aquarium", "habitat"],
      correctAnswer: "pond",
      type: "analogical-reasoning",
      explanation: "The word that completes the analogy is 'pond'."
    },
    {
      question: "Which word is a homophone for 'sea'?",
      options: ["see", "sea", "seaweed", "seashell"],
      correctAnswer: "see",
      type: "vocabulary",
      explanation: "The word 'see' is a homophone for 'sea'."
    },
    {
      question: "Identify the antonym of 'loud':",
      options: ["soft", "quiet", "silent", "noisy"],
      correctAnswer: "soft",
      type: "vocabulary",
      explanation: "The antonym of 'loud' is 'soft'."
    },
    {
      question: "Which sentence is grammatically correct?",
      options: ["They have been to the store.", "They have go to the store.", "They have went to the store.", "They have goed to the store."],
      correctAnswer: "They have been to the store.",
      type: "grammar",
      explanation: "The correct form of the verb in this sentence is 'have been' because the verb tense is present perfect."
    },
    {
      question: "Choose the word that completes the analogy: Sun is to day as moon is to _____.",
      options: ["night", "daylight", "twilight", "moonlight"],
      correctAnswer: "night",
      type: "analogical-reasoning",
      explanation: "The word that completes the analogy is 'night'."
    },
    {
      question: "Which word is a homophone for 'meat'?",
      options: ["meet", "meat", "meetup", "meeting"],
      correctAnswer: "meet",
      type: "vocabulary",
      explanation: "The word 'meet' is a homophone for 'meat'."
    },
    {
      question: "Identify the antonym of 'hot':",
      options: ["cold", "warm", "lukewarm", "freezing"],
      correctAnswer: "cold",
      type: "vocabulary",
      explanation: "The antonym of 'hot' is 'cold'."
    }
  ],
  'mock-interviews': [
    {
      question: "Tell me about yourself.",
      options: [
        "Start with personal details",
        "Focus on professional experience",
        "Discuss hobbies and interests",
        "Provide a brief overview of education and career"
      ],
      correctAnswer: "Provide a brief overview of education and career",
      type: "general",
      explanation: "When answering this question, it's important to provide a concise and relevant summary of your education and professional experience. Avoid personal details unless they are directly related to the job you're applying for."
    },
    {
      question: "Why do you want to work for our company?",
      options: [
        "Mention specific company values",
        "Highlight relevant skills and experiences",
        "Discuss future goals and aspirations",
        "Express enthusiasm and passion"
      ],
      correctAnswer: "Mention specific company values",
      type: "company-specific",
      explanation: "When answering this question, it's important to demonstrate your understanding of the company's mission, values, and culture. Mention specific values that resonate with you and explain how your skills and experiences align with those values."
    },
    {
      question: "What are your strengths?",
      options: [
        "Focus on teamwork and collaboration",
        "Highlight problem-solving abilities",
      ],
      correctAnswer: "Focus on teamwork and collaboration",
      type: "strengths",
      explanation: "When answering this question, it's important to highlight your ability to work well with others and contribute positively to a team. Emphasize your communication skills, adaptability, and willingness to learn."
    },
    {
      question: "What are your weaknesses?",
      options: [
        "Be honest and specific",
        "Avoid making up weaknesses",
        "Provide examples of how you're working on them",
        "Show self-awareness"
      ],
      correctAnswer: "Be honest and specific",
      type: "weaknesses",
      explanation: "When answering this question, it's important to be honest and specific about areas where you could improve. Avoid making up weaknesses or exaggerating them. Instead, focus on areas where you're actively working on self-improvement."
    },
    {
      question: "How do you handle criticism?",
      options: [
        "Listen actively",
        "Reflect on the feedback",
        "Take responsibility for your actions",
        "Implement changes based on feedback"
      ],
      correctAnswer: "Listen actively",
      type: "criticism",
      explanation: "When answering this question, it's important to demonstrate your ability to listen actively and respond appropriately to criticism. Emphasize your willingness to learn from feedback and take responsibility for your actions."
    },
    {
      question: "How do you handle conflicts?",
      options: [
        "Communicate openly and honestly",
        "Seek common ground",
        "Focus on solutions rather than blame",
        "Maintain a positive attitude"
      ],
      correctAnswer: "Communicate openly and honestly",
      type: "conflict-management",
      explanation: "When answering this question, it's important to demonstrate your ability to handle conflicts in a constructive and professional manner. Emphasize your communication skills, willingness to seek common ground, and focus on finding solutions."
    },
    {
      question: "How do you handle stress?",
      options: [
        "Prioritize tasks",
        "Delegate when possible",
        "Take breaks when needed",
        "Maintain a positive attitude"
      ],
      correctAnswer: "Prioritize tasks",
      type: "stress-management",
      explanation: "When answering this question, it's important to demonstrate your ability to manage stress effectively. Emphasize your ability to prioritize tasks, delegate when necessary, and take breaks when needed to maintain overall well-being."
    },
    {
      question: "How do you handle change?",
      options: [
        "Embrace new opportunities",
        "Adapt to change",
        "Learn from change",
        "Maintain a positive attitude"
      ],
      correctAnswer: "Embrace new opportunities",
      type: "change-management",
      explanation: "When answering this question, it's important to demonstrate your ability to adapt to change and embrace new opportunities. Emphasize your willingness to learn from change and maintain a positive attitude."
    },
    {
      question: "How do you handle rejection?",
      options: [
        "Reflect on the situation",
        "Learn from the experience",
        "Maintain a positive attitude",
        "Focus on future opportunities"
      ],
      correctAnswer: "Reflect on the situation",
      type: "rejection-handling",
      explanation: "When answering this question, it's important to demonstrate your ability to handle rejection gracefully. Emphasize your ability to reflect on the situation, learn from the experience, and maintain a positive attitude."
    },
    {
      question: "How do you handle setbacks?",
      options: [
        "Learn from the experience",
        "Adapt to the situation",
        "Maintain a positive attitude",
        "Focus on future opportunities"
      ],
      correctAnswer: "Learn from the experience",
      type: "setback-handling",
      explanation: "When answering this question, it's important to demonstrate your ability to handle setbacks effectively. Emphasize your ability to learn from the experience, adapt to the situation, and maintain a positive attitude."
    },
    {
      question: "How do you handle difficult clients or customers?",
      options: [
        "Listen actively",
        "Empathize with their situation",
        "Maintain a positive attitude",
        "Focus on resolving the issue"
      ],
      correctAnswer: "Listen actively",
      type: "customer-service",
      explanation: "When answering this question, it's important to demonstrate your ability to handle difficult clients or customers professionally. Emphasize your ability to listen actively, empathize with their situation, and focus on resolving the issue."
    },
    {
      question: "How do you handle disagreements with superiors?",
      options: [
        "Communicate openly and honestly",
        "Present your case calmly and professionally",
        "Seek common ground",
        "Focus on solutions rather than blame"
      ],
      correctAnswer: "Communicate openly and honestly",
      type: "professional-relationships",
      explanation: "When answering this question, it's important to demonstrate your ability to handle disagreements with superiors professionally. Emphasize your communication skills, ability to present your case calmly and professionally, and willingness to seek common ground."
    },
    {
      question: "How do you handle difficult conversations?",
      options: [
        "Prepare thoroughly",
        "Listen actively",
        "Speak clearly and concisely",
        "Maintain a positive attitude"
      ],
      correctAnswer: "Prepare thoroughly",
      type: "communication-skills",
      explanation: "When answering this question, it's important to demonstrate your ability to handle difficult conversations effectively. Emphasize your ability to prepare thoroughly, listen actively, and speak clearly and concisely."
    },
    {
      question: "How do you handle feedback from others?",
      options: [
        "Listen actively",
        "Reflect on the feedback",
        "Take responsibility for your actions",
        "Implement changes based on feedback"
      ],
      correctAnswer: "Listen actively",
      type: "feedback-reception",
      explanation: "When answering this question, it's important to demonstrate your ability to handle feedback from others professionally. Emphasize your ability to listen actively, reflect on the feedback, and take responsibility for your actions."
    },
    {
      question: "How do you handle conflicts within a team?",
      options: [
        "Communicate openly and honestly",
        "Seek common ground",
        "Focus on solutions rather than blame",
        "Maintain a positive attitude"
      ],
      correctAnswer: "Communicate openly and honestly",
      type: "teamwork",
      explanation: "When answering this question, it's important to demonstrate your ability to handle conflicts within a team professionally. Emphasize your communication skills, willingness to seek common ground, and focus on finding solutions."
    }
  ],
  'game-aptitude': [
    {
      question: "In a strategy game, which of these actions would likely give you the best long-term advantage?",
      options: ["Aggressive expansion", "Defensive fortification", "Resource stockpiling", "Technological advancement"],
      correctAnswer: "Technological advancement",
      type: "strategy",
      explanation: "Technological advancement often provides the best long-term advantage in strategy games. It allows you to unlock new units, buildings, and abilities that can give you a significant edge over your opponents."
    },
    {
      question: "What does 'FPS' stand for in gaming?",
      options: ["First Person Shooter", "Frames Per Second", "Final Player Standing", "Free Play Session"],
      correctAnswer: "First Person Shooter",
      type: "gaming-terms",
      explanation: "FPS stands for 'First Person Shooter', which is a genre of video games where the player experiences the game world from the first-person perspective of the protagonist."
    },
    {
      question: "In a real-time strategy game, which resource is most important for building units?",
      options: ["Gold", "Wood", "Stone", "Food"],
      correctAnswer: "Gold",
      type: "strategy",
      explanation: "In most real-time strategy games, gold (or a similar currency) is the primary resource for building units. It's often the most versatile resource and is required for almost all unit production."
    },
    {
      question: "What is the primary goal in a tower defense game?",
      options: ["Defeat all enemies", "Build the tallest tower", "Collect the most resources", "Survive for the longest time"],
      correctAnswer: "Survive for the longest time",
      type: "tower-defense",
      explanation: "The primary goal in a tower defense game is to survive for the longest time by preventing enemies from reaching their objective. This is typically done by strategically placing defensive structures or 'towers' along the enemy's path."
    },
    {
      question: "In a role-playing game, which stat is most important for a warrior character?",
      options: ["Intelligence", "Dexterity", "Strength", "Charisma"],
      correctAnswer: "Strength",
      type: "role-playing",
      explanation: "In most role-playing games, strength is the most important stat for a warrior character. It typically affects physical damage output, the ability to wear heavy armor, and carry capacity."
    },
    {
      question: "What is the main objective in a puzzle game?",
      options: ["Defeat enemies", "Complete levels", "Solve puzzles", "Explore a world"],
      correctAnswer: "Solve puzzles",
      type: "puzzle",
      explanation: "The main objective in a puzzle game is to solve puzzles. These games challenge the player's problem-solving skills, logic, and sometimes speed or reflexes."
    },
    {
      question: "In a racing game, which car upgrade is most beneficial for speed?",
      options: ["Engine", "Tires", "Body", "Spoiler"],
      correctAnswer: "Engine",
      type: "racing",
      explanation: "In racing games, engine upgrades are typically the most beneficial for increasing a car's speed. The engine directly affects the car's acceleration and top speed."
    },
    {
      question: "What is the primary focus in a simulation game?",
      options: ["Combat", "Exploration", "Management", "Strategy"],
      correctAnswer: "Management",
      type: "simulation",
      explanation: "The primary focus in a simulation game is usually management. These games often involve overseeing complex systems, whether it's a city, a business, or a virtual life."
    },
    {
      question: "In a sports game, which skill is most important for a successful basketball player?",
      options: ["Speed", "Strength", "Agility", "Endurance"],
      correctAnswer: "Agility",
      type: "sports",
      explanation: "In basketball games, agility is often the most important skill for a player. It affects a player's ability to move quickly, change direction, and perform complex maneuvers with the ball."
    },
    {
      question: "What is the main mechanic in a platformer game?",
      options: ["Combat", "Puzzles", "Exploration", "Platforming"],
      correctAnswer: "Platforming",
      type: "platformer",
      explanation: "The main mechanic in a platformer game is platforming, which involves navigating the character through the game world by jumping between platforms, over obstacles, or both."
    },
    {
      question: "In a survival game, which resource is most crucial for survival?",
      options: ["Food", "Water", "Shelter", "Fire"],
      correctAnswer: "Water",
      type: "survival",
      explanation: "In most survival games, water is the most crucial resource for survival. While all listed resources are important, dehydration typically occurs faster than starvation, making water a top priority."
    },
    {
      question: "What is the primary objective in a stealth game?",
      options: ["Combat", "Exploration", "Stealth", "Puzzles"],
      correctAnswer: "Stealth",
      type: "stealth",
      explanation: "The primary objective in a stealth game is to use stealth tactics to avoid detection and complete objectives. This often involves sneaking past enemies, hiding in shadows, and using distractions."
    },
    {
      question: "In a fighting game, which character type is known for their speed and agility?",
      options: ["Powerhouse", "Grappler", "Wrestler", "Assassin"],
      correctAnswer: "Assassin",
      type: "fighting",
      explanation: "In fighting games, assassin-type characters are typically known for their speed and agility. They often rely on quick attacks and mobility to outmaneuver their opponents."
    },
    {
      question: "What is the main focus in a city-building game?",
      options: ["Combat", "Exploration", "Management", "Strategy"],
      correctAnswer: "Management",
      type: "city-building",
      explanation: "The main focus in a city-building game is management. Players typically need to manage resources, plan city layouts, and balance the needs of their virtual citizens."
    }
  ],
};

const backgroundStyles = {
  'emotional-intelligence': 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500',
  'aptitude': 'bg-gradient-to-br from-green-400 via-blue-400 to-purple-500',
  'verbal-ability': 'bg-gradient-to-br from-yellow-400 via-red-400 to-pink-500',
  'mock-interviews': 'bg-gradient-to-br from-blue-400 via-green-400 to-yellow-500',
  'game-aptitude': 'bg-gradient-to-br from-red-400 via-purple-400 to-blue-500',
};

export default function TestPage() {
  const router = useRouter();
  const { testId } = router.query;
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [score, setScore] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(40);

  useEffect(() => {
    setMounted(true);
    if (testId) {
      const storedAttempts = localStorage.getItem(`${testId}_attempts`);
      if (storedAttempts) {
        setAttemptsLeft(parseInt(storedAttempts));
      } else {
        localStorage.setItem(`${testId}_attempts`, '40');
      }
    }
  }, [testId]);

  useEffect(() => {
    if (mounted && testId) {
      if (!testQuestions[testId]) {
        console.error(`No questions found for test ID: ${testId}`);
        setError(`Invalid test ID: ${testId}`);
      }
    }
  }, [mounted, testId]);

  if (!mounted || !testId) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg"
        >
          <p className="text-2xl font-semibold text-white">Error: {error}</p>
        </motion.div>
      </div>
    );
  }

  if (!testQuestions[testId]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-500 to-red-500">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg"
        >
          <p className="text-2xl font-semibold text-white">No questions available for this test.</p>
        </motion.div>
      </div>
    );
  }

  const gradient = backgroundStyles[testId] || backgroundStyles['aptitude'];

  const generateLearningPath = (score, totalQuestions) => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage < 40) {
      return {
        message: "Your score indicates that you may benefit from foundational learning in this area. Consider starting with basic concepts and gradually building up your knowledge.",
        link: `/learning-paths/${testId}/beginner`
      };
    } else if (percentage < 70) {
      return {
        message: "You've shown a good understanding of the basics. Focus on strengthening your weak areas and diving deeper into more complex topics.",
        link: `/learning-paths/${testId}/intermediate`
      };
    } else {
      return {
        message: "Great job! You've demonstrated strong knowledge in this area. Consider exploring advanced topics and real-world applications to further enhance your skills.",
        link: `/learning-paths/${testId}/advanced`
      };
    }
  };

  const handleTestComplete = (score, totalQuestions) => {
    setScore(score);
    setLearningPath(generateLearningPath(score, totalQuestions));
    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);
    localStorage.setItem(`${testId}_attempts`, newAttemptsLeft.toString());
    setShowTest(false);
  };

  return (
    <div className={`min-h-screen ${gradient} py-12 transition-all duration-500 ease-in-out`}>
      <div className="container mx-auto px-4">
        {!showTest ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <h1 className="text-4xl font-bold mb-8 text-center text-white animate-pulse">
              {testId.replace('-', ' ')} Test
            </h1>
            <p className="text-xl text-white mb-4 text-center">
              Are you ready to challenge yourself? Click the button below to start the test!
            </p>
            <p className="text-lg text-white mb-8 text-center">
              Attempts left: {attemptsLeft}
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTest(true)}
                className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-white border-2 border-white rounded-full hover:text-gray-900 group hover:bg-gray-50"
                disabled={attemptsLeft <= 0}
              >
                <span className="absolute left-0 block w-full h-0 transition-all bg-white opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="relative">{attemptsLeft > 0 ? 'Start Test' : 'No attempts left'}</span>
              </motion.button>
            </div>
            {score !== null && (
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">Your Last Score: {score}/{testQuestions[testId].length}</h2>
                <p className="text-lg text-white mb-4">{learningPath.message}</p>
                <a 
                  href={learningPath.link}
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 text-lg font-semibold"
                >
                  View Learning Resources
                </a>
              </div>
            )}
          </motion.div>
        ) : (
          <Test 
            questions={testQuestions[testId]} 
            testName={testId.replace('-', ' ')} 
            questionClassName="text-xl font-semibold mb-4 text-gray-800"
            optionClassName="text-lg text-gray-700 mb-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300"
            onTestComplete={handleTestComplete}
            timeLimit={20 * 60} // 20 minutes in seconds
          />
        )}
      </div>
    </div>
  );
}