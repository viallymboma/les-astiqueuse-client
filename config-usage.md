Usage Commands
Production Build
bash# Build the image
docker-compose build

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
Development Build
bash# Start development container
docker-compose -f docker-compose.dev.yml up

# Stop development container
docker-compose -f docker-compose.dev.yml down
Using Makefile (if you created it)
bash# Production
make build      # Build image
make up         # Start container
make logs       # View logs
make down       # Stop container
make restart    # Restart container
make clean      # Clean everything

# Development
make dev-up     # Start dev container
make dev-down   # Stop dev container
make dev-logs   # View dev logs

# Quick start
make start      # Build and start with logs