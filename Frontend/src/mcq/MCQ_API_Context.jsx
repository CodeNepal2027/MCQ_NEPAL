import React, { createContext, useContext, useReducer, useEffect } from 'react';

// ============================================
// HELPER: Get Initial State from localStorage
// ============================================
const getInitialState = () => {
    try {
        const savedState = localStorage.getItem('mcq_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            if (parsed && parsed.selectedCategory) {
                return {
                    categories: [],
                    selectedCategory: parsed.selectedCategory || null,
                    selectedFaculty: parsed.selectedFaculty || null,
                    selectedBranch: parsed.selectedBranch || null,
                    selectedChapter: parsed.selectedChapter || null,
                    questions: parsed.questions || [],
                    currentQuestionIndex: parsed.currentQuestionIndex || 0,
                    totalQuestions: parsed.totalQuestions || 0,
                    selectedAnswers: parsed.selectedAnswers || {},
                    quizCompleted: parsed.quizCompleted || false,
                    score: parsed.score || 0,
                    isLoading: true,
                    error: null,
                    isSubmitting: false
                };
            }
        }
    } catch (e) {
        console.warn('Failed to restore MCQ state:', e);
    }
    
    return {
        categories: [],
        selectedCategory: null,
        selectedFaculty: null,
        selectedBranch: null,
        selectedChapter: null,
        questions: [],
        currentQuestionIndex: 0,
        totalQuestions: 0,
        selectedAnswers: {},
        quizCompleted: false,
        score: 0,
        isLoading: false,
        error: null,
        isSubmitting: false
    };
};

// ============================================
// INITIAL STATE
// ============================================
const initialState = getInitialState();

// ============================================
// ACTION TYPES
// ============================================
export const ACTIONS = {
    SET_CATEGORIES: 'SET_CATEGORIES',
    SELECT_CATEGORY: 'SELECT_CATEGORY',
    SELECT_FACULTY: 'SELECT_FACULTY',
    SELECT_BRANCH: 'SELECT_BRANCH',
    SELECT_CHAPTER: 'SELECT_CHAPTER',
    SET_QUESTIONS: 'SET_QUESTIONS',
    NEXT_QUESTION: 'NEXT_QUESTION',
    PREV_QUESTION: 'PREV_QUESTION',
    JUMP_TO_QUESTION: 'JUMP_TO_QUESTION',
    SELECT_ANSWER: 'SELECT_ANSWER',
    CLEAR_ANSWERS: 'CLEAR_ANSWERS',
    COMPLETE_QUIZ: 'COMPLETE_QUIZ',
    RESET_QUIZ: 'RESET_QUIZ',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_SUBMITTING: 'SET_SUBMITTING',
    UPDATE_FACULTY: 'UPDATE_FACULTY',
    UPDATE_BRANCH: 'UPDATE_BRANCH',
};

// ============================================
// HELPER: Save State to localStorage
// ============================================
const saveStateToLocalStorage = (state) => {
    try {
        const stateToSave = {
            selectedCategory: state.selectedCategory,
            selectedFaculty: state.selectedFaculty,
            selectedBranch: state.selectedBranch,
            selectedChapter: state.selectedChapter,
            questions: state.questions,
            currentQuestionIndex: state.currentQuestionIndex,
            totalQuestions: state.totalQuestions,
            selectedAnswers: state.selectedAnswers,
            quizCompleted: state.quizCompleted,
            score: state.score
        };
        localStorage.setItem('mcq_state', JSON.stringify(stateToSave));
    } catch (e) {
        console.warn('Failed to save MCQ state:', e);
    }
};

