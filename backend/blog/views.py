from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Comment, Post
from .serializers import CommentSerializer, PostListSerializer, PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Post model.

    Provides:
    - list: GET /api/posts/
    - retrieve: GET /api/posts/{id}/
    - create: POST /api/posts/
    - update: PUT /api/posts/{id}/
    - partial_update: PATCH /api/posts/{id}/
    - destroy: DELETE /api/posts/{id}/
    """

    queryset = Post.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "body"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        """Use lightweight serializer for list, full for detail"""
        if self.action == "list":
            return PostListSerializer
        return PostSerializer


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Comment model.

    Provides:
    - list: GET /api/comments/
    - retrieve: GET /api/comments/{id}/
    - create: POST /api/comments/
    - update: PUT /api/comments/{id}/
    - destroy: DELETE /api/comments/{id}/

    Can filter by:
    - post: /api/comments/?post=1
    - flagged: /api/comments/?flagged=true
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["post", "flagged"]
    ordering_fields = ["created_at"]
    ordering = ["created_at"]

    @action(detail=False, methods=["get"])
    def flagged(self, request):
        """
        Custom endpoint to get only flagged comments.

        Usage: GET /api/comments/flagged/
        """
        flagged_comments = self.queryset.filter(flagged=True)
        serializer = self.get_serializer(flagged_comments, many=True)
        return Response(serializer.data)
