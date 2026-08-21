.PHONY: db-config build-db

db-config:
	@echo "Starting PostgreSQL Docker container..."
	docker compose up -d

build-db: db-config
	@echo "Initializing database schema and seeding..."
	chmod +x scripts/init-db.sh
	./scripts/init-db.sh

clean:
	docker compose down -v
	