// ============================================
// REDUCER
// ============================================
const mcqReducer = (state, action) => {
    let newState;
    
    switch (action.type) {
        case ACTIONS.SET_CATEGORIES:
            const categories = Array.isArray(action.payload) ? action.payload : [];
            newState = { ...state, categories, isLoading: false };
            break;

        case ACTIONS.SELECT_CATEGORY:
            newState = {
                ...state,
                selectedCategory: action.payload,
                selectedFaculty: null,
                selectedBranch: null,
                selectedChapter: null,
                questions: [],
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                totalQuestions: 0,
                error: null,
                isLoading: false
            };
            break;

        case ACTIONS.SELECT_FACULTY:
            newState = {
                ...state,
                selectedFaculty: action.payload,
                selectedBranch: null,
                selectedChapter: null,
                questions: [],
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                totalQuestions: 0,
                error: null,
                isLoading: false
            };
            break;

        case ACTIONS.SELECT_BRANCH:
            newState = {
                ...state,
                selectedBranch: action.payload,
                selectedChapter: null,
                questions: [],
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                totalQuestions: 0,
                error: null,
                isLoading: false
            };
            break;

        case ACTIONS.SELECT_CHAPTER:
            newState = {
                ...state,
                selectedChapter: action.payload,
                questions: [],
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                totalQuestions: 0,
                error: null,
                isLoading: false
            };
            break;

        case ACTIONS.SET_QUESTIONS:
            const questions = Array.isArray(action.payload) ? action.payload : [];
            newState = {
                ...state,
                questions: questions,
                totalQuestions: questions.length,
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                isLoading: false,
                error: null
            };
            break;

        case ACTIONS.NEXT_QUESTION:
            newState = {
                ...state,
                currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
            };
            break;

        case ACTIONS.PREV_QUESTION:
            newState = {
                ...state,
                currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
            };
            break;

        case ACTIONS.JUMP_TO_QUESTION:
            newState = {
                ...state,
                currentQuestionIndex: Math.min(Math.max(action.payload, 0), state.questions.length - 1)
            };
            break;

        case ACTIONS.SELECT_ANSWER:
            newState = {
                ...state,
                selectedAnswers: {
                    ...state.selectedAnswers,
                    [action.payload.questionId]: action.payload.answerIndex
                }
            };
            break;

        case ACTIONS.CLEAR_ANSWERS:
            newState = { ...state, selectedAnswers: {} };
            break;

        case ACTIONS.COMPLETE_QUIZ: {
            const correctCount = state.questions.filter(
                q => state.selectedAnswers[q.id] === q.correctAnswer
            ).length;
            newState = { ...state, quizCompleted: true, score: correctCount, isSubmitting: false };
            break;
        }

        case ACTIONS.RESET_QUIZ:
            // Keep questions but reset all quiz-related state
            newState = {
                ...state,
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                isSubmitting: false,
                error: null,
                isLoading: false
                // Keep: questions, selectedChapter, selectedBranch, selectedFaculty, selectedCategory
            };
            break;

        case ACTIONS.SET_LOADING:
            newState = { ...state, isLoading: action.payload };
            break;

        case ACTIONS.SET_ERROR:
            newState = { ...state, error: action.payload, isLoading: false };
            break;

        case ACTIONS.CLEAR_ERROR:
            newState = { ...state, error: null };
            break;

        case ACTIONS.SET_SUBMITTING:
            newState = { ...state, isSubmitting: action.payload };
            break;

        case ACTIONS.UPDATE_FACULTY:
            const { facultyId, facultyData } = action.payload;
            const updatedCategories = state.categories.map(category => {
                if (category.id === state.selectedCategory) {
                    return {
                        ...category,
                        faculties: category.faculties?.map(f => 
                            f.id === facultyId ? facultyData : f
                        ) || []
                    };
                }
                return category;
            });
            newState = { 
                ...state, 
                categories: updatedCategories, 
                isLoading: false 
            };
            break;

        case ACTIONS.UPDATE_BRANCH:
            const { branchId, branchData } = action.payload;
            const updatedCats = state.categories.map(category => {
                if (category.id === state.selectedCategory) {
                    return {
                        ...category,
                        faculties: category.faculties?.map(faculty => {
                            if (faculty.id === state.selectedFaculty) {
                                return {
                                    ...faculty,
                                    branches: faculty.branches?.map(b => 
                                        b.id === branchId ? branchData : b
                                    ) || []
                                };
                            }
                            return faculty;
                        }) || []
                    };
                }
                return category;
            });
            newState = { 
                ...state, 
                categories: updatedCats, 
                isLoading: false 
            };
            break;

        default:
            newState = state;
    }
    
    if (action.type !== ACTIONS.SET_LOADING && 
        action.type !== ACTIONS.SET_ERROR && 
        action.type !== ACTIONS.CLEAR_ERROR) {
        saveStateToLocalStorage(newState);
    }
    
    return newState;
};

// ============================================
// CREATE CONTEXT
// ============================================
const MCQ_API_Context = createContext();

