up:
	docker-compose up -d

down:
	docker-compose kill
	docker-compose rm -f
	rm -f tmp/pids/server.pid

shell:
	docker-compose run --rm app sh

bundle_install:
	docker-compose run --rm --user root app sh -c "bundle install"

logs:
	docker-compose logs -f app

lint: rubocop reek

rubocop:
	docker-compose run --rm app sh -c "bundle exec rubocop"

reek:
	docker-compose run --rm app sh -c "bundle exec rubocop"

app_up:
	docker-compose up -d app

app_down:
	docker-compose kill app

postgres_up:
	docker-compose up -d postgres

postgres_down:
	docker-compose kill postgres
