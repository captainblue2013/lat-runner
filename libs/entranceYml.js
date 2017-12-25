const fs = require('fs');
const EOL = require('os').EOL;
function dockerCompose(){
    return `version: '2'
services:
  proxy:
    image: rancher/lb-service-haproxy:v0.7.9
    ports:
    - 2018:2018/tcp
    labels:
      io.rancher.container.agent.role: environmentAdmin
      io.rancher.container.create_agent: 'true'
      `;
}

function pathTpl(){
  let result = ``;
  let tpl = `
      - path: /{1}
        priority: 1
        protocol: http
        service: {2}/{3}
        source_port: 2018
        target_port: 80`;
  for(let k in process.projectMap){
    let p = process.projectMap[k];
    if(p.status==1){
      result += tpl
        .replace('{1}',p.name.split('/').pop())
        .replace('{2}',p.name.replace(/\/|_/g,'-').toLowerCase())
        .replace('{3}',p.name.replace(/\/|_/g,'-'));
    }else{
      continue;
    }
  }
  return result;
}

function rancherCompose(){
  return `version: '2'
services:
  proxy:
    scale: 1
    start_on_create: true
    lb_config:
      certs: []
      port_rules:${pathTpl()}
    health_check:
      response_timeout: 2000
      healthy_threshold: 2
      port: 42
      unhealthy_threshold: 3
      initializing_timeout: 60000
      interval: 2000
      reinitializing_timeout: 60000`;
}



module.exports = ()=>{
  fs.writeFileSync(process.cwd()+'/docker-compose.yml',dockerCompose());
  fs.writeFileSync(process.cwd()+'/rancher-compose.yml',rancherCompose());
}