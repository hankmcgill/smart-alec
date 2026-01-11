# Smart Comments App

A production-ready full-stack application demonstrating AI-powered comment moderation using Django, React, and automated classification.

## Features

- 📝 Blog post management
- 💬 Comment system with real-time moderation
- 🤖 AI-powered content classification
- 🚦 Automatic flagging of comments needing review
- 👮 Moderator dashboard for review queue
- 🐳 Fully Dockerized development and deployment
- ✅ CI/CD with GitHub Actions

## Tech Stack

### Backend
- Django 5.0+ with Django REST Framework
- PostgreSQL (production) / SQLite (development)
- Text classification service (rule-based + optional ML)

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- Modern hooks-based architecture

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Running with Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-comments

# Start all services
docker-compose up --build

# In a new terminal, run migrations
docker-compose exec backend python manage.py migrate

# Create a superuser (optional)
docker-compose exec backend python manage.py createsuperuser

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
# Django Admin: http://localhost:8000/admin
```

### Local Development (Without Docker)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Architecture & Design Choices

### Backend Architecture

**Models:**
- `Post`: Represents blog posts with title and body
- `Comment`: Contains text, author, timestamps, and moderation status

**API Design:**
- RESTful endpoints using Django REST Framework
- Pagination for scalability
- Filtering and ordering capabilities

**Classification Service:**
- Modular design allows easy swapping of classification strategies
- Current implementation: rule-based keyword matching
- Future: Integration with Hugging Face models or OpenAI API

### Frontend Architecture

**Component Structure:**
- Feature-based organization
- Reusable UI components
- Type-safe with TypeScript
- State management with React hooks

**Key Features:**
- Real-time comment submission
- Visual indicators for flagged content
- Moderator-specific views with filtering

### AI Integration Approach

**Current Implementation:**
The classification component uses a rule-based approach:
- Keyword matching for offensive language
- Spam pattern detection
- Length and character analysis

**Design for Extensibility:**
```python
class ClassificationService:
    def classify_comment(self, text: str) -> dict:
        # Easily swappable implementation
        pass
```

**Future Enhancements:**
- Hugging Face sentiment analysis models
- OpenAI moderation API integration
- Custom fine-tuned models for domain-specific content
- Confidence scores and multi-label classification

## Scaling Considerations

### Performance
- Database indexing on frequently queried fields
- API response caching with Redis
- Pagination to limit query sizes
- Async classification processing with Celery

### Infrastructure
- Horizontal scaling with load balancers
- Separate classification microservice
- CDN for static assets
- Database read replicas for high traffic

### Monitoring
- Application metrics with Prometheus
- Error tracking with Sentry
- Logging aggregation with ELK stack
- Real-time alerts for classification failures

## Testing Strategy

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
- API contract testing
- End-to-end flows with Cypress (planned)

## CI/CD Pipeline

GitHub Actions workflows automatically:
- Run linting and type checking
- Execute test suites
- Build Docker images
- Validate migrations
- Generate coverage reports

## Deployment

### Production Deployment Options

**Option 1: Docker-based platforms (Render, Railway, Fly.io)**
```bash
# Both frontend and backend containerized
docker-compose -f docker-compose.prod.yml up
```

**Option 2: Traditional hosting**
- Backend: Gunicorn + Nginx
- Frontend: Static build served via CDN
- Database: Managed PostgreSQL

### Environment Variables

**Backend:**
- `DJANGO_SECRET_KEY`: Secret key for Django
- `DATABASE_URL`: PostgreSQL connection string
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS`: Frontend URL for CORS

**Frontend:**
- `REACT_APP_API_URL`: Backend API endpoint

## Future Improvements

Given more time, I would implement:

1. **Enhanced AI Classification**
   - Integration with multiple ML models
   - A/B testing different classification strategies
   - User feedback loop to improve accuracy

2. **Advanced Moderation**
   - Bulk moderation actions
   - Moderation history and audit logs
   - Appeal system for false positives

3. **Performance Optimizations**
   - WebSocket for real-time updates
   - Optimistic UI updates
   - Service worker for offline support

4. **User Experience**
   - Rich text editor for comments
   - User reputation system
   - Email notifications for moderators

5. **Security Enhancements**
   - Rate limiting per user
   - CAPTCHA for anonymous users
   - Content Security Policy headers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.
