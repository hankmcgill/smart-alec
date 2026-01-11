from rest_framework import serializers

from .classification import classify_comment
from .models import Comment, Post


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""

    class Meta:
        model = Comment
        fields = ["id", "post", "author", "text", "flagged", "created_at"]
        read_only_fields = ["flagged", "created_at"]

    def create(self, validated_data):
        """
        Create comment and automatically classify it.
        """
        text = validated_data.get("text", "")

        # Classify the comment
        classification_result = classify_comment(text)

        # Set flagged based on classification
        validated_data["flagged"] = classification_result["flagged"]

        # Create and return the comment
        comment = Comment.objects.create(**validated_data)

        return comment


class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model with nested comments"""

    comments = CommentSerializer(many=True, read_only=True)
    comment_count = serializers.SerializerMethodField()
    flagged_comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "body",
            "created_at",
            "updated_at",
            "comments",
            "comment_count",
            "flagged_comment_count",
        ]

    def get_comment_count(self, obj):
        """Total number of comments on this post"""
        return obj.comments.count()

    def get_flagged_comment_count(self, obj):
        """Number of flagged comments on this post"""
        return obj.comments.filter(flagged=True).count()


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for post list (without comments)"""

    comment_count = serializers.SerializerMethodField()
    flagged_comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "body",
            "created_at",
            "comment_count",
            "flagged_comment_count",
        ]

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_flagged_comment_count(self, obj):
        return obj.comments.filter(flagged=True).count()