// ============================================
// PROVIDER COMPONENT
// ============================================
export const MCQProvider = ({ children }) => {
    const [state, dispatch] = useReducer(mcqReducer, initialState);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                if (state.categories && state.categories.length > 0) {
                    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
                    return;
                }
                
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                
                const { fetchCategories } = await import('./MCQ_API_Fetch');
                const data = await fetchCategories();
                
                console.log('📦 Categories loaded in context:', data?.length || 0);
                
                const categories = Array.isArray(data) ? data : [];
                dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
            } catch (error) {
                console.error('Failed to load categories:', error);
                dispatch({ 
                    type: ACTIONS.SET_ERROR, 
                    payload: 'Failed to load categories. Please try again.' 
                });
            }
        };
        
        loadCategories();
    }, []);

    // Computed Values with safety checks
    const getCurrentQuestion = () => {
        if (!state.questions || state.questions.length === 0) return null;
        return state.questions[state.currentQuestionIndex] || null;
    };

    const getAnsweredCount = () => {
        if (!state.selectedAnswers) return 0;
        return Object.keys(state.selectedAnswers).length;
    };

    const getProgress = () => {
        if (!state.totalQuestions || state.totalQuestions === 0) return 0;
        return ((state.currentQuestionIndex + 1) / state.totalQuestions) * 100;
    };

    const getScorePercentage = () => {
        if (!state.totalQuestions || state.totalQuestions === 0) return 0;
        return Math.round((state.score / state.totalQuestions) * 100);
    };

    const getCategory = () => {
        if (!state.categories || !Array.isArray(state.categories) || !state.selectedCategory) {
            return null;
        }
        return state.categories.find(c => c.id === state.selectedCategory) || null;
    };

    const getFaculty = () => {
        const category = getCategory();
        if (!category || !category.faculties || !Array.isArray(category.faculties)) {
            return null;
        }
        return category.faculties.find(f => f.id === state.selectedFaculty) || null;
    };

    const getBranch = () => {
        const faculty = getFaculty();
        if (!faculty || !faculty.branches || !Array.isArray(faculty.branches)) {
            return null;
        }
        return faculty.branches.find(b => b.id === state.selectedBranch) || null;
    };

    const getChapter = () => {
        const branch = getBranch();
        if (!branch || !branch.chapters || !Array.isArray(branch.chapters)) {
            return null;
        }
        return branch.chapters.find(c => c.id === state.selectedChapter) || null;
    };

    const value = {
        ...state,
        
        // Computed Values
        currentQuestion: getCurrentQuestion(),
        answeredCount: getAnsweredCount(),
        progress: getProgress(),
        scorePercentage: getScorePercentage(),
        category: getCategory(),
        faculty: getFaculty(),
        branch: getBranch(),
        chapter: getChapter(),
        
        // Dispatch
        dispatch,
        ACTIONS,
        
        // Action Creators
        setCategories: (categories) => {
            const safeCategories = Array.isArray(categories) ? categories : [];
            dispatch({ type: ACTIONS.SET_CATEGORIES, payload: safeCategories });
        },
        selectCategory: (categoryId) => dispatch({ type: ACTIONS.SELECT_CATEGORY, payload: categoryId }),
        selectFaculty: (facultyId) => dispatch({ type: ACTIONS.SELECT_FACULTY, payload: facultyId }),
        selectBranch: (branchId) => dispatch({ type: ACTIONS.SELECT_BRANCH, payload: branchId }),
        selectChapter: (chapterId) => dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: chapterId }),
        setQuestions: (questions) => {
            const safeQuestions = Array.isArray(questions) ? questions : [];
            dispatch({ type: ACTIONS.SET_QUESTIONS, payload: safeQuestions });
        },
        nextQuestion: () => dispatch({ type: ACTIONS.NEXT_QUESTION }),
        prevQuestion: () => dispatch({ type: ACTIONS.PREV_QUESTION }),
        jumpToQuestion: (index) => dispatch({ type: ACTIONS.JUMP_TO_QUESTION, payload: index }),
        selectAnswer: (questionId, answerIndex) => dispatch({
            type: ACTIONS.SELECT_ANSWER,
            payload: { questionId, answerIndex }
        }),
        clearAnswers: () => dispatch({ type: ACTIONS.CLEAR_ANSWERS }),
        completeQuiz: () => dispatch({ type: ACTIONS.COMPLETE_QUIZ }),
        resetQuiz: () => dispatch({ type: ACTIONS.RESET_QUIZ }),
        setLoading: (isLoading) => dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading }),
        setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
        clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR }),
        setSubmitting: (isSubmitting) => dispatch({ type: ACTIONS.SET_SUBMITTING, payload: isSubmitting })
    };

    return (
        <MCQ_API_Context.Provider value={value}>
            {children}
        </MCQ_API_Context.Provider>
    );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useMCQ = () => {
    const context = useContext(MCQ_API_Context);
    if (!context) {
        throw new Error('useMCQ must be used within a MCQProvider');
    }
    return context;
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default MCQ_API_Context;