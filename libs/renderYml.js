'use strict';
const fs = require('fs');
function dockerCompose(service,image){
    let tpl = `version: '2'
services:
  ${service}:
    image: ${image}
    stdin_open: true
    tty: true
  proxy:
    image: rancher/lb-service-haproxy:v0.7.9
    ports:
    - 2018:2018/tcp
    labels:
      io.rancher.container.agent.role: environmentAdmin
      io.rancher.container.create_agent: 'true'
`;
    return tpl;
}

function rancherCompose(service,path){
    let tpl =`version: '2'
services:
  ${service}:
    scale: 1
    start_on_create: true
  proxy:
    scale: 1
    start_on_create: true
    lb_config:
      certs: []
      port_rules:
      - path: /${path}
        priority: 1
        protocol: http
        service: ${service.toLowerCase()}/${service}
        source_port: 2018
        target_port: 80
    health_check:
      healthy_threshold: 2
      response_timeout: 2000
      port: 42
      unhealthy_threshold: 3
      initializing_timeout: 60000
      interval: 2000
      reinitializing_timeout: 60000
`;
    return tpl;
}

module.exports = (service, image, path)=>{
    fs.writeFileSync(process.cwd()+'/docker-compose.yml',dockerCompose(service,image));
    fs.writeFileSync(process.cwd()+'/rancher-compose.yml',rancherCompose(service,path));
};