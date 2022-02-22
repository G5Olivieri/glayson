FROM ruby:3.1.1-alpine

RUN adduser rails -u 1000 -D

RUN apk add -U build-base git nodejs yarn tzdata libpq-dev

USER rails
