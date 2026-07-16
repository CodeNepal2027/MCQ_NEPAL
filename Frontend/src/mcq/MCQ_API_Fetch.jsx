// Mock API functions - Replace with actual API calls

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Mock Categories Data with Bootstrap Icons
const mockCategories = [
    {
        id: 'entrance',
        name: 'Entrance',
        icon: 'bi-mortarboard-fill',
        color: '#b226dc',
        description: 'University & College Entrance Exams',
        subCategories: [
            { id: 'cmat', name: 'CMAT', description: 'Central Management Admission Test' },
            { id: 'ioe', name: 'Pulchowk Engineering IOE', description: 'Institute of Engineering Entrance' },
            { id: 'loksewa', name: 'LokSewa', description: 'Public Service Commission Exams' },
            { id: 'medical', name: 'Medical Entrance', description: 'MBBS, BDS & Nursing Entrance' }
        ]
    },
    {
        id: 'license',
        name: 'License',
        icon: 'bi-award-fill',
        color: '#2d6a9f',
        description: 'Professional & Driving Licenses',
        subCategories: [
            { id: 'engineering_license', name: 'Engineering License', description: 'Nepal Engineering Council License' },
            { id: 'driving', name: 'Driving License', description: 'Vehicle Driving License' },
            { id: 'teaching', name: 'Teaching License', description: 'Teacher Service Commission' }
        ]
    },
    {
        id: 'loksewa',
        name: 'LokSewa',
        icon: 'bi-building-fill',
        color: '#2a9d8f',
        description: 'Public Service Commission Exams',
        subCategories: [
            { id: 'admin', name: 'Administration', description: 'Administration Services' },
            { id: 'police', name: 'Police Services', description: 'Police Services' },
            { id: 'education', name: 'Education', description: 'Education Services' }
        ]
    },
    {
        id: 'medical',
        name: 'Medical',
        icon: 'bi-heart-pulse-fill',
        color: '#e63946',
        description: 'Medical & Health Sciences',
        subCategories: [
            { id: 'mbbs', name: 'MBBS', description: 'Bachelor of Medicine' },
            { id: 'bds', name: 'BDS', description: 'Bachelor of Dental Surgery' },
            { id: 'nursing', name: 'Nursing', description: 'Nursing Programs' }
        ]
    }
];

