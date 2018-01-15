'use strict';
const fs = require('fs');

function dockerCompose(service,image,data={}){
    
    let tpl = `version: '2'
services:
  ${service}:
    mem_limit: 104857600
    image: ${image}
    environment:${envList(data)}
    stdin_open: true
    tty: true
`;
    return tpl;
}

function envList(data){
    let result = ``;
    let tpl = `
      {1}: {2}`;
    for(let k in data){
        result += tpl.replace('{1}',k).replace('{2}',process.env[k]||'')
    }
    return result;
}

function rancherCompose(service,path){
    let tpl =`version: '2'
services:
  ${service}:
    scale: 1
    start_on_create: true
`;
    return tpl;
}

module.exports = (service, image, path, envData={})=>{
    fs.writeFileSync(process.cwd()+'/docker-compose.yml',dockerCompose(service,image,envData));
    fs.writeFileSync(process.cwd()+'/rancher-compose.yml',rancherCompose(service,path));
};