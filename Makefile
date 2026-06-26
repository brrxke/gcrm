.PHONY: dev build test lint clean deploy

dev:
	docker compose up -d

dev-build:
	docker compose up -d --build

prod:
	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d

prod-build:
	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --build

test:
	python -m pytest tests/ -v

lint:
	flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

clean:
	docker compose down -v
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true

logs:
	docker compose logs -f

backup:
	docker exec gym-crm-mongodb mongodump --uri="$$MONGODB_URI" --out=/data/db/backup_$$(date +%Y%m%d_%H%M%S)

mongo-shell:
	docker exec -it gym-crm-mongodb mongosh