// Mock Questions Data - Realistic CMAT Entrance Questions
const mockQuestions = {
    // ===== CMAT ENTRANCE QUESTIONS (Key: entrance_cmat) =====
    'entrance_cmat': [
        {
            id: 1,
            question: 'What is the total number of districts in Nepal?',
            options: ['75', '77', '78', '80'],
            correctAnswer: 1,
            explanation: 'Nepal has 77 districts as of 2023. The country was divided into 7 provinces and 77 districts after the federal restructuring.'
        },
        {
            id: 2,
            question: 'What is the literacy rate of Nepal according to the 2021 census?',
            options: ['65.4%', '71.2%', '76.3%', '80.5%'],
            correctAnswer: 2,
            explanation: 'According to the 2021 census, Nepal\'s literacy rate is 76.3%. The male literacy rate is 83.6% while female literacy rate is 69.4%.'
        },
        {
            id: 3,
            question: 'Which river originates from the Tibetan Plateau and flows through Nepal?',
            options: ['Koshi River', 'Gandaki River', 'Karnali River', 'Mahakali River'],
            correctAnswer: 0,
            explanation: 'The Koshi River originates from the Tibetan Plateau and flows through eastern Nepal. It is one of the major rivers of Nepal and is known as the "Sorrow of Bihar" in India.'
        },
        {
            id: 4,
            question: 'What is the full form of GDP?',
            options: ['Gross Domestic Product', 'Gross Development Product', 'Global Domestic Product', 'Gross Domestic Profit'],
            correctAnswer: 0,
            explanation: 'GDP stands for Gross Domestic Product. It is the total monetary value of all finished goods and services produced within a country\'s borders in a specific time period.'
        },
        {
            id: 5,
            question: 'Who is known as the father of modern management?',
            options: ['Peter Drucker', 'Henry Fayol', 'Frederick Taylor', 'Max Weber'],
            correctAnswer: 0,
            explanation: 'Peter Drucker is known as the father of modern management. He introduced the concept of Management by Objectives (MBO) and emphasized the importance of innovation and entrepreneurship.'
        }
    ],
    
    // ===== IOE ENGINEERING QUESTIONS =====
    'entrance_ioe': [
        {
            id: 1,
            question: 'What is the SI unit of force?',
            options: ['Newton', 'Joule', 'Watt', 'Pascal'],
            correctAnswer: 0,
            explanation: 'The SI unit of force is Newton (N). It is defined as the force required to accelerate a mass of 1 kilogram at a rate of 1 meter per second squared.'
        },
        {
            id: 2,
            question: 'Which of the following is the strongest structural material?',
            options: ['Wood', 'Concrete', 'Steel', 'Plastic'],
            correctAnswer: 2,
            explanation: 'Steel is the strongest structural material with high tensile strength. It has a yield strength of up to 250-550 MPa, making it ideal for construction.'
        },
        {
            id: 3,
            question: 'What is the pH value of pure water at 25°C?',
            options: ['6', '7', '8', '9'],
            correctAnswer: 1,
            explanation: 'Pure water has a pH of 7 at 25°C. This is considered neutral, meaning it has equal concentrations of H+ and OH- ions.'
        }
    ],
    
    // ===== LOKSEWA ADMINISTRATION QUESTIONS =====
    'entrance_loksewa': [
        {
            id: 1,
            question: 'How many local levels are there in Nepal after the federal restructuring?',
            options: ['743', '753', '763', '773'],
            correctAnswer: 1,
            explanation: 'Nepal has 753 local levels including 6 metropolitan cities, 11 sub-metropolitan cities, 276 municipalities, and 460 rural municipalities.'
        },
        {
            id: 2,
            question: 'When was the Constitution of Nepal 2072 promulgated?',
            options: ['2015 September 20', '2015 October 20', '2016 September 20', '2016 October 20'],
            correctAnswer: 0,
            explanation: 'The Constitution of Nepal 2072 was promulgated on September 20, 2015. It was a historic moment that formally established Nepal as a federal democratic republic.'
        },
        {
            id: 3,
            question: 'What is the total area of Nepal in square kilometers?',
            options: ['147,181', '147,516', '147,816', '148,181'],
            correctAnswer: 0,
            explanation: 'The total area of Nepal is 147,181 square kilometers. It is the 93rd largest country in the world by area.'
        }
    ],
    
    // ===== DRIVING LICENSE QUESTIONS =====
    'license_driving': [
        {
            id: 1,
            question: 'What does a yellow traffic light indicate?',
            options: ['Stop immediately', 'Go faster', 'Prepare to stop', 'Turn around'],
            correctAnswer: 2,
            explanation: 'A yellow traffic light indicates that you should prepare to stop before the light turns red. It is a warning that the signal is about to change from green to red.'
        },
        {
            id: 2,
            question: 'What is the minimum age for a motorcycle driving license in Nepal?',
            options: ['14 years', '16 years', '18 years', '21 years'],
            correctAnswer: 1,
            explanation: 'The minimum age for a motorcycle driving license in Nepal is 16 years. For cars and other vehicles, the minimum age is 18 years.'
        },
        {
            id: 3,
            question: 'What is the legal blood alcohol concentration (BAC) limit for driving in Nepal?',
            options: ['0.03%', '0.05%', '0.08%', '0.10%'],
            correctAnswer: 1,
            explanation: 'The legal blood alcohol concentration (BAC) limit for driving in Nepal is 0.05%. For professional drivers, it is even lower at 0.02%.'
        }
    ],
    
    // ===== ENGINEERING LICENSE QUESTIONS =====
    'license_engineering_license': [
        {
            id: 1,
            question: 'Which organization regulates engineering practice in Nepal?',
            options: ['Nepal Engineering Council', 'Ministry of Education', 'Nepal Architects Association', 'Engineering Association of Nepal'],
            correctAnswer: 0,
            explanation: 'The Nepal Engineering Council (NEC) regulates engineering practice in Nepal. It was established by the Nepal Engineering Council Act 2055 (1998).'
        },
        {
            id: 2,
            question: 'What is the minimum compressive strength of M20 grade concrete?',
            options: ['15 MPa', '20 MPa', '25 MPa', '30 MPa'],
            correctAnswer: 1,
            explanation: 'The minimum compressive strength of M20 grade concrete is 20 MPa at 28 days of curing. M20 is commonly used for residential and commercial building construction.'
        },
        {
            id: 3,
            question: 'What is the standard density of Ordinary Portland Cement (OPC)?',
            options: ['1240 kg/m³', '1440 kg/m³', '1640 kg/m³', '1840 kg/m³'],
            correctAnswer: 1,
            explanation: 'The standard density of Ordinary Portland Cement (OPC) is approximately 1440 kg/m³ (or 90 lb/ft³). This is an important parameter in concrete mix design calculations.'
        }
    ]
};

