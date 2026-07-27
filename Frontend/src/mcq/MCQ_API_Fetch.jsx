// ============================================
// MCQ API SERVICE - Optimized with Smart Caching
// ============================================

// ============================================
// SMART CACHE MANAGEMENT
// ============================================

class SmartCache {
    constructor(duration = 5 * 60 * 1000) {
        this.cache = new Map();
        this.duration = duration;
        this.pendingRequests = new Map();
        this.stats = { hits: 0, misses: 0 };
        this.version = localStorage.getItem('mcq_cache_version') || '1.0';
    }

    get(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.duration) {
            this.stats.hits++;
            return cached.data;
        }
        this.stats.misses++;
        return null;
    }

    set(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    clear() {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0 };
        localStorage.removeItem('mcq_cache_version');
    }

    clearByPrefix(prefix) {
        const keysToDelete = [];
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.cache.delete(key));
    }

    clearByCategory(categoryId) {
        this.clearByPrefix(`categories`);
        this.clearByPrefix(`category_${categoryId}`);
        this.clearByPrefix(`faculties_category_${categoryId}`);
        this.clearByPrefix(`branches_category_${categoryId}`);
        this.clearByPrefix(`chapters_category_${categoryId}`);
    }

    clearByFaculty(facultyId) {
        this.clearByPrefix(`faculties`);
        this.clearByPrefix(`faculty_${facultyId}`);
        this.clearByPrefix(`branches_faculty_${facultyId}`);
    }

    clearByBranch(branchId) {
        this.clearByPrefix(`branches`);
        this.clearByPrefix(`branch_${branchId}`);
        this.clearByPrefix(`chapters_branch_${branchId}`);
    }

    clearByChapter(chapterId) {
        this.clearByPrefix(`chapters`);
        this.clearByPrefix(`chapter_${chapterId}`);
        this.clearByPrefix(`questions_chapter_${chapterId}`);
    }

    getStats() {
        const total = this.stats.hits + this.stats.misses;
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            total,
            hitRate: total > 0 ? Math.round((this.stats.hits / total) * 100) : 0,
            size: this.cache.size,
            version: this.version,
            keys: Array.from(this.cache.keys()).slice(0, 10) // Show first 10 keys
        };
    }

    async getOrFetch(key, fetchFn, forceRefresh = false) {
        if (!forceRefresh) {
            const cached = this.get(key);
            if (cached) return cached;
        }

        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        const promise = fetchFn()
            .then(data => {
                this.set(key, data);
                return data;
            })
            .finally(() => {
                this.pendingRequests.delete(key);
            });

        this.pendingRequests.set(key, promise);
        return promise;
    }

    invalidate(version) {
        this.version = version;
        localStorage.setItem('mcq_cache_version', version);
        this.clear();
    }

    checkVersion(serverVersion) {
        if (serverVersion && serverVersion !== this.version) {
            this.invalidate(serverVersion);
            return true;
        }
        return false;
    }
}

// Create singleton cache instance
export const cache = new SmartCache();

// ============================================
// HELPER: Process API Response
// ============================================

const processApiResponse = (response) => {
    if (!response) return [];
    
    if (response.data !== undefined) {
        return Array.isArray(response.data) ? response.data : [];
    }
    
    if (response.results !== undefined) {
        return Array.isArray(response.results) ? response.results : [];
    }
    
    if (Array.isArray(response)) {
        return response;
    }
    
    if (typeof response === 'object' && response !== null) {
        const values = Object.values(response);
        if (values.length > 0 && Array.isArray(values[0])) {
            return values[0];
        }
        const keys = Object.keys(response);
        if (keys.length > 0 && keys.every(k => !isNaN(k))) {
            return Object.values(response);
        }
    }
    
    console.warn('Unexpected API response format:', response);
    return [];
};

// ============================================
// API BASE URL & CONFIG
// ============================================

// Check if we should use mock data
const USE_MOCK_DATA = import.meta.env?.VITE_USE_MOCK_DATA === 'true' || false;

// Import mock data (if available)
let mockCategories = [];
let mockQuestions = {};

