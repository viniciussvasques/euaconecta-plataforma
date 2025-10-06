# EuaConecta Platform - GitHub Copilot Instructions

**ALWAYS FOLLOW THESE INSTRUCTIONS FIRST. Only search or gather additional context if these instructions are incomplete or found to be in error.**

## Quick Start (TL;DR)
For immediate productivity on this codebase:
1. `npm install` (45 sec) → `cp .env.example .env` → `npm run dev` (2 sec startup)
2. App serves on http://localhost:3000 - landing page, login (/auth/login), register (/auth/register) all work
3. For database features: Docker setup or local PostgreSQL required
4. Lint errors (69 total) are EXPECTED - mostly CommonJS in scripts, not blocking
5. Build fails without internet (Google Fonts + Prisma engines) - dev server works fine
6. Test files have syntax errors - database testing requires setup first

## Project Overview
EuaConecta is a Next.js 15 full-stack package forwarding platform that enables Brazilian customers to purchase products from US stores and consolidate shipments. The platform includes authentication, payment processing (Stripe/PayPal), package tracking, and shipping management.

## Working Effectively

### Initial Setup
**Prerequisites:**
- Node.js 20+ (verified working with v20.19.5)
- Docker Desktop
- PostgreSQL 15+ (for local development without Docker)
- npm 10+ (verified working with v10.8.2)

### Bootstrap the Repository
Run these commands in exact sequence after cloning:

```bash
# 1. Install dependencies - NEVER CANCEL: Takes 45 seconds
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server - NEVER CANCEL: Takes 2 seconds to start
npm run dev
```

**CRITICAL NETWORK LIMITATIONS:**
- Build process requires internet access for Google Fonts (Geist, Geist Mono)
- Prisma engine download requires internet access to binaries.prisma.sh
- In restricted environments, builds will fail with font/prisma engine errors
- Development server works fine without external access once dependencies are installed

### Build Process
**WARNING - EXTERNAL DEPENDENCIES REQUIRED:**
```bash
# Production build - NEVER CANCEL: Takes 15-20 seconds when fonts are accessible
npm run build

# Development build with turbopack (faster)
npm run build
```
**Build failures are EXPECTED in environments blocking:**
- fonts.googleapis.com (Google Fonts)
- binaries.prisma.sh (Prisma engines)

### Database Setup

#### Option 1: Docker (Recommended)
```bash
# Start all services - NEVER CANCEL: Takes 2-3 minutes
docker-compose -f docker/docker-compose.yml up -d

# Wait for services to be healthy, then run migrations
docker exec -it euaconecta-platform npx prisma migrate deploy
docker exec -it euaconecta-platform npx prisma generate
docker exec -it euaconecta-platform npx prisma db seed
```

#### Option 2: Local Database
```bash
# Generate Prisma client - REQUIRES INTERNET ACCESS
npx prisma generate

# Run migrations - REQUIRES DATABASE_URL in .env
npx prisma migrate dev

# Seed initial data
npx prisma db seed
```

### Setup Scripts (Run After Database)
**These scripts require a working database connection:**

```bash
# Configure default system settings - Takes 10-15 seconds
node scripts/setup/setup-default-config.js

# Setup ABC carrier pricing - Takes 5-10 seconds  
node scripts/setup/setup-abc-pricing-table.js

# Configure major carriers - Takes 15-20 seconds
node scripts/setup/setup-major-carriers.js

# Setup payment providers - Takes 5 seconds
node scripts/setup/setup-payment-providers.js

# Create email templates - Takes 10 seconds
node scripts/setup/seed-email-templates.js
```

### Validation and Testing

#### Linting
```bash
# EXPECTED: 69 problems (41 errors, 28 warnings) - mostly CommonJS require() issues in scripts
npm run lint
```
**Known Issues:**
- Scripts use `require()` which conflicts with ESLint TypeScript rules
- These are NOT blocking issues for functionality

#### Testing
```bash
# Jest tests - CURRENTLY BROKEN: Syntax errors in test files
npm test

# Test specific files
npx jest src/lib/__tests__/platform-config.test.ts
```
**Known Issues:**
- Test suite has syntax errors (await in non-async functions)
- Tests require database setup to run properly

#### Manual Validation Scenarios
**ALWAYS perform these validation steps after making changes:**

1. **Landing Page Test:**
   ```bash
   npm run dev
   curl http://localhost:3000  # Should return HTML with EuaConecta branding
   ```

