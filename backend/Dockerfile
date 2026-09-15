FROM node:20-alpine

WORKDIR /app

# Install Python and GCC for multi-language execution support in sandbox
RUN apk add --no-cache python3 py3-pip g++ gcc make

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Initialize data dir and seed
RUN mkdir -p data
RUN node src/seed/seed.js

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "src/server.js"]
