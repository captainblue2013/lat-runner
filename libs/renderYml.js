'use strict';
const fs = require('fs');
function dockerCompose(service,image){
    let tpl = `version: '2'
services:
  ${service}:
    image: ${image}
    stdin_open: true
    tty: true
`;
    return tpl;
}

function rancherCompose(service){
    let tpl =`version: '2'
services:
  ${service}:
    scale: 1
    start_on_create: true
`;
    return tpl;
}

module.exports = (service, image)=>{
    fs.writeFileSync(process.cwd()+'/docker-compose.yml',dockerCompose(service,image));
    fs.writeFileSync(process.cwd()+'/rancher-compose.yml',rancherCompose(service));
};