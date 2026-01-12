# Smart Comments

Full-stack blog application with AI-powered comment moderation. Built with Django REST Framework and React TypeScript.

## Features

- Blog posts with comments
- Automatic comment classification (safe vs. needs review)
- Visual flagging of problematic content
- Moderator dashboard for reviewing flagged comments
- REST API with pagination
- Docker support

## Tech Stack

**Backend:** Django 5.0, Django REST Framework, SQLite/PostgreSQL  
**Frontend:** React 18, TypeScript, Tailwind CSS, Axios  
**DevOps:** Docker, GitHub Actions, Gunicorn

## Quick Start

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data  # Optional: adds sample posts
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Visit http://localhost:3000

### Docker

```bash
docker-compose up --build
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

## API Endpoints

- `GET /api/posts/` - List all posts
- `GET /api/posts/{id}/` - Get post with comments
- `POST /api/comments/` - Create comment (auto-classified)
- `GET /api/comments/flagged/` - Get flagged comments
- `GET /health/` - Health check

## Project Structure

```
backend/
  ├── blog/               # Main app
  │   ├── classification.py  # AI classification logic
  │   ├── models.py       # Post & Comment models
  │   └── views.py        # API endpoints
  └── smart_comments/     # Django settings

frontend/
  ├── src/
  │   ├── components/     # React components
  │   └── services/       # API client
  └── package.json
```

## Classification System

Current implementation uses rule-based classification:
- Keyword matching (spam, offensive terms)
- Pattern detection (shortened URLs, excessive caps)
- Character analysis (length, punctuation ratio)

The architecture supports easy integration with ML models (Hugging Face, OpenAI) - see `backend/blog/classification.py`.

## Testing AI Classification

**Safe comments:**
- "Great article! Very informative."

**Flagged comments:**
- "CLICK HERE!!! http://bit.ly/scam"
- Comments with offensive keywords

## Environment Variables

**Backend** (see `backend/.env.example`):
```bash
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend** (see `frontend/.env.example`):
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions covering Render, Railway, Fly.io, and Docker.

Quick checklist:
- Set `DEBUG=False`
- Generate secure `DJANGO_SECRET_KEY`
- Configure PostgreSQL
- Update CORS and ALLOWED_HOSTS
- Run `collectstatic` and migrations

## Development Commands

```bash
# Seed sample data
python manage.py seed_data

# Run tests
python manage.py test      # Backend
npm test                   # Frontend

# Linting
flake8 .                   # Backend
npm run lint               # Frontend
```

## License

MIT