// Fetch Categories with caching
export const fetchCategories = async () => {
    const cacheKey = 'categories';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = mockCategories;
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
};

// Fetch Sub-Categories with caching
export const fetchSubCategories = async (categoryId) => {
    const cacheKey = `subcategories_${categoryId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    const category = mockCategories.find(c => c.id === categoryId);
    const data = category ? category.subCategories : [];
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
};

// Fetch Questions with caching - SIMPLIFIED AND FIXED
export const fetchQuestions = async (categoryId, subCategoryId) => {
    const cacheKey = `questions_${categoryId}_${subCategoryId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Build the key: categoryId_subCategoryId (e.g., entrance_cmat)
    const key = `${categoryId}_${subCategoryId}`;
    console.log('Fetching questions with key:', key); // Debug log
    
    // Try to get questions from mockQuestions
    let data = mockQuestions[key] || [];
    
    // If no questions found, try alternative key formats
    if (data.length === 0) {
        console.warn(`No questions found for key: ${key}, trying alternatives...`);
        
        // Try just the subCategoryId
        if (mockQuestions[subCategoryId]) {
            data = mockQuestions[subCategoryId];
            console.log(`Found questions using subCategoryId: ${subCategoryId}`);
        }
        // Try categoryId only
        else if (mockQuestions[categoryId]) {
            data = mockQuestions[categoryId];
            console.log(`Found questions using categoryId: ${categoryId}`);
        }
    }
    
    // If STILL no questions, use default CMAT questions as fallback
    if (data.length === 0) {
        console.warn('No questions found, using default fallback questions');
        data = [
            {
                id: 1,
                question: 'What is the capital of Nepal?',
                options: ['Kathmandu', 'Pokhara', 'Bhaktapur', 'Lalitpur'],
                correctAnswer: 0,
                explanation: 'Kathmandu is the capital city of Nepal, located in the Kathmandu Valley.'
            },
            {
                id: 2,
                question: 'Which is the highest mountain in the world located in Nepal?',
                options: ['Kanchenjunga', 'Lhotse', 'Mount Everest', 'Makalu'],
                correctAnswer: 2,
                explanation: 'Mount Everest (Sagarmatha) is the highest mountain in the world at 8,848.86 meters.'
            },
            {
                id: 3,
                question: 'When was the Federal Republic of Nepal declared?',
                options: ['2006 May 28', '2008 May 28', '2010 May 28', '2015 May 28'],
                correctAnswer: 1,
                explanation: 'Nepal was declared a Federal Republic on May 28, 2008.'
            },
            {
                id: 4,
                question: 'What is the currency of Nepal?',
                options: ['Indian Rupee', 'Nepali Rupee', 'US Dollar', 'Euro'],
                correctAnswer: 1,
                explanation: 'The currency of Nepal is the Nepali Rupee (NPR), issued by Nepal Rastra Bank.'
            },
            {
                id: 5,
                question: 'What is the national animal of Nepal?',
                options: ['Cow', 'Tiger', 'Elephant', 'Peacock'],
                correctAnswer: 0,
                explanation: 'The cow is the national animal of Nepal, and it holds significant religious and cultural importance in the country.'
            }
        ];
    }
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
};

// Clear cache
export const clearCache = () => {
    cache.clear();
};

export default {
    fetchCategories,
    fetchSubCategories,
    fetchQuestions,
    clearCache
};