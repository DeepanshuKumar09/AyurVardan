export type Dosha = 'Vata' | 'Pitta' | 'Kapha';

export interface QuestionOption {
  text: string;
  dosha?: Dosha;
}

export interface Question {
  id: string;
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'textarea' | 'text' | 'number';
  options?: QuestionOption[];
  placeholder?: string;
}

export interface QuestionnaireSection {
  id: 'onboarding' | 'prakriti' | 'vikriti' | 'diet' | 'lifestyle' | 'medical';
  title: string;
  questions: Question[];
}

export const questionnaireData: QuestionnaireSection[] = [
  {
    id: "onboarding",
    title: "Let's Get Started",
    questions: [
      {
        id: "name",
        text: "What's your name?",
        type: "text",
        placeholder: "Enter your full name",
      },
      {
        id: "age",
        text: "What's your age?",
        type: "number",
        placeholder: "Enter your age",
      },
      {
        id: "gender",
        text: "What's your gender?",
        type: "single-choice",
        options: [
          { text: "Female" },
          { text: "Male" },
          { text: "Other" },
        ],
      },
      {
        id: "weight",
        text: "What is your current weight (in kg)?",
        type: "number",
        placeholder: "Enter your weight in kilograms",
      },
    ],
  },
  {
    id: "prakriti",
    title: "Prakriti (Body Constitution)",
    questions: [
      {
        id: "bodyFrame",
        text: "How would you describe your body frame?",
        type: "single-choice",
        options: [
            { text: "Slender and light", dosha: "Vata" },
            { text: "Medium and muscular", dosha: "Pitta" },
            { text: "Sturdy and heavy", dosha: "Kapha" }
        ],
      },
      {
        id: "skinAndHair",
        text: "What is your natural skin and hair type?",
        type: "single-choice",
        options: [
            { text: "Dry and cool", dosha: "Vata" },
            { text: "Oily and warm", dosha: "Pitta" },
            { text: "Smooth and thick", dosha: "Kapha" }
        ],
      },
      {
        id: "energyLevels",
        text: "How would you describe your typical energy levels?",
        type: "single-choice",
        options: [
            { text: "Quick and enthusiastic bursts", dosha: "Vata" },
            { text: "Steady and intense", dosha: "Pitta" },
            { text: "Calm and enduring", dosha: "Kapha" }
        ],
      },
      {
        id: "emotionalState",
        text: "What is your most common emotional state under stress?",
        type: "single-choice",
        options: [
            { text: "Anxious or worried", dosha: "Vata" },
            { text: "Irritable or angry", dosha: "Pitta" },
            { text: "Calm or withdrawn", dosha: "Kapha" }
        ],
      },
      {
        id: "appetite",
        text: "How would you describe your appetite?",
        type: "single-choice",
        options: [
            { text: "Erratic or irregular", dosha: "Vata" },
            { text: "Strong and consistent", dosha: "Pitta" },
            { text: "Slow and steady", dosha: "Kapha" }
        ],
      },
    ],
  },
  {
    id: "vikriti",
    title: "Vikriti (Current Imbalance)",
    questions: [
        {
            id: 'recentChanges',
            text: 'Over the past few months, have you noticed any significant changes in your well-being?',
            type: 'multiple-choice',
            options: [
                { text: 'No significant changes' },
                { text: 'Changes in energy/fatigue' },
                { text: 'Changes in digestion/appetite' },
                { text: 'Changes in mood/stress levels' },
                { text: 'Changes in sleep patterns' }
            ],
        },
        {
            id: 'digestiveIssues',
            text: 'Are you experiencing any of the following? (Select all that apply)',
            type: 'multiple-choice',
            options: [
                { text: 'Gas', dosha: 'Vata' },
                { text: 'Bloating', dosha: 'Vata' },
                { text: 'Constipation', dosha: 'Vata' },
                { text: 'Loose stools', dosha: 'Pitta' },
                { text: 'Heartburn', dosha: 'Pitta' },
                { text: 'Indigestion', dosha: 'Kapha' },
                { text: 'None of the above' },
            ],
        },
        {
            id: 'sleepPatterns',
            text: 'How would you describe your sleep?',
            type: 'single-choice',
            options: [
                { text: 'Difficulty falling asleep', dosha: 'Vata' },
                { text: 'Waking up frequently', dosha: 'Pitta' },
                { text: 'Feeling tired even after a full night\'s sleep', dosha: 'Kapha' },
                { text: 'I sleep well' },
            ],
        },
        {
            id: 'painDiscomfort',
            text: 'Do you experience any significant physical pain?',
            type: 'multiple-choice',
            options: [
                { text: 'No, I don\'t have any pain' },
                { text: 'Occasional headaches' },
                { text: 'Joint pain or stiffness' },
                { text: 'Muscle aches or soreness' },
            ],
        },
         {
            id: 'mentalState',
            text: 'Have you noticed any current mental or emotional states?',
            type: 'multiple-choice',
            options: [
                { text: 'Anxiety', dosha: 'Vata' },
                { text: 'Irritability', dosha: 'Pitta' },
                { text: 'Brain fog', dosha: 'Kapha' },
                { text: 'Low motivation', dosha: 'Kapha' },
                { text: 'I feel mentally balanced' },
            ],
        },
    ]
  },
  {
    id: "diet",
    title: "Dietary Habits",
    questions: [
        {
            id: 'foodPreferences',
            text: 'Which tastes are you most drawn to?',
            type: 'multiple-choice',
            options: [{ text: 'Salty and sweet' }, { text: 'Spicy and sour' }, { text: 'Sweet and oily' }, { text: 'Bitter and astringent' }],
        },
        {
            id: 'mealRegularity',
            text: 'Do you eat your meals at consistent times each day?',
            type: 'single-choice',
            options: [{ text: 'Yes, always' }, { text: 'Most of the time' }, { text: 'Rarely or never' }],
        },
        {
            id: 'hydration',
            text: 'How much water do you typically drink in a day?',
            type: 'single-choice',
            options: [{ text: 'Less than 1 liter' }, { text: '1-2 liters' }, { text: 'More than 2 liters' }],
        },
        {
            id: 'cravings',
            text: 'Do you experience strong cravings for any particular foods?',
            type: 'multiple-choice',
            options: [
                { text: 'No strong cravings' },
                { text: 'Sweet foods (sugar, desserts)' },
                { text: 'Salty or savory snacks' },
                { text: 'Fried or oily foods' },
            ],
        },
         {
            id: 'eatingEnvironment',
            text: 'How do you typically eat your meals?',
            type: 'single-choice',
            options: [{ text: 'On the go' }, { text: 'While working or distracted' }, { text: 'Calmly and mindfully' }],
        },
    ]
  },
  {
      id: "lifestyle",
      title: "Lifestyle Patterns",
      questions: [
          {
            id: 'dailyRoutine',
            text: 'How would you describe your daily routine?',
            type: 'single-choice',
            options: [
                { text: 'Very consistent (set schedule)' },
                { text: 'Somewhat consistent' },
                { text: 'Irregular and changes often' },
            ],
          },
          {
            id: 'exercise',
            text: 'How would you describe your exercise habits?',
            type: 'single-choice',
            options: [
                { text: 'Regularly (3+ times a week)' },
                { text: 'Occasionally (1-2 times a week)' },
                { text: 'Rarely or never' },
                { text: 'I engage in light activity like walking' },
            ],
          },
          {
            id: 'stressSources',
            text: 'What are your primary sources of stress?',
            type: 'multiple-choice',
            options: [
                { text: 'Work or career' },
                { text: 'Family or relationships' },
                { text: 'Financial concerns' },
                { text: 'I don\'t feel particularly stressed' },
            ],
          },
          {
            id: 'stressCoping',
            text: 'How do you typically cope with stress?',
            type: 'multiple-choice',
            options: [
                { text: 'Exercise or physical activity' },
                { text: 'Meditation or mindfulness' },
                { text: 'Talking with friends or family' },
                { text: 'Hobbies or entertainment' },
            ],
          },
      ]
  },
  {
      id: "medical",
      title: "Medical History & Symptoms",
      questions: [
          {
            id: 'currentSymptoms',
            text: 'Are you currently experiencing any significant new symptoms?',
            type: 'single-choice',
            options: [
                { text: 'No, I feel generally well' },
                { text: 'Yes, mainly physical symptoms' },
                { text: 'Yes, mainly psychological/emotional symptoms' },
                { text: 'Yes, a mix of both' },
            ],
          },
          {
            id: 'existingConditions',
            text: 'Have you been diagnosed with any medical conditions or allergies?',
            type: 'multiple-choice',
            options: [
                { text: 'No known conditions or allergies' },
                { text: 'Seasonal or food allergies' },
                { text: 'A chronic condition (e.g., Asthma, Diabetes)' },
                { text: 'A past significant medical condition' },
            ],
          },
          {
            id: 'medications',
            text: 'Are you currently taking any medications or supplements?',
            type: 'single-choice',
            options: [
                { text: 'No, I am not taking anything' },
                { text: 'Yes, prescribed medications' },
                { text: 'Yes, over-the-counter supplements or herbs' },
                { text: 'Yes, both' },
            ],
          },
      ]
  }
];