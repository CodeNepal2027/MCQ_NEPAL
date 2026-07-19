import React, { createContext, useContext, useReducer } from 'react';

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
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
    SET_SUBMITTING: 'SET_SUBMITTING'
};

// ============================================
// REDUCER
// ============================================
const mcqReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_CATEGORIES:
            return { ...state, categories: action.payload, isLoading: false };

        case ACTIONS.SELECT_CATEGORY:
            return {
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
                error: null
            };

        case ACTIONS.SELECT_FACULTY:
            return {
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
                error: null
            };

        case ACTIONS.SELECT_BRANCH:
            return {
                ...state,
                selectedBranch: action.payload,
                selectedChapter: null,
                questions: [],
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                totalQuestions: 0,
                error: null
            };

        case ACTIONS.SELECT_CHAPTER:
            return {
                ...state,
                selectedChapter: action.payload,
                questions: [],
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                totalQuestions: 0,
                error: null
            };

        case ACTIONS.SET_QUESTIONS:
            return {
                ...state,
                questions: action.payload,
                totalQuestions: action.payload.length,
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                isLoading: false,
                error: null
            };

        case ACTIONS.NEXT_QUESTION:
            return {
                ...state,
                currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
            };

        case ACTIONS.PREV_QUESTION:
            return {
                ...state,
                currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
            };

        case ACTIONS.JUMP_TO_QUESTION:
            return {
                ...state,
                currentQuestionIndex: Math.min(Math.max(action.payload, 0), state.questions.length - 1)
            };

        case ACTIONS.SELECT_ANSWER:
            return {
                ...state,
                selectedAnswers: {
                    ...state.selectedAnswers,
                    [action.payload.questionId]: action.payload.answerIndex
                }
            };

        case ACTIONS.CLEAR_ANSWERS:
            return { ...state, selectedAnswers: {} };

        case ACTIONS.COMPLETE_QUIZ: {
            const correctCount = state.questions.filter(
                q => state.selectedAnswers[q.id] === q.correctAnswer
            ).length;
            return { ...state, quizCompleted: true, score: correctCount, isSubmitting: false };
        }

        case ACTIONS.RESET_QUIZ:
            return {
                ...state,
                questions: [],
                currentQuestionIndex: 0,
                selectedAnswers: {},
                quizCompleted: false,
                score: 0,
                totalQuestions: 0,
                error: null
            };

        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };

        case ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };

        case ACTIONS.SET_SUBMITTING:
            return { ...state, isSubmitting: action.payload };

        default:
            return state;
    }
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

    // Computed Values
    const getCurrentQuestion = () => {
        if (state.questions.length === 0) return null;
        return state.questions[state.currentQuestionIndex];
    };

    const getAnsweredCount = () => {
        return Object.keys(state.selectedAnswers).length;
    };

    const getProgress = () => {
        if (state.totalQuestions === 0) return 0;
        return ((state.currentQuestionIndex + 1) / state.totalQuestions) * 100;
    };

    const getScorePercentage = () => {
        if (state.totalQuestions === 0) return 0;
        return Math.round((state.score / state.totalQuestions) * 100);
    };

    const getCategory = () => {
        return state.categories.find(c => c.id === state.selectedCategory) || null;
    };

    const getFaculty = () => {
        const category = getCategory();
        if (!category) return null;
        return category.faculties?.find(f => f.id === state.selectedFaculty) || null;
    };

    const getBranch = () => {
        const faculty = getFaculty();
        if (!faculty) return null;
        return faculty.branches?.find(b => b.id === state.selectedBranch) || null;
    };

    const getChapter = () => {
        const branch = getBranch();
        if (!branch) return null;
        return branch.chapters?.find(c => c.id === state.selectedChapter) || null;
    };

    const value = {
        // State
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
        setCategories: (categories) => dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories }),
        selectCategory: (categoryId) => dispatch({ type: ACTIONS.SELECT_CATEGORY, payload: categoryId }),
        selectFaculty: (facultyId) => dispatch({ type: ACTIONS.SELECT_FACULTY, payload: facultyId }),
        selectBranch: (branchId) => dispatch({ type: ACTIONS.SELECT_BRANCH, payload: branchId }),
        selectChapter: (chapterId) => dispatch({ type: ACTIONS.SELECT_CHAPTER, payload: chapterId }),
        setQuestions: (questions) => dispatch({ type: ACTIONS.SET_QUESTIONS, payload: questions }),
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