try {
    const mockData = await import('./MCQ_mockData');
    mockCategories = mockData.mockCategories || [];
    mockQuestions = mockData.mockQuestions || {};
} catch (e) {
    console.log('No mock data found, using real API');
}

const API_CONFIG = {
    BASE_URL: import.meta.env?.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'
};

// API Endpoints
const API_ENDPOINTS = {
    CATEGORIES: `${API_CONFIG.BASE_URL}/categories/`,
    FACULTIES: `${API_CONFIG.BASE_URL}/faculties/`,
    BRANCHES: `${API_CONFIG.BASE_URL}/branches/`,
    CHAPTERS: `${API_CONFIG.BASE_URL}/chapters/`,
    QUESTIONS: `${API_CONFIG.BASE_URL}/questions/`
};

// ============================================
// GENERIC API FUNCTIONS
// ============================================

const apiGet = async (url, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

const apiPost = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

const apiPut = async (url, data) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

const apiPatch = async (url, data) => {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

const apiDelete = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

// ============================================
// CATEGORY API FUNCTIONS
// ============================================

export const fetchCategories = async (forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockCategories;
    }

    return cache.getOrFetch('categories', async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.CATEGORIES);
            const categories = processApiResponse(response);
            console.log('📦 Categories loaded:', categories.length);
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }, forceRefresh);
};

export const fetchCategory = async (categoryId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockCategories.find(c => c.id === categoryId) || null;
    }

    const cacheKey = `category_${categoryId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/categories/${categoryId}/`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching category ${categoryId}:`, error);
            return null;
        }
    }, forceRefresh);
};

export const fetchCategoryWithAll = async (categoryId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const category = mockCategories.find(c => c.id === categoryId);
        return category || null;
    }

    const cacheKey = `category_full_${categoryId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/categories/${categoryId}/full/`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching full category ${categoryId}:`, error);
            return null;
        }
    }, forceRefresh);
};

export const fetchFacultiesByCategory = async (categoryId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const category = mockCategories.find(c => c.id === categoryId);
        return category ? category.faculties || [] : [];
    }

    const cacheKey = `faculties_category_${categoryId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/faculties/?category_id=${categoryId}`);
            const faculties = processApiResponse(response);
            console.log(`📦 Faculties loaded for category ${categoryId}:`, faculties.length);
            return faculties;
        } catch (error) {
            console.error(`Error fetching faculties for category ${categoryId}:`, error);
            return [];
        }
    }, forceRefresh);
};

export const fetchCategoriesWithFaculties = async (forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockCategories.map(c => ({
            ...c,
            faculties: c.faculties || []
        }));
    }

    const cacheKey = 'categories_with_faculties';
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/categories/with-faculties/`);
            return processApiResponse(response);
        } catch (error) {
            console.error('Error fetching categories with faculties:', error);
            return [];
        }
    }, forceRefresh);
};

// ============================================
// FACULTY API FUNCTIONS
// ============================================

export const fetchFaculties = async (categoryId = null, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (categoryId) {
            const category = mockCategories.find(c => c.id === categoryId);
            return category ? category.faculties || [] : [];
        }
        const allFaculties = [];
        mockCategories.forEach(c => {
            if (c.faculties) {
                allFaculties.push(...c.faculties);
            }
        });
        return allFaculties;
    }

    const cacheKey = categoryId ? `faculties_all_${categoryId}` : 'faculties_all';
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const params = categoryId ? { category_id: categoryId } : {};
            const response = await apiGet(API_ENDPOINTS.FACULTIES, params);
            return processApiResponse(response);
        } catch (error) {
            console.error('Error fetching faculties:', error);
            return [];
        }
    }, forceRefresh);
};

export const fetchFaculty = async (facultyId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const category of mockCategories) {
            const faculty = category.faculties?.find(f => f.id === facultyId);
            if (faculty) return faculty;
        }
        return null;
    }

    const cacheKey = `faculty_${facultyId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/faculties/${facultyId}/`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching faculty ${facultyId}:`, error);
            return null;
        }
    }, forceRefresh);
};

