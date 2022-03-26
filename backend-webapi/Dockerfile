FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3027

ENV APPPORT=3027
ENV TYPE='postgres'
ENV PORT=5432
ENV DB_USERNAME='postgres'
ENV DB_PASSWORD='simple_pass'
ENV DATABASE='nestjs-webapi-db'
ENV HOST='full_stack_dabase_pg'

CMD ["npm","run", "start:debug"]
