// ============================================
// MCQ API SERVICE - Optimized with Smart Caching
// ============================================

import {
    API_ENDPOINTS,
    apiGet,
    apiPost,
    apiPut,
    apiPatch,
    apiDelete,
    USE_MOCK_DATA,
    API_CONFIG
} from '../config/api';

import { mockCategories, mockQuestions } from './MCQ_mockData';

// ============================================
// SMART CACHE MANAGEMENT
// ============================================

class SmartCache {
    constructor(duration = 5 * 60 * 1000) {
        this.cache = new Map();
        this.duration = duration;
        this.pendingRequests = new Map();
        this.stats = { hits: 0, misses: 0 };
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
    }

    clearByPrefix(prefix) {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }
    }

    getStats() {
        const total = this.stats.hits + this.stats.misses;
        return {
            ...this.stats,
            total,
            hitRate: total > 0 ? Math.round((this.stats.hits / total) * 100) : 0,
            size: this.cache.size,
        };
    }

    async getOrFetch(key, fetchFn) {
        const cached = this.get(key);
        if (cached) return cached;

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
// CATEGORY API FUNCTIONS
// ============================================

export const fetchCategories = async () => {
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
    });
};

export const fetchCategory = async (categoryId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockCategories.find(c => c.id === categoryId) || null;
    }

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}categories/${categoryId}/`);
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error);
        return null;
    }
};

export const fetchCategoryWithAll = async (categoryId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const category = mockCategories.find(c => c.id === categoryId);
        return category || null;
    }

    const cacheKey = `category_full_${categoryId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}categories/${categoryId}/full/`);
        const data = response.data || response;
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching full category ${categoryId}:`, error);
        return null;
    }
};

export const fetchFacultiesByCategory = async (categoryId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const category = mockCategories.find(c => c.id === categoryId);
        return category ? category.faculties || [] : [];
    }

    const cacheKey = `faculties_category_${categoryId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}categories/${categoryId}/faculties/`);
        const faculties = processApiResponse(response);
        cache.set(cacheKey, faculties);
        return faculties;
    } catch (error) {
        console.error(`Error fetching faculties for category ${categoryId}:`, error);
        return [];
    }
};

export const fetchCategoriesWithFaculties = async () => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockCategories.map(c => ({
            ...c,
            faculties: c.faculties || []
        }));
    }

    const cacheKey = 'categories_with_faculties';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}categories/with-faculties/`);
        const data = processApiResponse(response);
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching categories with faculties:', error);
        return [];
    }
};

// ============================================
// FACULTY API FUNCTIONS
// ============================================

export const fetchFaculties = async (categoryId = null) => {
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
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const params = categoryId ? { category_id: categoryId } : {};
        const response = await apiGet(API_ENDPOINTS.FACULTIES, params);
        const faculties = processApiResponse(response);
        cache.set(cacheKey, faculties);
        return faculties;
    } catch (error) {
        console.error('Error fetching faculties:', error);
        return [];
    }
};

export const fetchFaculty = async (facultyId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const category of mockCategories) {
            const faculty = category.faculties?.find(f => f.id === facultyId);
            if (faculty) return faculty;
        }
        return null;
    }

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}faculties/${facultyId}/`);
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching faculty ${facultyId}:`, error);
        return null;
    }
};

export const fetchFacultyWithAll = async (facultyId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        for (const category of mockCategories) {
            const faculty = category.faculties?.find(f => f.id === facultyId);
            if (faculty) return faculty;
        }
        return null;
    }

    const cacheKey = `faculty_full_${facultyId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}faculties/${facultyId}/full/`);
        const data = response.data || response;
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching full faculty ${facultyId}:`, error);
        return null;
    }
};

export const fetchBranchesByFaculty = async (facultyId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const category of mockCategories) {
            const faculty = category.faculties?.find(f => f.id === facultyId);
            if (faculty) return faculty.branches || [];
        }
        return [];
    }

    const cacheKey = `branches_faculty_${facultyId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}faculties/${facultyId}/branches/`);
        const branches = processApiResponse(response);
        cache.set(cacheKey, branches);
        return branches;
    } catch (error) {
        console.error(`Error fetching branches for faculty ${facultyId}:`, error);
        return [];
    }
};