export const fetchFacultyWithAll = async (facultyId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        for (const category of mockCategories) {
            const faculty = category.faculties?.find(f => f.id === facultyId);
            if (faculty) return faculty;
        }
        return null;
    }

    const cacheKey = `faculty_full_${facultyId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/faculties/${facultyId}/full/`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching full faculty ${facultyId}:`, error);
            return null;
        }
    }, forceRefresh);
};

export const fetchBranchesByFaculty = async (facultyId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const category of mockCategories) {
            const faculty = category.faculties?.find(f => f.id === facultyId);
            if (faculty) return faculty.branches || [];
        }
        return [];
    }

    const cacheKey = `branches_faculty_${facultyId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/faculties/${facultyId}/branches/`);
            const branches = processApiResponse(response);
            console.log(`📦 Branches loaded for faculty ${facultyId}:`, branches.length);
            return branches;
        } catch (error) {
            console.error(`Error fetching branches for faculty ${facultyId}:`, error);
            return [];
        }
    }, forceRefresh);
};

// ============================================
// BRANCH API FUNCTIONS
// ============================================

export const fetchBranches = async (facultyId = null, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (facultyId) {
            for (const category of mockCategories) {
                for (const faculty of (category.faculties || [])) {
                    if (faculty.id === facultyId) {
                        return faculty.branches || [];
                    }
                }
            }
            return [];
        }
        const allBranches = [];
        mockCategories.forEach(c => {
            (c.faculties || []).forEach(f => {
                if (f.branches) {
                    allBranches.push(...f.branches);
                }
            });
        });
        return allBranches;
    }

    const cacheKey = facultyId ? `branches_all_${facultyId}` : 'branches_all';
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const params = facultyId ? { faculty_id: facultyId } : {};
            const response = await apiGet(API_ENDPOINTS.BRANCHES, params);
            return processApiResponse(response);
            
        } catch (error) {
            console.error('Error fetching branches:', error);
            return [];
        }
    }, forceRefresh);
};

export const fetchBranch = async (branchId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const category of mockCategories) {
            for (const faculty of (category.faculties || [])) {
                const branch = faculty.branches?.find(b => b.id === branchId);
                if (branch) return branch;
            }
        }
        return null;
    }

    const cacheKey = `branch_${branchId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/branches/${branchId}/`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching branch ${branchId}:`, error);
            return null;
        }
    }, forceRefresh);
};

export const fetchBranchWithAll = async (branchId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        for (const category of mockCategories) {
            for (const faculty of (category.faculties || [])) {
                const branch = faculty.branches?.find(b => b.id === branchId);
                if (branch) return branch;
            }
        }
        return null;
    }

    const cacheKey = `branch_full_${branchId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/branches/${branchId}/full/`);
            return response.data || response;
            
        } catch (error) {
            console.error(`Error fetching full branch ${branchId}:`, error);
            return null;
        }
    }, forceRefresh);
};

export const fetchChaptersByBranch = async (branchId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const category of mockCategories) {
            for (const faculty of (category.faculties || [])) {
                const branch = faculty.branches?.find(b => b.id === branchId);
                if (branch) return branch.chapters || [];
            }
        }
        return [];
    }

    const cacheKey = `chapters_branch_${branchId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/branches/${branchId}/chapters/`);
            const chapters = processApiResponse(response);
            console.log(`📦 Chapters loaded for branch ${branchId}:`, chapters.length);
            return chapters;
        } catch (error) {
            console.error(`Error fetching chapters for branch ${branchId}:`, error);
            return [];
        }
    }, forceRefresh);
};

// ============================================
// CHAPTER API FUNCTIONS
// ============================================

export const fetchChapters = async (branchId = null, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (branchId) {
            for (const category of mockCategories) {
                for (const faculty of (category.faculties || [])) {
                    for (const branch of (faculty.branches || [])) {
                        if (branch.id === branchId) {
                            return branch.chapters || [];
                        }
                    }
                }
            }
            return [];
        }
        const allChapters = [];
        mockCategories.forEach(c => {
            (c.faculties || []).forEach(f => {
                (f.branches || []).forEach(b => {
                    if (b.chapters) {
                        allChapters.push(...b.chapters);
                    }
                });
            });
        });
        return allChapters;
    }

    const cacheKey = branchId ? `chapters_all_${branchId}` : 'chapters_all';
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const params = branchId ? { branch_id: branchId } : {};
            const response = await apiGet(API_ENDPOINTS.CHAPTERS, params);
            return processApiResponse(response);
            
        } catch (error) {
            console.error('Error fetching chapters:', error);
            return [];
        }
    }, forceRefresh);
};

