"""
Text classification service for comment moderation.

This module provides a modular classification system that can easily
be extended with ML models (Hugging Face, OpenAI, etc.)
"""

import re


class ClassificationService:
    """
    Service for classifying comment text.

    Currently implements rule-based classification, but designed
    to be easily replaced with ML models.
    """

    # Keywords that indicate potentially harmful content
    OFFENSIVE_KEYWORDS = [
        "spam",
        "scam",
        "click here",
        "buy now",
        "limited offer",
        "damn",
        "hate",
        "stupid",
        "idiot",
        "jerk",
    ]

    # Patterns that suggest spam
    SPAM_PATTERNS = [
        r"https?://bit\.ly",  # Shortened URLs
        r"https?://.*\.xyz",  # Suspicious TLDs
        r"\b[A-Z]{5,}\b",  # Excessive caps
        r"(.)\\1{4,}",  # Repeated characters (e.g., 'aaaaa')
    ]

    def classify_comment(self, text: str) -> dict:
        """
        Classify a comment as safe or needs_review.

        Args:
            text: The comment text to classify

        Returns:
            dict with keys:
                - classification: 'safe' or 'needs_review'
                - confidence: float between 0 and 1
                - reasons: list of reasons for the classification
        """
        text_lower = text.lower()
        reasons = []

        # Check for offensive keywords
        offensive_found = [
            word for word in self.OFFENSIVE_KEYWORDS if word in text_lower
        ]
        if offensive_found:
            reasons.append(f"Contains keywords: {', '.join(offensive_found)}")

        # Check for spam patterns
        for pattern in self.SPAM_PATTERNS:
            if re.search(pattern, text):
                reasons.append(f"Matches spam pattern: {pattern}")

        # Check length (very short or very long might be suspicious)
        if len(text.strip()) < 3:
            reasons.append("Comment too short")
        elif len(text) > 1000:
            reasons.append("Comment unusually long")

        # Check for excessive punctuation
        punct_ratio = sum(1 for c in text if c in "!?.,;:") / max(len(text), 1)
        if punct_ratio > 0.2:
            reasons.append("Excessive punctuation")

        # Determine classification
        needs_review = len(reasons) > 0

        return {
            "classification": "needs_review" if needs_review else "safe",
            "confidence": min(len(reasons) * 0.3, 1.0) if needs_review else 0.9,
            "reasons": reasons,
            "flagged": needs_review,
        }


class MLClassificationService(ClassificationService):
    """
    Extended classification service using ML models.

    This is a placeholder showing how to extend the base service
    with actual ML models (Hugging Face, OpenAI, etc.)
    """

    def __init__(self, model_name=None):
        """
        Initialize with optional model.

        Example integration with Hugging Face:

        from transformers import pipeline
        self.classifier = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
        """
        super().__init__()
        self.model_name = model_name
        # self.classifier = None  # Placeholder for ML model

    def classify_comment(self, text: str) -> dict:
        """
        Classify using ML model, fallback to rule-based.

        Future implementation could call:
        - Hugging Face transformers
        - OpenAI Moderation API
        - Custom trained models
        """
        # For now, use rule-based classification
        result = super().classify_comment(text)

        # Future: Add ML model prediction
        # if self.classifier:
        #     ml_result = self.classifier(text)[0]
        #     result['ml_label'] = ml_result['label']
        #     result['ml_score'] = ml_result['score']

        return result


# Singleton instance
_classifier = ClassificationService()


def classify_comment(text: str) -> dict:
    """
    Convenience function to classify a comment.

    Usage:
        from blog.classification import classify_comment
        result = classify_comment("This is a test comment")
        if result['flagged']:
            # Handle flagged comment
    """
    return _classifier.classify_comment(text)
