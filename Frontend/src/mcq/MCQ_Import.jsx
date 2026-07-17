// Import API related
import MCQ_API_Context from "./MCQ_API_Context"
import MCQ_API_Provider from "./MCQ_API_Provider"

// Import Route
import MCQ_Route from "./MCQ_Route"

// Import Main Components
import MCQ from "./MCQ"
import MCQ_Category from "./components/MCQ_Category"
import MCQ_Faculty from "./components/MCQ_Faculty"
import MCQ_Branch from "./components/MCQ_Branch"
import MCQ_Chapter from "./components/MCQ_Chapter"
import MCQ_Question from "./components/MCQ_Question"
import MCQ_QuestionNav from "./components/MCQ_QuestionNav"
import MCQ_Result from "./components/MCQ_Result"

// Import API functions directly
import { 
    fetchCategories,
    fetchFaculties,
    fetchBranches,
    fetchChapters,
    fetchQuestions,
    clearCache
} from "./MCQ_API_Fetch"

export {
    // Components
    MCQ_API_Context,
    MCQ_API_Provider,
    MCQ_Route,
    MCQ,
    MCQ_Category,
    MCQ_Faculty,
    MCQ_Branch,
    MCQ_Chapter,
    MCQ_Question,
    MCQ_QuestionNav,
    MCQ_Result,
    // API Functions
    fetchCategories,
    fetchFaculties,
    fetchBranches,
    fetchChapters,
    fetchQuestions,
    clearCache
}

export default {
    MCQ_API_Context,
    MCQ_API_Provider,
    MCQ_Route,
    MCQ,
    MCQ_Category,
    MCQ_Faculty,
    MCQ_Branch,
    MCQ_Chapter,
    MCQ_Question,
    MCQ_QuestionNav,
    MCQ_Result,
    fetchCategories,
    fetchFaculties,
    fetchBranches,
    fetchChapters,
    fetchQuestions,
    clearCache
}