export const fetchChapter = async (chapterId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const category of mockCategories) {
            for (const faculty of (category.faculties || [])) {
                for (const branch of (faculty.branches || [])) {
                    const chapter = branch.chapters?.find(c => c.id === chapterId);
                    if (chapter) return chapter;
                }
            }
        }
        return null;
    }

    const cacheKey = `chapter_${chapterId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/chapters/${chapterId}/`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching chapter ${chapterId}:`, error);
            return null;
        }
    }, forceRefresh);
};

export const fetchQuestionsByChapter = async (chapterId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400));
        const key = Object.keys(mockQuestions).find(k => k.endsWith(`_${chapterId}`));
        return key ? mockQuestions[key] || [] : [];
    }

    const cacheKey = `questions_chapter_${chapterId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/chapters/${chapterId}/questions/`);
            const questions = processApiResponse(response);
            console.log(`📦 Questions loaded for chapter ${chapterId}:`, questions.length);
            return questions;
        } catch (error) {
            console.error(`Error fetching questions for chapter ${chapterId}:`, error);
            return [];
        }
    }, forceRefresh);
};

// ============================================
// QUESTION API FUNCTIONS
// ============================================

export const fetchQuestions = async (categoryId, facultyId, branchId, chapterId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400));
        const key = `${categoryId}_${facultyId}_${branchId}_${chapterId}`;
        const questions = mockQuestions[key] || [];
        return questions.map(q => ({
            ...q,
            options: q.options || [],
        }));
    }

    const cacheKey = `questions_${categoryId}_${facultyId}_${branchId}_${chapterId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const params = new URLSearchParams();
            if (categoryId) params.append('category_id', categoryId);
            if (facultyId) params.append('faculty_id', facultyId);
            if (branchId) params.append('branch_id', branchId);
            if (chapterId) params.append('chapter_id', chapterId);
            
            const response = await apiGet(`${API_CONFIG.BASE_URL}/questions/?${params.toString()}`);
            const questions = processApiResponse(response);
            console.log(`📦 Questions loaded:`, questions.length);
            return questions;
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }, forceRefresh);
};

export const fetchAllQuestions = async (chapterId = null, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (chapterId) {
            const allQuestions = [];
            Object.values(mockQuestions).forEach(questions => {
                questions.forEach(q => {
                    if (q.chapterId === chapterId) {
                        allQuestions.push(q);
                    }
                });
            });
            return allQuestions;
        }
        const allQuestions = [];
        Object.values(mockQuestions).forEach(questions => {
            allQuestions.push(...questions);
        });
        return allQuestions;
    }

    try {
        const params = chapterId ? { chapter_id: chapterId } : {};
        const response = await apiGet(API_ENDPOINTS.QUESTIONS, params);
        return processApiResponse(response);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
};

export const fetchQuestion = async (questionId, forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const key of Object.keys(mockQuestions)) {
            const question = mockQuestions[key].find(q => q.id === parseInt(questionId));
            if (question) return question;
        }
        return null;
    }

    const cacheKey = `question_${questionId}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/questions/${questionId}/`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching question ${questionId}:`, error);
            return null;
        }
    }, forceRefresh);
};

// ============================================
// FULL HIERARCHY API
// ============================================

export const fetchFullHierarchy = async (forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockCategories;
    }

    const cacheKey = 'full_hierarchy';
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet(`${API_CONFIG.BASE_URL}/full-hierarchy/`);
            return processApiResponse(response);
            
        } catch (error) {
            console.error('Error fetching full hierarchy:', error);
            return [];
        }
    }, forceRefresh);
};

// ============================================
// SEARCH API
// ============================================

export const searchQuestions = async (query) => {
    if (!query || query.trim() === '') {
        return [];
    }

    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const results = [];
        Object.values(mockQuestions).forEach(questions => {
            questions.forEach(q => {
                if (q.question?.toLowerCase().includes(query.toLowerCase())) {
                    results.push(q);
                }
            });
        });
        return results;
    }

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}/search/`, { q: query });
        return processApiResponse(response);
    } catch (error) {
        console.error('Error searching questions:', error);
        return [];
    }
};

