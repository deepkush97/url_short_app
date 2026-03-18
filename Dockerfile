
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build 


FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production


COPY --from=builder /usr/src/app/dist ./dist




RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app
USER nestjs

EXPOSE 3001
CMD ["node", "dist/main"]