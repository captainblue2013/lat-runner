const fs = require('fs');
const EOL = require('os').EOL;
function dockerCompose(){
    return `version: '2'
services:
  proxy:
    image: rancher/lb-service-haproxy:v0.7.9
    ports:
    - 2018:2018/tcp
    - 443:443/tcp
    labels:
      io.rancher.container.agent.role: environmentAdmin
      io.rancher.container.create_agent: 'true'
      `;
}

function pathTpl(excludes=[]){
  let result = ``;
  let tpl = `
      - path: /{1}
        priority: 1
        protocol: {http}
        service: {2}/{3}
        source_port: {port}
        target_port: 80`;
  for(let k in process.projectMap){
    let p = process.projectMap[k];
    if(excludes.includes(p.id)){
      continue;
    }
    if(p.status==1){
      result += tpl
        .replace('{1}',p.name.split('/').pop())
        .replace('{2}',p.name.replace(/\/|_/g,'-').toLowerCase())
        .replace('{3}',p.name.replace(/\/|_/g,'-'));
      if(1*p.https){
        result = result.replace('{http}','https').replace('{port}','443');
      }else{
        result = result.replace('{http}','http').replace('{port}','2018');
      }
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
      default_cert: fcc.lanhao.name
      port_rules:${pathTpl(excludes)}
    health_check:
      response_timeout: 2000
      healthy_threshold: 2
      port: 42
      unhealthy_threshold: 3
      initializing_timeout: 60000
      interval: 2000
      reinitializing_timeout: 60000`;
}



module.exports = (excludes=[])=>{
  fs.writeFileSync(process.cwd()+'/docker-compose.yml',dockerCompose());
  fs.writeFileSync(process.cwd()+'/rancher-compose.yml',rancherCompose(excludes));
}