// ============================================
// STATS API
// ============================================

export const fetchStats = async (forceRefresh = false) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            total_categories: mockCategories.length,
            total_faculties: mockCategories.reduce((acc, c) => acc + (c.faculties?.length || 0), 0),
            total_branches: mockCategories.reduce((acc, c) => 
                acc + (c.faculties?.reduce((sum, f) => sum + (f.branches?.length || 0), 0) || 0), 0),
            total_chapters: mockCategories.reduce((acc, c) => 
                acc + (c.faculties?.reduce((sum, f) => 
                    sum + (f.branches?.reduce((s, b) => s + (b.chapters?.length || 0), 0) || 0), 0) || 0), 0),
            total_questions: Object.values(mockQuestions).reduce((acc, q) => acc + q.length, 0),
        };
    }

    const cacheKey = 'stats';
    
    return cache.getOrFetch(cacheKey, async () => {
        try {
            const response = await apiGet('/stats/');
            return response.data || response;
            
        } catch (error) {
            console.error('Error fetching stats:', error);
            return null;
        }
    }, forceRefresh);
};

// ============================================
// CRUD OPERATIONS WITH CACHE INVALIDATION
// ============================================

export const createCategory = async (data) => {
    try {
        const result = await apiPost(API_ENDPOINTS.CATEGORIES, data);
        cache.clearByPrefix('categories');
        cache.clearByPrefix('category_');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id, data) => {
    try {
        const result = await apiPut(`${API_CONFIG.BASE_URL}/categories/${id}/`, data);
        cache.clearByCategory(id);
        cache.clearByPrefix('categories');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        await apiDelete(`${API_CONFIG.BASE_URL}/categories/${id}/`);
        cache.clearByCategory(id);
        cache.clearByPrefix('categories');
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        throw error;
    }
};

export const createFaculty = async (data) => {
    try {
        const result = await apiPost(API_ENDPOINTS.FACULTIES, data);
        cache.clearByPrefix('faculties');
        cache.clearByPrefix('branches');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error('Error creating faculty:', error);
        throw error;
    }
};

export const updateFaculty = async (id, data) => {
    try {
        const result = await apiPut(`${API_CONFIG.BASE_URL}/faculties/${id}/`, data);
        cache.clearByFaculty(id);
        cache.clearByPrefix('faculties');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error(`Error updating faculty ${id}:`, error);
        throw error;
    }
};

export const deleteFaculty = async (id) => {
    try {
        await apiDelete(`${API_CONFIG.BASE_URL}/faculties/${id}/`);
        cache.clearByFaculty(id);
        cache.clearByPrefix('faculties');
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting faculty ${id}:`, error);
        throw error;
    }
};

export const createBranch = async (data) => {
    try {
        const result = await apiPost(API_ENDPOINTS.BRANCHES, data);
        cache.clearByPrefix('branches');
        cache.clearByPrefix('chapters');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
    }
};

export const updateBranch = async (id, data) => {
    try {
        const result = await apiPut(`${API_CONFIG.BASE_URL}/branches/${id}/`, data);
        cache.clearByBranch(id);
        cache.clearByPrefix('branches');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error(`Error updating branch ${id}:`, error);
        throw error;
    }
};

export const deleteBranch = async (id) => {
    try {
        await apiDelete(`${API_CONFIG.BASE_URL}/branches/${id}/`);
        cache.clearByBranch(id);
        cache.clearByPrefix('branches');
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting branch ${id}:`, error);
        throw error;
    }
};

export const createChapter = async (data) => {
    try {
        const result = await apiPost(API_ENDPOINTS.CHAPTERS, data);
        cache.clearByPrefix('chapters');
        cache.clearByPrefix('questions');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error('Error creating chapter:', error);
        throw error;
    }
};

