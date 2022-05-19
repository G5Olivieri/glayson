install: backend_install frontend_install

backend_install:
	docker-compose run --rm backend sh -c 'yarn'

frontend_install:
	docker-compose run --rm frontend sh -c 'yarn'

up:
	docker-compose up -d

down:
	docker-compose kill
	docker-compose rm -f

logs:
	docker-compose logs --tail 1000 -f frontend backend

shell:
	docker-compose run --rm app sh

build:
	docker-compose build
