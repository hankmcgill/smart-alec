# Register your models here.
from django.contrib import admin

from .models import Comment, Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin interface for Post model"""

    list_display = ["title", "created_at", "comment_count", "flagged_count"]
    search_fields = ["title", "body"]
    date_hierarchy = "created_at"

    def comment_count(self, obj):
        return obj.comments.count()

    comment_count.short_description = "Comments"

    def flagged_count(self, obj):
        return obj.comments.filter(flagged=True).count()

    flagged_count.short_description = "Flagged"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin interface for Comment model"""

    list_display = ["author", "post", "text_preview", "flagged", "created_at"]
    list_filter = ["flagged", "created_at"]
    search_fields = ["author", "text", "post__title"]
    date_hierarchy = "created_at"
    actions = ["mark_as_flagged", "mark_as_safe"]

    def text_preview(self, obj):
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text

    text_preview.short_description = "Text"

    def mark_as_flagged(self, request, queryset):
        updated = queryset.update(flagged=True)
        self.message_user(request, f"{updated} comment(s) marked as flagged.")

    mark_as_flagged.short_description = "Mark selected as flagged"

    def mark_as_safe(self, request, queryset):
        updated = queryset.update(flagged=False)
        self.message_user(request, f"{updated} comment(s) marked as safe.")

    mark_as_safe.short_description = "Mark selected as safe"
