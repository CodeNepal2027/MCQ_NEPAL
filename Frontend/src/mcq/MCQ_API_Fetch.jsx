// Mock API functions - Replace with actual API calls

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Mock Categories Data with 4-Level Structure: Category → Faculty → Branch → Chapter
const mockCategories = [
    {
        id: 'entrance',
        name: 'Entrance',
        icon: 'bi-mortarboard-fill',
        color: '#b226dc',
        description: 'University & College Entrance Exams',
        faculties: [
            { 
                id: 'cmat', 
                name: 'CMAT', 
                icon: 'bi-building-fill',
                description: 'Central Management Admission Test',
                branches: [
                    { 
                        id: 'general', 
                        name: 'General CMAT', 
                        description: 'General CMAT Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Nepal Overview', description: 'Basic Nepal GK', questionCount: 3 },
                            { id: 'ch2', name: 'Chapter 2: Economy', description: 'Nepal Economy', questionCount: 0 },
                            { id: 'ch3', name: 'Chapter 3: Geography', description: 'Nepal Geography', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'quantitative', 
                        name: 'Quantitative Aptitude', 
                        description: 'Math & Quant Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Arithmetic', description: 'Basic Math', questionCount: 2 },
                            { id: 'ch2', name: 'Chapter 2: Algebra', description: 'Algebra', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'verbal', 
                        name: 'Verbal Ability', 
                        description: 'English & Verbal Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Grammar', description: 'English Grammar', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Vocabulary', description: 'Vocabulary', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'logical', 
                        name: 'Logical Reasoning', 
                        description: 'Logic & Reasoning Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Logic', description: 'Basic Logic', questionCount: 0 }
                        ]
                    }
                ]
            },
            { 
                id: 'ioe', 
                name: 'Pulchowk Engineering IOE', 
                icon: 'bi-gear-fill',
                description: 'Institute of Engineering Entrance',
                branches: [
                    { 
                        id: 'computer', 
                        name: 'Computer Engineering', 
                        description: 'Computer & IT Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Programming', description: 'Programming Basics', questionCount: 3 },
                            { id: 'ch2', name: 'Chapter 2: Networking', description: 'Computer Networks', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'civil', 
                        name: 'Civil Engineering', 
                        description: 'Civil Engineering Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Structures', description: 'Structural Engineering', questionCount: 2 },
                            { id: 'ch2', name: 'Chapter 2: Materials', description: 'Construction Materials', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'electrical', 
                        name: 'Electrical Engineering', 
                        description: 'Electrical Engineering Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Circuits', description: 'Electrical Circuits', questionCount: 3 },
                            { id: 'ch2', name: 'Chapter 2: Machines', description: 'Electrical Machines', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'mechanical', 
                        name: 'Mechanical Engineering', 
                        description: 'Mechanical Engineering Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Thermodynamics', description: 'Heat & Energy', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Mechanics', description: 'Applied Mechanics', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'electronics', 
                        name: 'Electronics & Communication', 
                        description: 'Electronics Questions',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Analog', description: 'Analog Electronics', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Digital', description: 'Digital Electronics', questionCount: 0 }
                        ]
                    }
                ]
            },
            { 
                id: 'loksewa', 
                name: 'LokSewa', 
                icon: 'bi-building-fill',
                description: 'Public Service Commission Exams',
                branches: [
                    { 
                        id: 'admin', 
                        name: 'Administration', 
                        description: 'Administration Services',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Governance', description: 'Public Governance', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Law', description: 'Legal Framework', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'police', 
                        name: 'Police Services', 
                        description: 'Police Services',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Criminology', description: 'Criminal Justice', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'education', 
                        name: 'Education', 
                        description: 'Education Services',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Pedagogy', description: 'Teaching Methods', questionCount: 0 }
                        ]
                    }
                ]
            },
            { 
                id: 'medical', 
                name: 'Medical Entrance', 
                icon: 'bi-heart-pulse-fill',
                description: 'MBBS, BDS & Nursing Entrance',
                branches: [
                    { 
                        id: 'mbbs', 
                        name: 'MBBS', 
                        description: 'Bachelor of Medicine',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Anatomy', description: 'Human Anatomy', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Physiology', description: 'Human Physiology', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'bds', 
                        name: 'BDS', 
                        description: 'Bachelor of Dental Surgery',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Dental Anatomy', description: 'Dental Structure', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'nursing', 
                        name: 'Nursing', 
                        description: 'Nursing Programs',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Fundamentals', description: 'Nursing Basics', questionCount: 0 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'license',
        name: 'License',
        icon: 'bi-award-fill',
        color: '#2d6a9f',
        description: 'Professional & Driving Licenses',
        faculties: [
            { 
                id: 'engineering_license', 
                name: 'Engineering License', 
                icon: 'bi-tools',
                description: 'Nepal Engineering Council License',
                branches: [
                    { 
                        id: 'computer_eng', 
                        name: 'Computer Engineering', 
                        description: 'Computer Engineering License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Software', description: 'Software Engineering', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Hardware', description: 'Hardware Engineering', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'civil_eng', 
                        name: 'Civil Engineering', 
                        description: 'Civil Engineering License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Structural', description: 'Structural Design', questionCount: 2 },
                            { id: 'ch2', name: 'Chapter 2: Geotechnical', description: 'Soil Mechanics', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'electrical_eng', 
                        name: 'Electrical Engineering', 
                        description: 'Electrical Engineering License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Power Systems', description: 'Power Distribution', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Control Systems', description: 'Control Engineering', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'mechanical_eng', 
                        name: 'Mechanical Engineering', 
                        description: 'Mechanical Engineering License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Design', description: 'Mechanical Design', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Manufacturing', description: 'Manufacturing Processes', questionCount: 0 }
                        ]
                    }
                ]
            },
            { 
                id: 'driving', 
                name: 'Driving License', 
                icon: 'bi-car-front-fill',
                description: 'Vehicle Driving License',
                branches: [
                    { 
                        id: 'four_wheeler', 
                        name: 'Four Wheeler', 
                        description: 'Car/Jeep Driving License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Traffic Rules', description: 'Basic Traffic Rules', questionCount: 3 },
                            { id: 'ch2', name: 'Chapter 2: Safety', description: 'Road Safety', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'two_wheeler', 
                        name: 'Two Wheeler', 
                        description: 'Motorcycle/Scooter License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Riding Skills', description: 'Motorcycle Safety', questionCount: 2 },
                            { id: 'ch2', name: 'Chapter 2: Rules', description: 'Two Wheeler Rules', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'heavy', 
                        name: 'Heavy Vehicle', 
                        description: 'Truck/Bus Driving License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Heavy Vehicle', description: 'Heavy Vehicle Rules', questionCount: 0 }
                        ]
                    }
                ]
            },
            { 
                id: 'teaching', 
                name: 'Teaching License', 
                icon: 'bi-person-video2',
                description: 'Teacher Service Commission',
                branches: [
                    { 
                        id: 'primary', 
                        name: 'Primary Level', 
                        description: 'Primary Teaching License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Pedagogy', description: 'Teaching Methods', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Child Psychology', description: 'Child Development', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'secondary', 
                        name: 'Secondary Level', 
                        description: 'Secondary Teaching License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Curriculum', description: 'Curriculum Development', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Assessment', description: 'Student Assessment', questionCount: 0 }
                        ]
                    },
                    { 
                        id: 'higher_secondary', 
                        name: 'Higher Secondary', 
                        description: 'Higher Secondary License',
                        chapters: [
                            { id: 'ch1', name: 'Chapter 1: Advanced Pedagogy', description: 'Advanced Teaching', questionCount: 0 },
                            { id: 'ch2', name: 'Chapter 2: Research', description: 'Educational Research', questionCount: 0 }
                        ]
                    }
                ]
            }
        ]
    }
];

