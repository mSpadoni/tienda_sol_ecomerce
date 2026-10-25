FROM node:24-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY index.js server.js swagger.yaml ./
COPY config ./config
COPY controller ./controller
COPY errors ./errors
COPY logger ./logger
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY schemas ./schemas
COPY service ./service

EXPOSE 3001
ENTRYPOINT ["node", "index.js"]