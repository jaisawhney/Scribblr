FROM node:16-alpine

ADD . /app

WORKDIR /app

RUN npm install

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "."]