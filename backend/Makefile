install:
	docker-compose run --rm app sh -c 'yarn'
up:
	docker-compose up -d

down:
	docker-compose kill
	docker-compose rm -f

logs:
	docker-compose logs --tail 1000 -f app

shell:
	docker-compose run --rm app sh

build:
	docker-compose build
