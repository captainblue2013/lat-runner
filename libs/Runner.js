
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const EOL = require('os').EOL;
const dotenvr = require('dotenvr');
const renderYml = require('../libs/renderYml');
const entranceYml = require('../libs/entranceYml');
const EventModel = require('../definitions/models/Event.gen');
const dockerfile = require('../libs/dockerfile');

class Runner {
  constructor(eventID) {
    this.eventID = eventID;
    this.buildPath = path.resolve(process.env.BUILD_PATH);
  }

  async run() {
    let event = await EventModel.fetchById(this.eventID);
    if (event === null) {
      throw new Error('Event Not Found');
      return;
    }

    //状态设置成进行中
    console.log('Job Start');
    event.status = 1;
    await event.update(true);

    //进入工作目录
    if (!fs.existsSync(`${this.buildPath}/${event.project}/${event.branch}`)) {
      this.makeDir(`${event.project}/${event.branch}`);
    }
    process.chdir(`${this.buildPath}/${event.project}/${event.branch}`);


    shell.exec(`rm -fr *`);
    shell.exec(`rm -fr .*`);

    //克隆git仓库
    if (shell.exec(`git clone ${event.gitRemote} .`).code !== 0) {
      //状态设置成失败
      await this.error(event, 'Git Clone Failed:' + `git clone ${event.gitRemote}`);
      return;
    }

    //切糕指定分支
    if (shell.exec(`git checkout ${event.branch}`).code !== 0) {
      //状态设置成失败
      await this.error(event, 'Git Checkout Failed:' + event.branch);
      return;
    }

    //切糕指定提交
    if (shell.exec(`git checkout ${event.hash}`).code !== 0) {
      //状态设置成失败
      await this.error(event, 'Git Checkout Failed:' + event.hash);
      return;
    }

    let projectPackage;
    if (fs.existsSync(`${process.cwd()}/package.json`)) {
      projectPackage = require(`${process.cwd()}/package.json`);
    }
    //判断项目类型
    if (projectPackage.fcc && projectPackage.fcc.type) {
      switch (projectPackage.fcc.type) {
        case 'react':

          process.env.PUBLIC_URL = projectPackage.fcc.publicUrl;
          if (shell.exec('npm --registry https://registry.npm.taobao.org').code !== 0) {
            await this.error(event, 'react npm failed');
            return;
          }
          
          if (shell.exec('npm run build').code !== 0) {
            await this.error(event, 'react build failed');
            return;
          }
          
          process.chdir(`${process.cwd()}/build`)

          if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
            //默认的静态项目 Dockerfile
            fs.writeFileSync(process.cwd() + '/Dockerfile', dockerfile.frontend(event.project.split('/').pop()))
          }
          break;
        case 'html':
          if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
            //默认的静态项目 Dockerfile
            fs.writeFileSync(process.cwd() + '/Dockerfile', dockerfile.frontend(event.project.split('/').pop()))
          }
          break;
        case 'vue':
          //vue 项目 
          if (shell.exec('npm --registry https://registry.npm.taobao.org').code !== 0) {
            await this.error(event, 'vue npm failed');
            return;
          }
          if (shell.exec('npm run build').code !== 0) {
            await this.error(event, 'vue build failed');
            return;
          }
          if (shell.exec(`sed 's/\/static/static/g' ${`${process.cwd()}/dist/index.html`}`).code !== 0) {
            await this.error(event, 'vue replace path');
            return;
          }
          process.chdir(`${process.cwd()}/dist`);
          if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
            //默认的静态项目 Dockerfile
            fs.writeFileSync(process.cwd() + '/Dockerfile', dockerfile.frontend(event.project.split('/').pop()))
          }
          break;
        case 'node':
          //检查script
          let pkg = require(`${process.cwd()}/package.json`);
          if (!pkg.scripts) {
            await this.error(event, 'package.json 缺少 scripts');
            return;
          }
          if (!pkg.scripts.test) {
            await this.error(event, 'package.json 缺少 npm run test 命令');
            return;
          }
          if (!pkg.scripts.start) {
            await this.error(event, 'package.json 缺少 npm start 命令');
            return;
          }
          if (shell.exec('npm --registry https://registry.npm.taobao.org').code !== 0) {
            //状态设置成失败
            await this.error(event, 'npm install Failed');
            return;
          }
          //执行测试脚本
          if (shell.exec(`npm run test`).code !== 0) {
            //状态设置成失败
            await this.error(event, 'npm run test Failed');
            return;
          }
          if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
            //默认的静态项目 Dockerfile
            fs.writeFileSync(`${process.cwd()}/Dockerfile`, dockerfile.node(event.project.split('/').pop()))
          }
          if (!fs.existsSync(`${process.cwd()}/.dockerignore`)) {
            fs.writeFileSync(`${process.cwd()}/.dockerignore`, `node_modules${EOL}.git`)
          }
          break;
      }
    } else {
      if (fs.existsSync(`${process.cwd()}/index.html`) || fs.existsSync(`${process.cwd()}/index.htm`)) {
        //理解为静态项目
        if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
          //默认的静态项目 Dockerfile
          fs.writeFileSync(process.cwd() + '/Dockerfile', dockerfile.frontend(event.project.split('/').pop()))
        }
      } else if (fs.existsSync(`${process.cwd()}/build`)) {
        //react 项目
        if (shell.exec('npm --registry https://registry.npm.taobao.org').code !== 0) {
          await this.error(event, 'react npm install failed');
          return;
        }
        process.env.PUBLIC_URL = `http://fcc.lanhao.name/${event.project.split('/').pop()}`;
        if (shell.exec('npm run build').code !== 0) {
          await this.error(event, 'react build failed');
          return;
        }

        process.chdir(`${process.cwd()}/build`)

        if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
          //默认的静态项目 Dockerfile
          fs.writeFileSync(process.cwd() + '/Dockerfile', dockerfile.frontend(event.project.split('/').pop()))
        }
      } else if (fs.existsSync(`${process.cwd()}/dist`)) {
        //vue 项目
        if (shell.exec('npm --registry https://registry.npm.taobao.org').code !== 0) {
          await this.error(event, 'vue npm failed');
          return;
        }
        if (shell.exec('npm run build').code !== 0) {
          await this.error(event, 'vue build failed');
          return;
        } if (shell.exec(`sed 's/\/static/static/g' ${`${process.cwd()}/dist/index.html`}`).code !== 0) {
          await this.error(event, 'vue replace path');
          return;
        }
        process.chdir(`${process.cwd()}/dist`);
        if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
          //默认的静态项目 Dockerfile
          fs.writeFileSync(process.cwd() + '/Dockerfile', dockerfile.frontend(event.project.split('/').pop()))
        }
      } else if (fs.existsSync(`${process.cwd()}/package.json`)) {
        //理解为node项目
        //检查script
        let pkg = require(`${process.cwd()}/package.json`);
        if (!pkg.scripts) {
          await this.error(event, 'package.json 缺少 scripts');
          return;
        }
        if (!pkg.scripts.test) {
          await this.error(event, 'package.json 缺少 npm run test 命令');
          return;
        }
        if (!pkg.scripts.start) {
          await this.error(event, 'package.json 缺少 npm start 命令');
          return;
        }
        if (shell.exec('npm --registry https://registry.npm.taobao.org').code !== 0) {
          //状态设置成失败
          await this.error(event, 'npm install Failed');
          return;
        }
        //执行测试脚本
        if (shell.exec(`npm run test`).code !== 0) {
          //状态设置成失败
          await this.error(event, 'npm run test Failed');
          return;
        }
        if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
          //默认的静态项目 Dockerfile
          fs.writeFileSync(`${process.cwd()}/Dockerfile`, dockerfile.node(event.project.split('/').pop()))
        }
        if (!fs.existsSync(`${process.cwd()}/.dockerignore`)) {
          fs.writeFileSync(`${process.cwd()}/.dockerignore`, `node_modules${EOL}.git`)
        }
      } else {
        //理解为其他项目
      }
    }

    if (!fs.existsSync(`${process.cwd()}/Dockerfile`)) {
      //状态设置成失败
      await this.error(event, 'Dockerfile Not Found');
      return;
    }
    let imageName = `${event.project}:${event.branch}`.toLowerCase();
    console.log(`About building: ${imageName}`);
    shell.exec(`docker rmi -f ${imageName}`);
    if (shell.exec(`docker build -t ${imageName} .`).code !== 0) {
      //状态设置成失败
      await this.error(event, 'Build image failed');
      return;
    }

    let envData = {
      BUILDER: 'xiaolan',
      PORT: 80
    };
    if (fs.existsSync(`${process.cwd()}/.env.example`)) {
      envData = Object.assign(envData, require('dotenvr').load(`${process.cwd()}/.env.example`));
    }
    if ((!fs.existsSync(process.cwd() + '/docker-compose.yml')) || (!fs.existsSync(process.cwd() + '/rancher-compose.yml'))) {
      renderYml(event.project.replace(/\/|_/g, '-'), imageName, event.project.split('/').pop(), envData);
    }
    if (!fs.existsSync(process.cwd() + '/docker-compose.yml')) {
      //状态设置成失败
      await this.error(event, 'Create docker-compose.yml Failed');
      return;
    }
    if (!fs.existsSync(process.cwd() + '/rancher-compose.yml')) {
      //状态设置成失败
      await this.error(event, 'Create rancher-compose.yml Failed');
      return;
    }
    if (shell.exec(`${process.env['RANCHER']} up -d  --pull --force-upgrade --confirm-upgrade --stack ${event.project.replace(/\/|_/g, '-')}`).code !== 0) {
      //状态设置成失败
      console.log(`${process.env['RANCHER']} up -d  --pull --force-upgrade --confirm-upgrade --stack ${event.project.replace(/\/|_/g, '-')}`);
      await this.error(event, 'rancher up failed');
      return;
    }
    if (!fs.existsSync(process.cwd() + '/entrance')) {
      fs.mkdirSync(process.cwd() + '/entrance');
    }
    process.chdir(process.cwd() + '/entrance');

    entranceYml();
    if (shell.exec(`${process.env['RANCHER']} up -d  --pull --force-upgrade --confirm-upgrade --stack entrance`).code !== 0) {
      //状态设置成失败
      await this.error(event, 'rancher up entrance failed');
      return;
    }
    event.status = 2;
    event.updateTime = Number.parseInt(Date.now() / 1000);
    await event.update(true);

    return process.cwd()

  }

  makeDir(rPath) {
    let arr = rPath.split('/');
    let current = this.buildPath;
    for (let k in arr) {
      if (!fs.existsSync(`${current}/${arr[k]}`)) {
        fs.mkdirSync(`${current}/${arr[k]}`);
      }
      current = `${current}/${arr[k]}`;
    }
  }

  async error(event, msg) {
    console.log(msg);
    event.status = 3;
    event.remark = msg;
    event.updateTime = Number.parseInt(Date.now() / 1000);
    await event.update(true);
    throw new Error(msg);
    return false;
  }
}

module.exports = Runner;