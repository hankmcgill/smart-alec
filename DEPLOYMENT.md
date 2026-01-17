# Deployment Checklist

## Pre-Deployment

### Backend Configuration
- [ ] Set `DEBUG=False` in production environment
- [ ] Generate strong `DJANGO_SECRET_KEY` (use `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- [ ] Update `ALLOWED_HOSTS` with production domain
- [ ] Configure PostgreSQL database (update `DATABASE_URL`)
- [ ] Update `CORS_ALLOWED_ORIGINS` with production frontend URL
- [ ] Set up static file serving (WhiteNoise is already configured)
- [ ] Run `python manage.py collectstatic`
- [ ] Run `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Optionally run `python manage.py seed_data` for demo content

### Frontend Configuration
- [ ] Update `REACT_APP_API_URL` to production backend URL
- [ ] Run `npm run build` to create production build
- [ ] Test production build locally: `npx serve -s build`

### Security
- [ ] Ensure `.env` files are in `.gitignore` and not committed
- [ ] Set up HTTPS/SSL certificates
- [ ] Review Django security settings checklist
- [ ] Enable CSRF protection (already configured)
- [ ] Review CORS settings for production

### Database
- [ ] Backup local SQLite data if needed
- [ ] Set up PostgreSQL database
- [ ] Configure database backups
- [ ] Test database migrations on staging

## Deployment Options

### Option 1: Render.com (Recommended for simplicity)

**Backend:**
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && gunicorn smart_comments.wsgi:application`
5. Add environment variables from `.env.example`
6. Add PostgreSQL database (free tier available)

**Frontend:**
1. Create new Static Site
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL`

### Option 2: Docker Compose (VPS/Self-hosted)

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Create superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

## Environment Variables Reference

### Backend (Django)
```
DJANGO_SECRET_KEY=<generate-secure-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgres://user:pass@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://your-frontend.com
```

### Frontend (React)
```
REACT_APP_API_URL=https://your-backend.com/api
```

## Troubleshooting

### Static files not loading
- Ensure `python manage.py collectstatic` was run
- Check `STATIC_ROOT` and `STATIC_URL` in settings
- Verify WhiteNoise middleware is enabled

### CORS errors
- Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Ensure `corsheaders.middleware.CorsMiddleware` is before `CommonMiddleware`

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check database server is running
- Ensure migrations have been run

### 500 Internal Server Error
- Check application logs
- Verify all environment variables are set
- Ensure `DEBUG=False` for security, but temporarily enable for debugging