// Mock Questions Data with Image Support
const mockQuestions = {
    // ===== CMAT - General - Chapter 1 =====
    'entrance_cmat_general_ch1': [
        {
            id: 1,
            question: 'What is the total number of districts in Nepal?',
            image: null,
            options: ['75', '77', '78', '80'],
            correctAnswer: 1,
            explanation: 'Nepal has 77 districts as of 2023. The country was divided into 7 provinces and 77 districts after the federal restructuring.'
        },
        {
            id: 2,
            question: 'What is the literacy rate of Nepal according to the 2021 census?',
            image: null,
            options: ['65.4%', '71.2%', '76.3%', '80.5%'],
            correctAnswer: 2,
            explanation: 'According to the 2021 census, Nepal\'s literacy rate is 76.3%. The male literacy rate is 83.6% while female literacy rate is 69.4%.'
        },
        {
            id: 3,
            question: 'What is the full form of GDP?',
            image: null,
            options: ['Gross Domestic Product', 'Gross Development Product', 'Global Domestic Product', 'Gross Domestic Profit'],
            correctAnswer: 0,
            explanation: 'GDP stands for Gross Domestic Product. It is the total monetary value of all finished goods and services produced within a country\'s borders in a specific time period.'
        }
    ],
    
    // ===== CMAT - Quantitative - Chapter 1 =====
    'entrance_cmat_quantitative_ch1': [
        {
            id: 1,
            question: 'What is 15% of 200?',
            image: null,
            options: ['25', '30', '35', '40'],
            correctAnswer: 1,
            explanation: '15% of 200 = (15/100) × 200 = 30.'
        },
        {
            id: 2,
            question: 'What is the square root of 144?',
            image: null,
            options: ['10', '11', '12', '13'],
            correctAnswer: 2,
            explanation: 'The square root of 144 is 12 because 12 × 12 = 144.'
        }
    ],
    
    // ===== IOE - Computer - Chapter 1 =====
    'entrance_ioe_computer_ch1': [
        {
            id: 1,
            question: 'What is the SI unit of force?',
            image: null,
            options: ['Newton', 'Joule', 'Watt', 'Pascal'],
            correctAnswer: 0,
            explanation: 'The SI unit of force is Newton (N). It is defined as the force required to accelerate a mass of 1 kilogram at a rate of 1 meter per second squared.'
        },
        {
            id: 2,
            question: 'What is the binary representation of decimal number 10?',
            image: null,
            options: ['1000', '1010', '1100', '1110'],
            correctAnswer: 1,
            explanation: 'The binary representation of decimal number 10 is 1010 (2³ × 1 + 2² × 0 + 2¹ × 1 + 2⁰ × 0 = 8 + 0 + 2 + 0 = 10).'
        },
        {
            id: 3,
            question: 'Which of the following is the strongest structural material?',
            image: null,
            options: ['Wood', 'Concrete', 'Steel', 'Plastic'],
            correctAnswer: 2,
            explanation: 'Steel is the strongest structural material with high tensile strength. It has a yield strength of up to 250-550 MPa, making it ideal for construction.'
        }
    ],
    
    // ===== IOE - Civil - Chapter 1 =====
    'entrance_ioe_civil_ch1': [
        {
            id: 1,
            question: 'What is the pH value of pure water at 25°C?',
            image: null,
            options: ['6', '7', '8', '9'],
            correctAnswer: 1,
            explanation: 'Pure water has a pH of 7 at 25°C. This is considered neutral, meaning it has equal concentrations of H+ and OH- ions.'
        },
        {
            id: 2,
            question: 'What is the standard density of Ordinary Portland Cement?',
            image: null,
            options: ['1240 kg/m³', '1440 kg/m³', '1640 kg/m³', '1840 kg/m³'],
            correctAnswer: 1,
            explanation: 'The standard density of Ordinary Portland Cement (OPC) is approximately 1440 kg/m³ (or 90 lb/ft³).'
        }
    ],
    
    // ===== IOE - Electrical - Chapter 1 (with Circuit Diagrams) =====
    'entrance_ioe_electrical_ch1': [
        {
            id: 1,
            question: 'What is the equivalent resistance between points A and B in the circuit shown below?',
            image: 'https://via.placeholder.com/400x250/1a2332/ffffff?text=Circuit+Diagram+1',
            options: ['2Ω', '4Ω', '6Ω', '8Ω'],
            correctAnswer: 1,
            explanation: 'The circuit shows two 4Ω resistors in parallel. The equivalent resistance of two parallel resistors is (R1 × R2) / (R1 + R2) = (4 × 4) / (4 + 4) = 16/8 = 2Ω. Then this 2Ω is in series with another 2Ω resistor, giving a total of 4Ω.'
        },
        {
            id: 2,
            question: 'What is the current flowing through the 6Ω resistor in the circuit shown?',
            image: 'https://via.placeholder.com/400x250/1a2332/ffffff?text=Circuit+Diagram+2',
            options: ['1A', '2A', '3A', '4A'],
            correctAnswer: 1,
            explanation: 'Using Ohm\'s Law: Total resistance = 6Ω + 3Ω = 9Ω. Total current = V/R = 18V/9Ω = 2A. The current through the 6Ω resistor is 2A.'
        },
        {
            id: 3,
            question: 'Which of the following is the correct symbol for a diode?',
            image: 'https://via.placeholder.com/400x200/1a2332/ffffff?text=Diode+Symbols',
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 2,
            explanation: 'Option C shows the correct symbol for a diode. The arrow points in the direction of conventional current flow (anode to cathode).'
        }
    ],
    
    // ===== License - Driving - Four Wheeler - Chapter 1 (with Traffic Signs) =====
    'license_driving_four_wheeler_ch1': [
        {
            id: 1,
            question: 'What does the following traffic sign indicate?',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Nepal_road_sign_A15.svg/960px-Nepal_road_sign_A15.svg.png',
            options: ['Stop', 'Yield', 'No Entry', 'Speed Limit'],
            correctAnswer: 0,
            explanation: 'This is a STOP sign. Drivers must come to a complete stop at the intersection indicated by this sign.'
        },
        {
            id: 2,
            question: 'What does this traffic sign mean?',
            image: 'https://via.placeholder.com/200x200/ffff00/000000?text=YIELD+SIGN',
            options: ['Stop', 'Yield to traffic', 'No parking', 'Speed limit 30 km/h'],
            correctAnswer: 1,
            explanation: 'This is a YIELD sign. Drivers must yield the right-of-way to oncoming traffic and pedestrians.'
        },
        {
            id: 3,
            question: 'What is the meaning of this road sign?',
            image: 'https://via.placeholder.com/200x200/0000ff/ffffff?text=NO+PARKING',
            options: ['Parking allowed', 'No parking', 'Speed limit', 'No entry'],
            correctAnswer: 1,
            explanation: 'This sign indicates NO PARKING. Parking is prohibited in the area indicated by this sign.'
        }
    ],
    
    // ===== License - Driving - Two Wheeler - Chapter 1 =====
    'license_driving_two_wheeler_ch1': [
        {
            id: 1,
            question: 'What does the following traffic sign indicate for two-wheelers?',
            image: 'https://via.placeholder.com/200x200/ff6600/ffffff?text=BIKE+LANE',
            options: ['Cycle lane', 'Motorcycle parking', 'Motorcycle lane', 'No entry for bikes'],
            correctAnswer: 2,
            explanation: 'This sign indicates a dedicated motorcycle lane. Two-wheelers should use this lane for safer travel.'
        },
        {
            id: 2,
            question: 'What is the meaning of this sign?',
            image: 'https://via.placeholder.com/200x200/ff0000/ffffff?text=NO+U-TURN',
            options: ['U-turn allowed', 'No U-turn', 'Turn left', 'Turn right'],
            correctAnswer: 1,
            explanation: 'This sign indicates NO U-TURN. Making a U-turn at this location is prohibited.'
        }
    ],
    
    // ===== License - Engineering License - Civil - Chapter 1 =====
    'license_engineering_license_civil_eng_ch1': [
        {
            id: 1,
            question: 'Which organization regulates engineering practice in Nepal?',
            image: null,
            options: ['Nepal Engineering Council', 'Ministry of Education', 'Nepal Architects Association', 'Engineering Association of Nepal'],
            correctAnswer: 0,
            explanation: 'The Nepal Engineering Council (NEC) regulates engineering practice in Nepal. It was established by the Nepal Engineering Council Act 2055 (1998).'
        },
        {
            id: 2,
            question: 'What is the minimum compressive strength of M20 grade concrete?',
            image: null,
            options: ['15 MPa', '20 MPa', '25 MPa', '30 MPa'],
            correctAnswer: 1,
            explanation: 'The minimum compressive strength of M20 grade concrete is 20 MPa at 28 days of curing.'
        }
    ]
};

