# Create your tests here.
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from .classification import classify_comment
from .models import Comment, Post


class ClassificationTestCase(TestCase):
    """Tests for the AI classification service"""

    def test_safe_comment(self):
        """Test that safe comments are classified correctly"""
        result = classify_comment("This is a great article! Very informative.")
        self.assertEqual(result["classification"], "safe")
        self.assertFalse(result["flagged"])

    def test_spam_comment_with_url(self):
        """Test that comments with spam URLs are flagged"""
        result = classify_comment("CLICK HERE http://bit.ly/spam for deals!")
        self.assertEqual(result["classification"], "needs_review")
        self.assertTrue(result["flagged"])

    def test_offensive_keyword(self):
        """Test that offensive keywords trigger flagging"""
        result = classify_comment("This is spam and stupid")
        self.assertEqual(result["classification"], "needs_review")
        self.assertTrue(result["flagged"])

    def test_excessive_caps(self):
        """Test that excessive caps are flagged"""
        result = classify_comment("AMAZING DEALS HERE NOW!!!")
        self.assertEqual(result["classification"], "needs_review")
        self.assertTrue(result["flagged"])

    def test_short_comment(self):
        """Test that very short comments are flagged"""
        result = classify_comment("ok")
        self.assertEqual(result["classification"], "needs_review")
        self.assertTrue(result["flagged"])

    def test_normal_length_comment(self):
        """Test that normal comments pass through"""
        result = classify_comment(
            "I really enjoyed reading this post. Thank you for sharing!"
        )
        self.assertEqual(result["classification"], "safe")
        self.assertFalse(result["flagged"])


class PostModelTestCase(TestCase):
    """Tests for Post model"""

    def setUp(self):
        self.post = Post.objects.create(
            title="Test Post", body="This is a test post body."
        )

    def test_post_creation(self):
        """Test that posts are created correctly"""
        self.assertEqual(self.post.title, "Test Post")
        self.assertEqual(self.post.body, "This is a test post body.")
        self.assertIsNotNone(self.post.created_at)

    def test_post_str(self):
        """Test post string representation"""
        self.assertEqual(str(self.post), "Test Post")


class CommentModelTestCase(TestCase):
    """Tests for Comment model"""

    def setUp(self):
        self.post = Post.objects.create(title="Test Post", body="Test body")
        self.comment = Comment.objects.create(
            post=self.post, author="Test Author", text="Test comment", flagged=False
        )

    def test_comment_creation(self):
        """Test that comments are created correctly"""
        self.assertEqual(self.comment.author, "Test Author")
        self.assertEqual(self.comment.text, "Test comment")
        self.assertFalse(self.comment.flagged)
        self.assertEqual(self.comment.post, self.post)

    def test_comment_str(self):
        """Test comment string representation"""
        expected = f"Comment by Test Author on {self.post.title}"
        self.assertEqual(str(self.comment), expected)


class PostAPITestCase(APITestCase):
    """Tests for Post API endpoints"""

    def setUp(self):
        self.post = Post.objects.create(title="API Test Post", body="API test body")

    def test_list_posts(self):
        """Test listing all posts"""
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_retrieve_post(self):
        """Test retrieving a specific post"""
        response = self.client.get(f"/api/posts/{self.post.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "API Test Post")

    def test_create_post(self):
        """Test creating a new post"""
        data = {"title": "New Post", "body": "New post body"}
        response = self.client.post("/api/posts/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)


class CommentAPITestCase(APITestCase):
    """Tests for Comment API endpoints"""

    def setUp(self):
        self.post = Post.objects.create(title="Test Post", body="Test body")

    def test_create_safe_comment(self):
        """Test creating a safe comment via API"""
        data = {
            "post": self.post.id,
            "author": "John Doe",
            "text": "This is a great article! Very helpful.",
        }
        response = self.client.post("/api/comments/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["flagged"])

    def test_create_flagged_comment(self):
        """Test that spam comments are auto-flagged"""
        data = {
            "post": self.post.id,
            "author": "Spammer",
            "text": "CLICK HERE http://bit.ly/scam for deals!!!",
        }
        response = self.client.post("/api/comments/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["flagged"])

    def test_list_comments(self):
        """Test listing all comments"""
        Comment.objects.create(
            post=self.post, author="Test", text="Test comment", flagged=False
        )
        response = self.client.get("/api/comments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_filter_flagged_comments(self):
        """Test filtering for flagged comments only"""
        Comment.objects.create(
            post=self.post, author="Safe User", text="Nice post!", flagged=False
        )
        Comment.objects.create(
            post=self.post, author="Spammer", text="spam content", flagged=True
        )
        response = self.client.get("/api/comments/flagged/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only return flagged comments
        flagged_count = len([c for c in response.data if c.get("flagged", False)])
        self.assertGreater(flagged_count, 0)
