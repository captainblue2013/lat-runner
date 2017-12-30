
module.exports = {
  frontend: (project) => {
    return `FROM nginx:latest
COPY . /usr/share/nginx/html/${project}
        
CMD ["nginx","-g","daemon off;"]
        `;
  },
  node: (project) => {
    return `FROM node:8.8.1
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
CMD ["node", "server.js"]
    `;
  }
};