.PHONY: install dev build preview lint test test-watch test-coverage clean help setup

# Default target
help: ## Show this help message
	@echo "Wi-Fi QR Code Generator — Development Commands"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n\nTargets:\n"} \
	  /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm ci

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

preview: ## Preview production build locally
	npm run preview

lint: ## Run ESLint
	npm run lint

test: ## Run tests once
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage report
	npm run test:coverage

clean: ## Remove build artifacts and node_modules
	rm -rf dist node_modules

setup: install ## Alias for install — set up the project from scratch
