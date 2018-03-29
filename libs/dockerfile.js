
module.exports = {
  frontend: (project, append) => {
    return `FROM nginx:latest
${append}
COPY . /usr/share/nginx/html/${project}
        
CMD ["nginx","-g","daemon off;"]
        `;
  },
  node: (project) => {
    return `FROM node:8.8.1
COPY . /app
WORKDIR /app
RUN yarn
CMD ["npm", "start"]
    `;
  },
};