from django.contrib import admin
from django.utils.html import format_html
from MCQ.models import Category, Faculty, Branch, Chapter, Question


class FacultyInline(admin.TabularInline):
    model = Faculty
    extra = 1
    fields = ['id', 'name', 'icon', 'description']
    show_change_link = True


class BranchInline(admin.TabularInline):
    model = Branch
    extra = 1
    fields = ['id', 'name', 'description']
    show_change_link = True


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 1
    fields = ['id', 'name', 'description']
    show_change_link = True


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ['question_text', 'correct_answer']
    show_change_link = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'icon', 'color_preview', 'description', 'faculty_count']
    search_fields = ['name', 'description']
    list_filter = ['name']
    inlines = [FacultyInline]
    
    def color_preview(self, obj):
        if obj.color:
            return format_html(
                '<span style="display:inline-block;width:20px;height:20px;background-color:{};border-radius:4px;"></span>',
                obj.color
            )
        return '-'
    color_preview.short_description = 'Color'
    
    def faculty_count(self, obj):
        return obj.faculties.count()
    faculty_count.short_description = 'Faculties'


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'icon', 'branch_count']
    search_fields = ['name', 'description']
    list_filter = ['category']
    inlines = [BranchInline]
    
    def branch_count(self, obj):
        return obj.branches.count()
    branch_count.short_description = 'Branches'


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'faculty', 'chapter_count']
    search_fields = ['name', 'description']
    list_filter = ['faculty__category', 'faculty']
    inlines = [ChapterInline]
    
    def chapter_count(self, obj):
        return obj.chapters.count()
    chapter_count.short_description = 'Chapters'


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'branch', 'question_count']
    search_fields = ['name', 'description']
    list_filter = ['branch__faculty__category', 'branch__faculty', 'branch']
    inlines = [QuestionInline]
    
    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_preview', 'chapter', 'correct_answer', 'has_image']
    search_fields = ['question_text', 'explanation']
    list_filter = ['chapter__branch__faculty__category', 'chapter__branch__faculty', 'chapter__branch', 'chapter']
    fieldsets = (
        ('Question Details', {
            'fields': ('chapter', 'question_text', 'image_url')
        }),
        ('Options', {
            'fields': ('option_1', 'option_2', 'option_3', 'option_4')
        }),
        ('Answer & Explanation', {
            'fields': ('correct_answer', 'explanation')
        }),
    )
    
    def question_preview(self, obj):
        return obj.question_text[:60] + '...' if len(obj.question_text) > 60 else obj.question_text
    question_preview.short_description = 'Question'
    
    def has_image(self, obj):
        return bool(obj.image_url)
    has_image.boolean = True
    has_image.short_description = 'Image'