2. **Authentication Pages Test:**
   ```bash
   curl http://localhost:3000/auth/login    # Should return login form HTML
   curl http://localhost:3000/auth/register # Should return registration form
   ```

3. **API Health Check:**
   ```bash
   curl http://localhost:3000/api/health    # Should return JSON health status
   ```

4. **Database Connection Test:**
   ```bash
   # Should open Prisma Studio web interface (requires working database)
   npx prisma studio
   ```

5. **Complete User Flow Test:**
   - Visit `/auth/register` in browser
   - Create test account with valid email
   - Login at `/auth/login` with created credentials
   - Access dashboard at `/dashboard`
   - Test package creation workflow

6. **Admin Panel Test (After Database Setup):**
   - Login with admin credentials: admin@euaconecta.com / admin123
   - Access `/admin` 
   - Verify carrier configuration is loaded
   - Test shipment management interface
   - Check platform configuration settings

### Development Workflow

#### Code Quality
```bash
# Format code before committing
npm run format  # NOTE: Command may not exist, check package.json

# Always run linting (ignore known CommonJS warnings in scripts)
npm run lint
```

### Additional Testing Scripts
**Located in `/scripts/test/` directory:**

```bash
# API endpoint testing suite
node scripts/test/run-api-tests.js

# Email service testing  
node scripts/test/test-email.js

# Image upload testing (requires MinIO)
node scripts/test/test-image-upload.js

# User registration testing
node scripts/test/test-register.js

# MinIO S3 upload testing
node scripts/test/minio-upload-test.js
```

**Note:** These scripts require a running application and proper database/service connections.

#### Docker Development
```bash
# Start services
npm run docker:up

# View logs  
npm run docker:logs

# Stop services
npm run docker:down
```

### Common Issues and Solutions

#### Build Failures
- **Google Fonts Error:** Expected in restricted environments, development server still works
- **Prisma Engine Download:** Expected in restricted environments, use pre-installed engines
- **Turbopack Warnings:** Safe to ignore font download warnings

#### Database Issues  
- **Connection Refused:** Ensure Docker services are running or local PostgreSQL is started
- **Migration Failures:** Check DATABASE_URL format in .env file
- **Seed Script Errors:** Run database migrations first

#### Development Server Issues
- **Port 3000 in use:** Change port with `npm run dev -- -p 3001`
- **Font Loading Errors:** Safe to ignore in development, fonts will fallback

## Codebase Navigation

### Key Directories
- `/src/app/` - Next.js App Router pages and API routes
- `/src/components/` - Reusable React components  
- `/src/lib/` - Utility functions and services
- `/prisma/` - Database schema and migrations
- `/scripts/` - Setup and utility scripts
- `/docker/` - Docker configuration files
- `/data/` - Static JSON data files

### Important Files
- `package.json` - Dependencies and scripts
- `docker-compose.yml` - Full stack Docker setup
- `prisma/schema.prisma` - Database schema
- `.env.example` - Environment variables template
- `src/app/layout.tsx` - Root application layout (contains font configuration)

### Database Schema
Main entities: User, Customer, Shipment, Package, Carrier, PlatformConfig, Tutorial, BlogPost, Partners

### API Routes
- `/api/auth/*` - NextAuth authentication
- `/api/admin/*` - Admin management endpoints  
- `/api/customer/*` - Customer portal endpoints
- `/api/shipment/*` - Package and shipping management

## Timing Expectations

### Command Durations (NEVER CANCEL these operations)
- `npm install`: 45 seconds - 1 minute
- `npm run dev`: 2 seconds startup time  
- `npm run build`: 15-20 seconds (when external access works)
- `npm run lint`: 10-15 seconds
- `docker-compose up`: 2-3 minutes for full stack
- Database migrations: 30-60 seconds
- Setup scripts: 5-20 seconds each

### Validation Time Budget
- Manual testing: 5-10 minutes per change
- Full setup from scratch: 15-20 minutes
- Database setup and seeding: 5-10 minutes

**CRITICAL:** Always use timeout values of 120+ seconds for build commands and 300+ seconds for Docker operations.

## Deployment Notes
- Production deployment via Vercel (app)
- Database hosting on Railway/Neon (PostgreSQL)
- File storage via AWS S3/MinIO
- SSL via Cloudflare

## Test Users (After Database Seeding)
- Admin: `admin@euaconecta.com` / `admin123`  
- Customer: `cliente@teste.com` / `cliente123`

**Remember: Always validate your changes by running the application and testing complete user scenarios, not just unit tests.**