FROM node:8-alpine
COPY package*.json /
RUN npm install
COPY app.js /
EXPOSE 8080
CMD ["node", "app.js"]
