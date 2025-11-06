FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate

FROM dependencies AS final
WORKDIR /usr/src/app


COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/prisma/ ./prisma/

COPY . . 

EXPOSE 3000

CMD ["npm", "run", "start:dev"]