FROM node:21.5-bookworm-slim

WORKDIR /usr/app/webapp/

RUN npm install -g \ 
    npm@10.3.0 \
    serve@14.0.1

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./tsconfig.json

COPY src/ src/

RUN npm run build

COPY ./entrypoint.sh ./entrypoint.sh

EXPOSE 3000 5001 5002

CMD ["node", "./build/server.js", "--trace-deprecation", "--trace-warnings"]
# CMD ["server", "./build/server.js", "-l", "tcp://0.0.0.0:3000"]




