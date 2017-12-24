
module.exports = {
    frontend:(project)=>{
        return `FROM nginx:latest
COPY . /usr/share/nginx/html/${project}
        
CMD ["nginx","-g","daemon off;"]
        `;
    }
};