// ============================================
// BRANCH API FUNCTIONS
// ============================================

export const fetchBranches = async (facultyId = null) => {
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
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const params = facultyId ? { faculty_id: facultyId } : {};
        const response = await apiGet(API_ENDPOINTS.BRANCHES, params);
        const branches = processApiResponse(response);
        cache.set(cacheKey, branches);
        return branches;
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
};

export const fetchBranch = async (branchId) => {
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

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}branches/${branchId}/`);
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching branch ${branchId}:`, error);
        return null;
    }
};

export const fetchBranchWithAll = async (branchId) => {
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
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}branches/${branchId}/full/`);
        const data = response.data || response;
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching full branch ${branchId}:`, error);
        return null;
    }
};

export const fetchChaptersByBranch = async (branchId) => {
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
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}branches/${branchId}/chapters/`);
        const chapters = processApiResponse(response);
        cache.set(cacheKey, chapters);
        return chapters;
    } catch (error) {
        console.error(`Error fetching chapters for branch ${branchId}:`, error);
        return [];
    }
};

// ============================================
// CHAPTER API FUNCTIONS
// ============================================

export const fetchChapters = async (branchId = null) => {
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
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const params = branchId ? { branch_id: branchId } : {};
        const response = await apiGet(API_ENDPOINTS.CHAPTERS, params);
        const chapters = processApiResponse(response);
        cache.set(cacheKey, chapters);
        return chapters;
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return [];
    }
};

export const fetchChapter = async (chapterId) => {
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

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}chapters/${chapterId}/`);
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching chapter ${chapterId}:`, error);
        return null;
    }
};

export const fetchQuestionsByChapter = async (chapterId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400));
        const key = Object.keys(mockQuestions).find(k => k.endsWith(`_${chapterId}`));
        return key ? mockQuestions[key] || [] : [];
    }

    const cacheKey = `questions_chapter_${chapterId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}chapters/${chapterId}/questions/`);
        const questions = processApiResponse(response);
        cache.set(cacheKey, questions);
        return questions;
    } catch (error) {
        console.error(`Error fetching questions for chapter ${chapterId}:`, error);
        return [];
    }
};

// ============================================
// QUESTION API FUNCTIONS
// ============================================

export const fetchQuestions = async (categoryId, facultyId, branchId, chapterId) => {
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
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(
            `${API_CONFIG.BASE_URL}questions/${categoryId}/${facultyId}/${branchId}/${chapterId}/`
        );
        const questions = processApiResponse(response);
        cache.set(cacheKey, questions);
        return questions;
    } catch (error) {
        console.error(`Error fetching questions:`, error);
        return [];
    }
};

export const fetchAllQuestions = async (chapterId = null) => {
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

export const fetchQuestion = async (questionId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        for (const key of Object.keys(mockQuestions)) {
            const question = mockQuestions[key].find(q => q.id === parseInt(questionId));
            if (question) return question;
        }
        return null;
    }

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}questions/${questionId}/`);
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching question ${questionId}:`, error);
        return null;
    }
};

// ============================================
// FULL HIERARCHY API
// ============================================

export const fetchFullHierarchy = async () => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockCategories;
    }

    const cacheKey = 'full_hierarchy';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet(`${API_CONFIG.BASE_URL}full-hierarchy/`);
        const data = processApiResponse(response);
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching full hierarchy:', error);
        return [];
    }
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
        const response = await apiGet(`${API_CONFIG.BASE_URL}search/`, { q: query });
        return processApiResponse(response);
    } catch (error) {
        console.error('Error searching questions:', error);
        return [];
    }
};

// ============================================
// STATS API
// ============================================

export const fetchStats = async () => {
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
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiGet('/stats/');
        const data = response.data || response;
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
};

// ============================================
// CRUD OPERATIONS
// ============================================

export const createCategory = async (data) => {
    try {
        const response = await apiPost(API_ENDPOINTS.CATEGORIES, data);
        cache.clearByPrefix('categories');
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id, data) => {
    try {
        const response = await apiPut(`/categories/${id}/`, data);
        cache.clearByPrefix('categories');
        cache.clearByPrefix(`category_full_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        await apiDelete(`/categories/${id}/`);
        cache.clearByPrefix('categories');
        cache.clearByPrefix(`category_full_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        throw error;
    }
};

export const createFaculty = async (data) => {
    try {
        const response = await apiPost(API_ENDPOINTS.FACULTIES, data);
        cache.clearByPrefix('faculties');
        cache.clearByPrefix('branches');
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error('Error creating faculty:', error);
        throw error;
    }
};

export const updateFaculty = async (id, data) => {
    try {
        const response = await apiPut(`/faculties/${id}/`, data);
        cache.clearByPrefix('faculties');
        cache.clearByPrefix(`faculty_full_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error(`Error updating faculty ${id}:`, error);
        throw error;
    }
};

