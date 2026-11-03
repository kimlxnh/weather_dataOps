FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm i ci
COPY . .
ENV PORT=5000
CMD ["node", "index.js"]