// ============================================
// EXPORT FUNCTIONS
// ============================================

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

// Fetch Faculties for a category
export const fetchFaculties = async (categoryId) => {
    const cacheKey = `faculties_${categoryId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    const category = mockCategories.find(c => c.id === categoryId);
    const data = category ? category.faculties : [];
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
};

// Fetch Branches for a faculty
export const fetchBranches = async (categoryId, facultyId) => {
    const cacheKey = `branches_${categoryId}_${facultyId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    const category = mockCategories.find(c => c.id === categoryId);
    if (!category) return [];
    const faculty = category.faculties?.find(f => f.id === facultyId);
    const data = faculty ? faculty.branches : [];
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
};

// Fetch Chapters for a branch
export const fetchChapters = async (categoryId, facultyId, branchId) => {
    const cacheKey = `chapters_${categoryId}_${facultyId}_${branchId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    const category = mockCategories.find(c => c.id === categoryId);
    if (!category) return [];
    const faculty = category.faculties?.find(f => f.id === facultyId);
    if (!faculty) return [];
    const branch = faculty.branches?.find(b => b.id === branchId);
    const data = branch ? branch.chapters : [];
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
};

// Fetch Questions with 4-level key
export const fetchQuestions = async (categoryId, facultyId, branchId, chapterId) => {
    const cacheKey = `questions_${categoryId}_${facultyId}_${branchId}_${chapterId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Build the key: categoryId_facultyId_branchId_chapterId
    const key = `${categoryId}_${facultyId}_${branchId}_${chapterId}`;
    console.log('Fetching questions with key:', key);
    
    let data = mockQuestions[key] || [];
    
    // If no questions found with chapter, try without chapter
    if (data.length === 0) {
        console.warn(`No questions found for key: ${key}, trying without chapter...`);
        const fallbackKey = `${categoryId}_${facultyId}_${branchId}`;
        if (mockQuestions[fallbackKey]) {
            data = mockQuestions[fallbackKey];
            console.log(`Found questions using key: ${fallbackKey}`);
        }
    }
    
    // Default fallback questions
    if (data.length === 0) {
        console.warn('No questions found, using default fallback questions');
        data = [
            {
                id: 1,
                question: 'What is the capital of Nepal?',
                image: null,
                options: ['Kathmandu', 'Pokhara', 'Bhaktapur', 'Lalitpur'],
                correctAnswer: 0,
                explanation: 'Kathmandu is the capital city of Nepal, located in the Kathmandu Valley.'
            },
            {
                id: 2,
                question: 'Which is the highest mountain in the world located in Nepal?',
                image: null,
                options: ['Kanchenjunga', 'Lhotse', 'Mount Everest', 'Makalu'],
                correctAnswer: 2,
                explanation: 'Mount Everest (Sagarmatha) is the highest mountain in the world at 8,848.86 meters.'
            },
            {
                id: 3,
                question: 'When was the Federal Republic of Nepal declared?',
                image: null,
                options: ['2006 May 28', '2008 May 28', '2010 May 28', '2015 May 28'],
                correctAnswer: 1,
                explanation: 'Nepal was declared a Federal Republic on May 28, 2008.'
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

// Default export for backward compatibility
export default {
    fetchCategories,
    fetchFaculties,
    fetchBranches,
    fetchChapters,
    fetchQuestions,
    clearCache
};