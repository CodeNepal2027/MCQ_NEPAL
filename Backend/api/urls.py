from django.urls import path, include
from rest_framework.routers import DefaultRouter
from MCQ.views import (
    CategoryViewSet,
    ChapterViewSet,
    FacultyViewSet,
    BranchViewSet,
    QuestionViewSet,
    
    get_full_hierarchy,
    get_questions_by_path,
    search_questions,
    get_stats,
)

router = DefaultRouter()

# ====== MCQ APP VIEWSETS ======
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'faculties', FacultyViewSet, basename='faculties')
router.register(r'branches', BranchViewSet, basename='branches')
router.register(r'chapters', ChapterViewSet, basename='chapters')
router.register(r'questions', QuestionViewSet, basename='questions')

urlpatterns = [
    path('', include(router.urls)),
    
    # ====== CUSTOM ACTION URLs (Non-CRUD) ======
    # Full hierarchy
    path('full-hierarchy/', get_full_hierarchy, name='full-hierarchy'),
    
    # Questions by path (matches frontend pattern)
    path('questions/<str:category_id>/<str:faculty_id>/<str:branch_id>/<str:chapter_id>/', 
            get_questions_by_path, name='questions-by-path'),
    
    # Search
    path('search/', search_questions, name='search'),
    
    # Stats
    path('stats/', get_stats, name='stats'),
]