export const updateChapter = async (id, data) => {
    try {
        const result = await apiPut(`${API_CONFIG.BASE_URL}/chapters/${id}/`, data);
        cache.clearByChapter(id);
        cache.clearByPrefix('chapters');
        cache.clearByPrefix('full_hierarchy');
        return result;
    } catch (error) {
        console.error(`Error updating chapter ${id}:`, error);
        throw error;
    }
};

export const deleteChapter = async (id) => {
    try {
        await apiDelete(`${API_CONFIG.BASE_URL}/chapters/${id}/`);
        cache.clearByChapter(id);
        cache.clearByPrefix('chapters');
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting chapter ${id}:`, error);
        throw error;
    }
};

export const createQuestion = async (data) => {
    try {
        const result = await apiPost(API_ENDPOINTS.QUESTIONS, data);
        if (data.chapter) {
            cache.clearByChapter(data.chapter);
        }
        cache.clearByPrefix('questions');
        return result;
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

export const updateQuestion = async (id, data) => {
    try {
        const result = await apiPut(`${API_CONFIG.BASE_URL}/questions/${id}/`, data);
        if (data.chapter) {
            cache.clearByChapter(data.chapter);
        }
        cache.clearByPrefix('questions');
        return result;
    } catch (error) {
        console.error(`Error updating question ${id}:`, error);
        throw error;
    }
};

export const deleteQuestion = async (id) => {
    try {
        await apiDelete(`${API_CONFIG.BASE_URL}/questions/${id}/`);
        cache.clearByPrefix('questions');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting question ${id}:`, error);
        throw error;
    }
};

// ============================================
// CACHE MANAGEMENT FUNCTIONS
// ============================================

export const clearCache = () => cache.clear();
export const getCacheStats = () => cache.getStats();
export const clearCacheByPrefix = (prefix) => cache.clearByPrefix(prefix);
export const clearCacheByCategory = (categoryId) => cache.clearByCategory(categoryId);
export const clearCacheByFaculty = (facultyId) => cache.clearByFaculty(facultyId);
export const clearCacheByBranch = (branchId) => cache.clearByBranch(branchId);
export const clearCacheByChapter = (chapterId) => cache.clearByChapter(chapterId);

// ============================================
// FORCE REFRESH FUNCTIONS
// ============================================

export const refreshCategories = () => fetchCategories(true);
export const refreshFacultiesByCategory = (categoryId) => fetchFacultiesByCategory(categoryId, true);
export const refreshBranchesByFaculty = (facultyId) => fetchBranchesByFaculty(facultyId, true);
export const refreshChaptersByBranch = (branchId) => fetchChaptersByBranch(branchId, true);
export const refreshQuestionsByChapter = (chapterId) => fetchQuestionsByChapter(chapterId, true);

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
    // Fetch functions
    fetchCategories,
    fetchCategory,
    fetchCategoryWithAll,
    fetchCategoriesWithFaculties,
    fetchFaculties,
    fetchFacultiesByCategory,
    fetchFaculty,
    fetchFacultyWithAll,
    fetchBranches,
    fetchBranchesByFaculty,
    fetchBranch,
    fetchBranchWithAll,
    fetchChapters,
    fetchChaptersByBranch,
    fetchChapter,
    fetchQuestions,
    fetchQuestionsByChapter,
    fetchAllQuestions,
    fetchQuestion,
    fetchFullHierarchy,
    searchQuestions,
    fetchStats,
    
    // CRUD
    createCategory,
    updateCategory,
    deleteCategory,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    createBranch,
    updateBranch,
    deleteBranch,
    createChapter,
    updateChapter,
    deleteChapter,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    
    // Cache
    clearCache,
    getCacheStats,
    clearCacheByPrefix,
    clearCacheByCategory,
    clearCacheByFaculty,
    clearCacheByBranch,
    clearCacheByChapter,
    
    // Force Refresh
    refreshCategories,
    refreshFacultiesByCategory,
    refreshBranchesByFaculty,
    refreshChaptersByBranch,
    refreshQuestionsByChapter,
    
    // Cache instance
    cache,
};