export const deleteFaculty = async (id) => {
    try {
        await apiDelete(`/faculties/${id}/`);
        cache.clearByPrefix('faculties');
        cache.clearByPrefix(`faculty_full_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting faculty ${id}:`, error);
        throw error;
    }
};

export const createBranch = async (data) => {
    try {
        const response = await apiPost(API_ENDPOINTS.BRANCHES, data);
        cache.clearByPrefix('branches');
        cache.clearByPrefix('chapters');
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
    }
};

export const updateBranch = async (id, data) => {
    try {
        const response = await apiPut(`/branches/${id}/`, data);
        cache.clearByPrefix('branches');
        cache.clearByPrefix(`branch_full_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error(`Error updating branch ${id}:`, error);
        throw error;
    }
};

export const deleteBranch = async (id) => {
    try {
        await apiDelete(`/branches/${id}/`);
        cache.clearByPrefix('branches');
        cache.clearByPrefix(`branch_full_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting branch ${id}:`, error);
        throw error;
    }
};

export const createChapter = async (data) => {
    try {
        const response = await apiPost(API_ENDPOINTS.CHAPTERS, data);
        cache.clearByPrefix('chapters');
        cache.clearByPrefix('questions');
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error('Error creating chapter:', error);
        throw error;
    }
};

export const updateChapter = async (id, data) => {
    try {
        const response = await apiPut(`/chapters/${id}/`, data);
        cache.clearByPrefix('chapters');
        cache.clearByPrefix(`questions_chapter_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return response.data || response;
    } catch (error) {
        console.error(`Error updating chapter ${id}:`, error);
        throw error;
    }
};

export const deleteChapter = async (id) => {
    try {
        await apiDelete(`/chapters/${id}/`);
        cache.clearByPrefix('chapters');
        cache.clearByPrefix(`questions_chapter_${id}`);
        cache.clearByPrefix('full_hierarchy');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting chapter ${id}:`, error);
        throw error;
    }
};

export const createQuestion = async (data) => {
    try {
        const response = await apiPost(API_ENDPOINTS.QUESTIONS, data);
        cache.clearByPrefix('questions');
        if (data.chapter) {
            cache.clearByPrefix(`questions_chapter_${data.chapter}`);
        }
        return response.data || response;
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

export const updateQuestion = async (id, data) => {
    try {
        const response = await apiPut(`/questions/${id}/`, data);
        cache.clearByPrefix('questions');
        if (data.chapter) {
            cache.clearByPrefix(`questions_chapter_${data.chapter}`);
        }
        return response.data || response;
    } catch (error) {
        console.error(`Error updating question ${id}:`, error);
        throw error;
    }
};

export const deleteQuestion = async (id) => {
    try {
        await apiDelete(`/questions/${id}/`);
        cache.clearByPrefix('questions');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting question ${id}:`, error);
        throw error;
    }
};

// ============================================
// CACHE MANAGEMENT EXPORTS
// ============================================

export const clearCache = () => cache.clear();
export const getCacheStats = () => cache.getStats();
export const clearCacheByPrefix = (prefix) => cache.clearByPrefix(prefix);

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
    cache,
};