from rest_framework import serializers
from MCQ.models import (
        Category, 
        Faculty, 
        Branch, 
        Chapter, 
        Question
    )


# ====== BASE SERIALIZERS ======

class CategorySerializer(serializers.ModelSerializer):
    """Basic Category serializer"""
    faculties = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'description', 'faculties']
    
    def get_faculties(self, obj):
        request = self.context.get('request')
        if request and request.query_params.get('faculties') == 'true':
            return FacultySerializer(obj.faculties.all(), many=True, context=self.context).data
        return None


class FacultySerializer(serializers.ModelSerializer):
    """Basic Faculty serializer"""
    branches = serializers.SerializerMethodField()
    
    class Meta:
        model = Faculty
        fields = ['id', 'category', 'name', 'icon', 'description', 'branches']
    
    def get_branches(self, obj):
        request = self.context.get('request')
        if request and request.query_params.get('branches') == 'true':
            return BranchSerializer(obj.branches.all(), many=True, context=self.context).data
        return None



class CategoryDetailSerializer(serializers.ModelSerializer):
    """Category with faculties"""
    faculties = FacultySerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'description', 'faculties']



class BranchSerializer(serializers.ModelSerializer):
    """Basic Branch serializer"""
    chapters = serializers.SerializerMethodField()
    question_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Branch
        fields = ['id', 'faculty', 'name', 'description', 'question_count', 'chapters']
    
    def get_chapters(self, obj):
        request = self.context.get('request')
        if request and request.query_params.get('chapters') == 'true':
            return ChapterSerializer(obj.chapters.all(), many=True).data
        return None

class FacultyDetailSerializer(serializers.ModelSerializer):
    """Faculty with branches"""
    branches = BranchSerializer(many=True, read_only=True)
    
    class Meta:
        model = Faculty
        fields = ['id', 'category', 'name', 'icon', 'description', 'branches']


class ChapterSerializer(serializers.ModelSerializer):
    """Chapter serializer with question count"""
    question_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Chapter
        fields = ['id', 'branch', 'name', 'description', 'question_count']


class BranchDetailSerializer(serializers.ModelSerializer):
    """Branch with chapters"""
    chapters = ChapterSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Branch
        fields = ['id', 'faculty', 'name', 'description', 'question_count', 'chapters']


class QuestionListSerializer(serializers.ModelSerializer):
    """Minimal Question serializer (for listing)"""
    options = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'image_url', 'options', 'correct_answer', 'explanation']
    
    def get_options(self, obj):
        return obj.get_options()


class QuestionDetailSerializer(serializers.ModelSerializer):
    """Full Question serializer (for detail view)"""
    options = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'image_url', 'options', 'correct_answer', 'explanation']
    
    def get_options(self, obj):
        return obj.get_options()


# ====== NESTED SERIALIZERS ======

class NestedCategorySerializer(serializers.ModelSerializer):
    """Full nested Category with faculties → branches → chapters"""
    faculties = FacultySerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'description', 'faculties']


class NestedFacultySerializer(serializers.ModelSerializer):
    """Full nested Faculty with branches → chapters"""
    branches = BranchSerializer(many=True, read_only=True)
    
    class Meta:
        model = Faculty
        fields = ['id', 'name', 'icon', 'description', 'branches']


class NestedBranchSerializer(serializers.ModelSerializer):
    """Full nested Branch with chapters"""
    chapters = ChapterSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Branch
        fields = ['id', 'name', 'description', 'question_count', 'chapters']