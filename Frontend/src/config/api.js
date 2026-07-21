// ============================================
// API CONFIGURATION - VITE VERSION
// ============================================

// Get API URL from environment variables
const getApiUrl = () => {
    // Check if we should use mock data
    const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
                    import.meta.env.REACT_APP_USE_MOCK_DATA === 'true';
    if (useMock) {
        return ''; // Mock data will be used
    }
    
    // Vite uses import.meta.env
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
        // Try VITE_ prefix first, then REACT_APP_
        const url = import.meta.env.REACT_APP_BACKEND_API_DEVELOPMENT_URL || 
                    import.meta.env.REACT_APP_BACKEND_API_DEVELOPMENT_URL || 
                    'http://127.0.0.1:8000/api/v1/';
        console.log('🔧 Development API URL:', url);
        return url;
    }
    
    const url = import.meta.env.REACT_APP_BACKEND_API_PRODUCTION_URL || 
                import.meta.env.REACT_APP_BACKEND_API_PRODUCTION_URL || 
                'https://codenepal.com.np/api/v1/';
    console.log('🔧 Production API URL:', url);
    return url;
};

// Get the base URL
const BASE_URL = getApiUrl();

// Log the base URL for debugging
console.log('🔧 API Base URL:', BASE_URL);

// Export configuration
export const API_CONFIG = {
    BASE_URL: BASE_URL,
    TIMEOUT: parseInt(
        import.meta.env.VITE_API_TIMEOUT || 
        import.meta.env.REACT_APP_API_TIMEOUT || '30000'),
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    USE_MOCK_DATA:  import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
                    import.meta.env.REACT_APP_USE_MOCK_DATA === 'true' || false,
    DEBUG: import.meta.env.VITE_DEBUG_API === 'true' || 
           import.meta.env.REACT_APP_DEBUG_API === 'true' || true, // Force debug on
};

export const USE_MOCK_DATA = API_CONFIG.USE_MOCK_DATA;

// Log configuration in development
console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    USE_MOCK_DATA: API_CONFIG.USE_MOCK_DATA,
    DEBUG: API_CONFIG.DEBUG,
    VITE_DEV: import.meta.env.DEV,
    VITE_MODE: import.meta.env.MODE,
});

// API Endpoints - Using full URL
export const API_ENDPOINTS = {
    // MCQ Endpoints
    CATEGORIES: `${BASE_URL}categories/`,
    FACULTIES: `${BASE_URL}faculties/`,
    BRANCHES: `${BASE_URL}branches/`,
    CHAPTERS: `${BASE_URL}chapters/`,
    QUESTIONS: `${BASE_URL}questions/`,
    
    // Custom Endpoints
    FULL_HIERARCHY: `${BASE_URL}full-hierarchy/`,
    SEARCH: `${BASE_URL}search/`,
    STATS: `${BASE_URL}stats/`,
    
    // Path-based endpoints
    QUESTIONS_BY_PATH: (categoryId, facultyId, branchId, chapterId) => 
        `${BASE_URL}questions/${categoryId}/${facultyId}/${branchId}/${chapterId}/`,
    
    CATEGORY_FACULTIES: (categoryId) => 
        `${BASE_URL}categories/${categoryId}/faculties/`,
    
    CATEGORY_FULL: (categoryId) => 
        `${BASE_URL}categories/${categoryId}/full/`,
    
    FACULTY_BRANCHES: (facultyId) => {
        const url = `${BASE_URL}faculties/${facultyId}/branches/`;
        console.log('📡 FACULTY_BRANCHES URL:', url);
        return url;
    },
    
    FACULTY_FULL: (facultyId) => 
        `${BASE_URL}faculties/${facultyId}/full/`,
    
    BRANCH_CHAPTERS: (branchId) => 
        `${BASE_URL}branches/${branchId}/chapters/`,
    
    BRANCH_FULL: (branchId) => 
        `${BASE_URL}branches/${branchId}/full/`,
    
    CHAPTER_QUESTIONS: (chapterId) => 
        `${BASE_URL}chapters/${chapterId}/questions/`,
};

// Helper function to get headers
export const getHeaders = (customHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...customHeaders,
    };
    
    try {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {
        // localStorage not available
    }
    
    return headers;
};

// ============================================
// API CLIENT FUNCTIONS
// ============================================

export const apiGet = async (endpoint, params = {}, customHeaders = {}) => {
    let url = endpoint;
    if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                queryParams.append(key, params[key]);
            }
        });
        url += `?${queryParams.toString()}`;
    }
    
    const headers = getHeaders(customHeaders);
    
    console.log(`[API GET] ${url}`);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: 'include',
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: errorData.error || errorData.message || `HTTP ${response.status}`,
                data: errorData,
            };
        }
        
        return await response.json();
    } catch (error) {
        console.error(`GET Error (${endpoint}):`, error);
        throw error;
    }
};

export const apiPost = async (endpoint, data = {}, customHeaders = {}) => {
    const headers = getHeaders(customHeaders);
    
    if (API_CONFIG.DEBUG) {
        console.log(`[API POST] ${endpoint}`, data);
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: errorData.error || errorData.message || `HTTP ${response.status}`,
                data: errorData,
            };
        }
        
        return await response.json();
    } catch (error) {
        console.error(`POST Error (${endpoint}):`, error);
        throw error;
    }
};

export const apiPut = async (endpoint, data = {}, customHeaders = {}) => {
    const headers = getHeaders(customHeaders);
    
    if (API_CONFIG.DEBUG) {
        console.log(`[API PUT] ${endpoint}`, data);
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers,
            credentials: 'include',
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: errorData.error || errorData.message || `HTTP ${response.status}`,
                data: errorData,
            };
        }
        
        return await response.json();
    } catch (error) {
        console.error(`PUT Error (${endpoint}):`, error);
        throw error;
    }
};

export const apiPatch = async (endpoint, data = {}, customHeaders = {}) => {
    const headers = getHeaders(customHeaders);
    
    if (API_CONFIG.DEBUG) {
        console.log(`[API PATCH] ${endpoint}`, data);
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers,
            credentials: 'include',
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: errorData.error || errorData.message || `HTTP ${response.status}`,
                data: errorData,
            };
        }
        
        return await response.json();
    } catch (error) {
        console.error(`PATCH Error (${endpoint}):`, error);
        throw error;
    }
};

export const apiDelete = async (endpoint, customHeaders = {}) => {
    const headers = getHeaders(customHeaders);
    
    if (API_CONFIG.DEBUG) {
        console.log(`[API DELETE] ${endpoint}`);
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers,
            credentials: 'include',
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: errorData.error || errorData.message || `HTTP ${response.status}`,
                data: errorData,
            };
        }
        
        return await response.json().catch(() => ({}));
    } catch (error) {
        console.error(`DELETE Error (${endpoint}):`, error);
        throw error;
    }
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
    API_CONFIG,
    API_ENDPOINTS,
    USE_MOCK_DATA,
    getHeaders,
    apiGet,
    apiPost,
    apiPut,
    apiPatch,
    apiDelete,
};