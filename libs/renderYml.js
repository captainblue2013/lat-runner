'use strict';
const fs = require('fs');
function dockerCompose(service,image){
    let tpl = `version: '2'
services:
  ${service}:
    mem_limit: 104857600
    image: ${image}
    stdin_open: true
    tty: true
`;
    return tpl;
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

module.exports = (service, image, path)=>{
    fs.writeFileSync(process.cwd()+'/docker-compose.yml',dockerCompose(service,image));
    fs.writeFileSync(process.cwd()+'/rancher-compose.yml',rancherCompose(service,path));
};