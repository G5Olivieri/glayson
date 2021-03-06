FROM node:16-alpine

COPY backend /app/backend
COPY frontend /app/frontend

RUN cd /app \
    && rm -rf frontend/dist backend/dist \
    && cd backend \
    && yarn \
    && yarn build \
    && cd ../frontend \
    && yarn \
    && yarn build \
    && mv dist ../backend/dist/public

FROM node:16-alpine

COPY --from=0 /app/backend /app

ENV NEW_RELIC_NO_CONFIG_FILE=true \
  NEW_RELIC_LOG=stdout

CMD ["node", "/app/dist"]

