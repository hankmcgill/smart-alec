from django.core.management.base import BaseCommand

from blog.classification import classify_comment
from blog.models import Comment, Post


class Command(BaseCommand):
    help = "Seeds the database with sample posts and comments"

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing existing data...")
        Comment.objects.all().delete()
        Post.objects.all().delete()

        self.stdout.write("Creating sample posts...")

        # Post 1: Technology
        post1 = Post.objects.create(
            title="The Future of AI in Web Development",
            body="""Artificial Intelligence is revolutionizing how we build web applications. 
            From automated testing to intelligent code completion, AI tools are making developers 
            more productive than ever. What are your thoughts on AI-assisted development?""",
        )

        # Post 2: Programming
        post2 = Post.objects.create(
            title="Django vs FastAPI: Which Should You Choose?",
            body="""Both Django and FastAPI are excellent Python frameworks, but they serve 
            different purposes. Django is a full-featured framework with batteries included, 
            while FastAPI is modern, fast, and perfect for APIs. Let's discuss the pros and cons.""",
        )

        # Post 3: Career
        post3 = Post.objects.create(
            title="Tips for Your First Developer Job Interview",
            body="""Landing your first developer job can be challenging. Here are some tips: 
            practice coding problems, understand the fundamentals, build a portfolio, and don't 
            forget the importance of communication skills. What helped you in your interviews?""",
        )

        self.stdout.write("Creating sample comments...")

        # Safe comments for Post 1
        comments_post1_safe = [
            {
                "author": "Alice",
                "text": "Great article! I've been using GitHub Copilot and it's amazing how much time it saves.",
            },
            {
                "author": "Bob",
                "text": "AI is definitely the future. I'm excited to see where this technology goes in the next few years.",
            },
            {
                "author": "Carol",
                "text": "Has anyone tried using ChatGPT for code reviews? I'm curious about the results.",
            },
        ]

        # Flagged comments for Post 1
        comments_post1_flagged = [
            {
                "author": "Spammer1",
                "text": "CLICK HERE for amazing deals on crypto!!! LIMITED OFFER visit http://bit.ly/scam123",
            },
            {
                "author": "TrollUser",
                "text": "This is stupid and you're all idiots for believing this spam nonsense.",
            },
        ]

        # Safe comments for Post 2
        comments_post2_safe = [
            {
                "author": "David",
                "text": "I prefer Django for full-stack applications because of its admin panel and ORM.",
            },
            {
                "author": "Emma",
                "text": "FastAPI is incredible for microservices. The automatic OpenAPI documentation is a game changer.",
            },
            {
                "author": "Frank",
                "text": "Why not both? I use Django for the main app and FastAPI for specific high-performance endpoints.",
            },
        ]

        # Flagged comment for Post 2
        comments_post2_flagged = [
            {
                "author": "AngryDev",
                "text": "Both frameworks are terrible! You're all damn fools for using Python anyway!!!!!!",
            },
        ]

        # Safe comments for Post 3
        comments_post3_safe = [
            {
                "author": "Grace",
                "text": "Practicing LeetCode problems really helped me prepare for technical interviews.",
            },
            {
                "author": "Henry",
                "text": "Building side projects was key for me. It gave me real experience to talk about.",
            },
            {
                "author": "Iris",
                "text": "Don't underestimate behavioral questions! I recommend the STAR method for answering them.",
            },
            {
                "author": "Jack",
                "text": "Networking is important too. Many jobs come from referrals rather than cold applications.",
            },
        ]

        # Flagged comment for Post 3
        comments_post3_flagged = [
            {
                "author": "ScamBot",
                "text": "Get a job NOW!!! Visit our website https://definitely-not-a-scam.xyz and buy our course!",
            },
        ]

        # Create comments for each post
        for comment_data in comments_post1_safe + comments_post1_flagged:
            result = classify_comment(comment_data["text"])
            Comment.objects.create(
                post=post1,
                author=comment_data["author"],
                text=comment_data["text"],
                flagged=result["flagged"],
            )

        for comment_data in comments_post2_safe + comments_post2_flagged:
            result = classify_comment(comment_data["text"])
            Comment.objects.create(
                post=post2,
                author=comment_data["author"],
                text=comment_data["text"],
                flagged=result["flagged"],
            )

        for comment_data in comments_post3_safe + comments_post3_flagged:
            result = classify_comment(comment_data["text"])
            Comment.objects.create(
                post=post3,
                author=comment_data["author"],
                text=comment_data["text"],
                flagged=result["flagged"],
            )

        # Summary
        total_posts = Post.objects.count()
        total_comments = Comment.objects.count()
        flagged_comments = Comment.objects.filter(flagged=True).count()

        self.stdout.write(self.style.SUCCESS(f"Successfully created:"))
        self.stdout.write(self.style.SUCCESS(f"  - {total_posts} posts"))
        self.stdout.write(
            self.style.SUCCESS(
                f"  - {total_comments} comments ({flagged_comments} flagged)"
            )
        )
