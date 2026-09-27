# English Trainer API — Cloud Run image
#
# Build context is the backend/ directory:
#   docker build -t english-trainer-api backend/

FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
# Read-only content (lessons, exercises, vocabulary, reading passages) ships
# with the image. Student data lives in Firestore, not in the container.
COPY data/static ./data/static
USER node
EXPOSE 8080
CMD ["node", "src/server.js"]
