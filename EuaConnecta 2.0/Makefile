# EuaConnecta 2.0 - Development Makefile
# =================================================================
# This Makefile provides common development tasks for the EuaConnecta 2.0 project

.PHONY: help install dev build start test lint format clean docker-up docker-down db-migrate db-seed

# Default target
help: ## Show this help message
	@echo "EuaConnecta 2.0 - Development Commands"
	@echo "======================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	npm install

install-prod: ## Install production dependencies only
	npm ci --only=production

# Development
dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start

# Database
db-generate: ## Generate Prisma client
	npx prisma generate

db-push: ## Push schema changes to database
	npx prisma db push

db-migrate: ## Create and run database migration
	npx prisma migrate dev

db-seed: ## Seed database with initial data
	npx prisma db seed

db-studio: ## Open Prisma Studio
	npx prisma studio

db-reset: ## Reset database (WARNING: This will delete all data)
	npx prisma migrate reset --force

# Testing
test: ## Run all tests
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage report
	npm run test:coverage

test-unit: ## Run unit tests only
	npm run test -- --testPathPattern=unit

test-integration: ## Run integration tests only
	npm run test -- --testPathPattern=integration

test-e2e: ## Run end-to-end tests
	npm run test -- --testPathPattern=e2e

# Code Quality
lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npm run lint:fix

format: ## Format code with Prettier
	npx prettier --write .

format-check: ## Check code formatting
	npx prettier --check .

type-check: ## Run TypeScript type checking
	npm run type-check

# Docker
docker-build: ## Build Docker image
	docker build -t euaconecta-2.0 .

docker-run: ## Run Docker container
	docker run -p 3000:3000 euaconecta-2.0

docker-up: ## Start all Docker services
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## Show Docker logs
	docker-compose logs -f

docker-clean: ## Remove all Docker containers and volumes
	docker-compose down -v --remove-orphans
	docker system prune -f

# Deployment
deploy-dev: ## Deploy to development environment
	@echo "Deploying to development..."
	# Add your deployment commands here

deploy-staging: ## Deploy to staging environment
	@echo "Deploying to staging..."
	# Add your deployment commands here

deploy-prod: ## Deploy to production environment
	@echo "Deploying to production..."
	# Add your deployment commands here

# Maintenance
clean: ## Clean build artifacts and caches
	rm -rf .next
	rm -rf out
	rm -rf build
	rm -rf dist
	rm -rf coverage
	rm -rf .nyc_output
	rm -rf node_modules/.cache
	rm -rf .swc
	npm run clean

clean-all: clean ## Clean everything including node_modules
	rm -rf node_modules
	rm -rf package-lock.json

# Health checks
health: ## Check application health
	curl -f http://localhost:3000/api/health || echo "Application is not healthy"

health-db: ## Check database connection
	npx prisma db execute --file scripts/health-check.sql || echo "Database connection failed"

# Logs
logs: ## Show application logs
	tail -f logs/app.log

logs-error: ## Show error logs only
	tail -f logs/error.log

# Git hooks
install-hooks: ## Install git hooks
	npx husky install

# Security
audit: ## Run security audit
	npm audit

audit-fix: ## Fix security vulnerabilities
	npm audit fix

# Performance
analyze: ## Analyze bundle size
	npm run build
	npx @next/bundle-analyzer

# Documentation
docs-build: ## Build documentation
	@echo "Building documentation..."
	# Add documentation build commands here

docs-serve: ## Serve documentation locally
	@echo "Serving documentation..."
	# Add documentation serve commands here

# Backup
backup-db: ## Backup database
	@echo "Backing up database..."
	# Add database backup commands here

backup-files: ## Backup uploaded files
	@echo "Backing up files..."
	# Add file backup commands here

# Monitoring
monitor: ## Start monitoring dashboard
	@echo "Starting monitoring..."
	# Add monitoring commands here

# Development shortcuts
setup: install db-generate db-push db-seed ## Complete development setup
reset: clean install setup ## Reset development environment
update: ## Update all dependencies
	npm update
	npm audit fix

# CI/CD
ci: lint type-check test ## Run CI checks
cd: build docker-build ## Run CD pipeline