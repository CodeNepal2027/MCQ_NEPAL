from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.db.models import Count, Q
from .models import Category, Faculty, Branch, Chapter, Question
from .serializers import (
    CategorySerializer, FacultySerializer, BranchSerializer,
    ChapterSerializer, QuestionListSerializer, QuestionDetailSerializer,
    NestedCategorySerializer, NestedFacultySerializer, NestedBranchSerializer,
    CategoryDetailSerializer, FacultyDetailSerializer, BranchDetailSerializer
)


# ====== CATEGORY VIEWSET ======

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'full':
            return CategoryDetailSerializer
        return CategorySerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['get'], url_path='full')
    def full(self, request, id=None):
        category = self.get_object()
        serializer = NestedCategorySerializer(category)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=True, methods=['get'], url_path='faculties')
    def get_faculties(self, request, id=None):
        category = self.get_object()
        faculties = category.faculties.all()
        serializer = FacultySerializer(faculties, many=True, context={'request': request})
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='with-faculties')
    def with_faculties(self, request):
        categories = self.get_queryset()
        serializer = CategoryDetailSerializer(categories, many=True, context={'request': request})
        return Response({
            'success': True,
            'data': serializer.data
        })


# ====== FACULTY VIEWSET ======

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'full':
            return FacultyDetailSerializer
        return FacultySerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        queryset = Faculty.objects.all()
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset
    
    @action(detail=True, methods=['get'], url_path='full')
    def full(self, request, id=None):
        faculty = self.get_object()
        serializer = NestedFacultySerializer(faculty)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=True, methods=['get'], url_path='branches')
    def get_branches(self, request, id=None):
        """
        Get all branches for this faculty
        """
        try:
            faculty = self.get_object()
            # Don't use annotate with property names
            branches = faculty.branches.all()
            # Prefetch chapters for efficiency
            branches = branches.prefetch_related('chapters')
            serializer = BranchSerializer(branches, many=True, context={'request': request})
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ====== BRANCH VIEWSET ======

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'full':
            return BranchDetailSerializer
        return BranchSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        queryset = Branch.objects.all()
        faculty_id = self.request.query_params.get('faculty_id')
        if faculty_id:
            queryset = queryset.filter(faculty_id=faculty_id)
        return queryset
    
    @action(detail=True, methods=['get'], url_path='full')
    def full(self, request, id=None):
        branch = self.get_object()
        serializer = NestedBranchSerializer(branch)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=True, methods=['get'], url_path='chapters')
    def get_chapters(self, request, id=None):
        branch = self.get_object()
        chapters = branch.chapters.all()
        serializer = ChapterSerializer(chapters, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


# ====== CHAPTER VIEWSET ======

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        queryset = Chapter.objects.all()
        branch_id = self.request.query_params.get('branch_id')
        if branch_id:
            queryset = queryset.filter(branch_id=branch_id)
        return queryset
    
    @action(detail=True, methods=['get'], url_path='questions')
    def get_questions(self, request, id=None):
        chapter = self.get_object()
        questions = chapter.questions.all()
        serializer = QuestionListSerializer(questions, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'meta': {
                'chapter': chapter.name,
                'total': questions.count()
            }
        })


# ====== QUESTION VIEWSET ======

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionDetailSerializer
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return QuestionListSerializer
        return QuestionDetailSerializer
    
    def get_queryset(self):
        queryset = Question.objects.all()
        chapter_id = self.request.query_params.get('chapter_id')
        if chapter_id:
            queryset = queryset.filter(chapter_id=chapter_id)
        return queryset
    
    @action(detail=False, methods=['get'], url_path='by-chapter/(?P<chapter_id>[^/.]+)')
    def by_chapter(self, request, chapter_id=None):
        questions = Question.objects.filter(chapter_id=chapter_id)
        serializer = QuestionListSerializer(questions, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


# ====== CUSTOM API VIEWS ======

@api_view(['GET'])
def get_questions_by_path(request, category_id, faculty_id, branch_id, chapter_id):
    try:
        category = get_object_or_404(Category, id=category_id)
        faculty = get_object_or_404(Faculty, id=faculty_id, category=category)
        branch = get_object_or_404(Branch, id=branch_id, faculty=faculty)
        chapter = get_object_or_404(Chapter, id=chapter_id, branch=branch)
        
        questions = Question.objects.filter(chapter=chapter)
        serializer = QuestionListSerializer(questions, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'meta': {
                'category': category.name,
                'faculty': faculty.name,
                'branch': branch.name,
                'chapter': chapter.name,
                'total': questions.count()
            }
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def get_full_hierarchy(request):
    categories = Category.objects.all()
    serializer = NestedCategorySerializer(categories, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['GET'])
def search_questions(request):
    query = request.query_params.get('q', '')
    if not query:
        return Response({
            'success': True,
            'data': [],
            'message': 'No search query provided'
        }, status=status.HTTP_200_OK)
    
    questions = Question.objects.filter(
        Q(question_text__icontains=query) |
        Q(explanation__icontains=query)
    )[:50]
    
    serializer = QuestionListSerializer(questions, many=True)
    return Response({
        'success': True,
        'data': serializer.data,
        'meta': {
            'query': query,
            'total': questions.count()
        }
    })


@api_view(['GET'])
def get_stats(request):
    stats = {
        'total_categories': Category.objects.count(),
        'total_faculties': Faculty.objects.count(),
        'total_branches': Branch.objects.count(),
        'total_chapters': Chapter.objects.count(),
        'total_questions': Question.objects.count(),
    }
    return Response({
        'success': True,
        'data': stats
    })