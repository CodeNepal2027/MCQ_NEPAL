from django.db import models
from django.utils import timezone


# ------------- CATEGIRIES like "Entrance", "License" -------------
class Category(models.Model):
    """Top level: Entrance, License, etc."""
    id = models.CharField(
        max_length=50, 
        primary_key=True,
        help_text="Unique identifier for the category (e.g., 'entrance', 'license')"
    )
    name = models.CharField(
        max_length=100,
        help_text="Display name of the category (e.g., 'Entrance', 'License')"
    )
    icon = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        help_text="Bootstrap icon class for the category (e.g., 'bi-mortarboard-fill')"
    )
    color = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text="Hex color code for the category (e.g., '#b226dc')"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Brief description of the category"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the category was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the category was last updated"
    )
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ------------ FACULTIES like "CMAT", "IOE", "LokSewa" -------------
class Faculty(models.Model):
    """Second level: CMAT, IOE, LokSewa, etc."""
    id = models.CharField(
        max_length=50, 
        primary_key=True,
        help_text="Unique identifier for the faculty (e.g., 'cmat', 'ioe')"
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='faculties',
        help_text="Parent category this faculty belongs to"
    )
    name = models.CharField(
        max_length=100,
        help_text="Display name of the faculty (e.g., 'CMAT', 'IOE')"
    )
    icon = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        help_text="Bootstrap icon class for the faculty (e.g., 'bi-building-fill')"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Brief description of the faculty"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the faculty was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the faculty was last updated"
    )
    
    class Meta:
        verbose_name_plural = "Faculties"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.category.name} - {self.name}"


# ----------- BRANCHES like "General", "Quantitative", "Computer" -------------
class Branch(models.Model):
    """Third level: General, Quantitative, Computer, Civil, etc."""
    id = models.CharField(
        max_length=50, 
        primary_key=True,
        help_text="Unique identifier for the branch (e.g., 'general', 'computer')"
    )
    faculty = models.ForeignKey(
        Faculty, 
        on_delete=models.CASCADE, 
        related_name='branches',
        help_text="Parent faculty this branch belongs to"
    )
    name = models.CharField(
        max_length=100,
        help_text="Display name of the branch (e.g., 'General', 'Computer Engineering')"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Brief description of the branch"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the branch was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the branch was last updated"
    )
    
    class Meta:
        verbose_name_plural = "Branches"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.faculty.name} - {self.name}"
    
    @property
    def question_count(self):
        """Calculate total questions in this branch"""
        total = 0
        for chapter in self.chapters.all():
            total += chapter.questions.count()
        return total


# ----------- CHAPTERS like "Chapter 1", "Chapter 2" -------------
class Chapter(models.Model):
    """Fourth level: Actual study chapters with questions"""
    id = models.CharField(
        max_length=50, 
        primary_key=True,
        help_text="Unique identifier for the chapter (e.g., 'ch1', 'ch2')"
    )
    branch = models.ForeignKey(
        Branch, 
        on_delete=models.CASCADE, 
        related_name='chapters',
        help_text="Parent branch this chapter belongs to"
    )
    name = models.CharField(
        max_length=200,
        help_text="Display name of the chapter (e.g., 'Chapter 1: Nepal Overview')"
    )
    description = models.TextField(
        blank=True, 
        null=True,
        help_text="Brief description of the chapter content"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the chapter was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the chapter was last updated"
    )
    
    class Meta:
        verbose_name_plural = "Chapters"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.branch.name} - {self.name}"
    
    @property
    def question_count(self):
        """Get number of questions in this chapter"""
        return self.questions.count()


# ------------ QUESTIONS -------------
class Question(models.Model):
    """Actual MCQ questions"""
    chapter = models.ForeignKey(
        Chapter, 
        on_delete=models.CASCADE, 
        related_name='questions',
        help_text="Parent chapter this question belongs to"
    )
    question_text = models.TextField(
        help_text="The actual question text"
    )
    image_url = models.URLField(
        max_length=500, 
        blank=True, 
        null=True,
        help_text="Optional URL to an image for the question (e.g., circuit diagrams, traffic signs)"
    )
    option_1 = models.CharField(
        max_length=500,
        help_text="First option for the MCQ"
    )
    option_2 = models.CharField(
        max_length=500,
        help_text="Second option for the MCQ"
    )
    option_3 = models.CharField(
        max_length=500,
        help_text="Third option for the MCQ"
    )
    option_4 = models.CharField(
        max_length=500,
        help_text="Fourth option for the MCQ"
    )
    correct_answer = models.PositiveSmallIntegerField(
        choices=(
            (0, 'Option 1'),
            (1, 'Option 2'),
            (2, 'Option 3'),
            (3, 'Option 4'),
        ), 
        default=0,
        help_text="Index of the correct answer (0-3)"
    )
    explanation = models.TextField(
        blank=True, 
        null=True,
        help_text="Detailed explanation of why the answer is correct"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the question was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the question was last updated"
    )
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"Q{self.id}: {self.question_text[:50]}..."
    
    def get_options(self):
        """Return options as a list for API response"""
        return [self.option_1, self.option_2, self.option_3, self.option_4]