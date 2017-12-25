const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const renderYml = require('../libs/renderYml');

const EventModel = require('../definitions/models/Event.gen');

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
    event.status = 1;
    await event.update(true);

    //进入工作目录
    if (!fs.existsSync(`${this.buildPath}/${event.project}/${event.branch}`)) {
      this.makeDir(`${event.project}/${event.branch}`);
    }
    process.chdir(`${this.buildPath}/${event.project}/${event.branch}`);
    shell.exec(`rm -fr *`);
    shell.exec(`rm -fr .*`);
    if (shell.exec(`git clone https://github.com/${event.project}.git .`).code !== 0) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'Git Clone Failed:' + `git clone https://github.com/${event.project}.git`;
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('Git Clone Failed:' + `git clone https://github.com/${event.project}.git`);
      return;
    }
    if (shell.exec(`git checkout ${event.branch}`).code !== 0) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'Git Checkout Failed:' + event.branch;
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('Git Checkout Failed:' + event.branch);
      return;
    }
    if (shell.exec(`git checkout ${event.hash}`).code !== 0) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'Git Checkout Failed:' + event.hash;
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('Git Checkout Failed:' + event.hash);
      return;
    }
    if (shell.exec(`npm run test`).code !== 0) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'npm run test Failed';
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('npm run test Failed');
      return;
    }
    if (!fs.existsSync(process.cwd() + '/Dockerfile')) {
      //默认的Dockerfile
      const dockerfile = require('../libs/dockerfile');
      fs.writeFileSync(process.cwd() + '/Dockerfile',dockerfile.frontend(event.project.split('/').pop()))
    }
    let imageName = `${event.project}:${event.branch}`.toLowerCase();
    shell.exec(`docker rmi -f ${imageName}`);
    if (shell.exec(`docker build -t ${imageName} .`).code !== 0) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'Build image failed';
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('Build image failed');
      return;
    }

    renderYml(event.project.replace(/\/|_/g,'-'), imageName, event.project.split('/').pop());
    if (!fs.existsSync(process.cwd() + '/docker-compose.yml')) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'Create docker-compose.yml Failed';
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('Create docker-compose.yml Failed');
      return;
    }
    if (!fs.existsSync(process.cwd() + '/rancher-compose.yml')) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'Create rancher-compose.yml Failed';
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('Create rancher-compose.yml Failed');
      return;
    }
    if (shell.exec(`${process.env['RANCHER']} up -d  --pull --force-upgrade --confirm-upgrade --stack ${event.project.replace(/\/|_/g,'-')}`).code !== 0) {
      //状态设置成失败
      event.status = 3;
      event.remark = 'rancher up failed';
      event.updateTime = Number.parseInt(Date.now()/1000);
      await event.update(true);
      throw new Error('rancher up failed');
      return;
    }
    event.status = 2;
    event.updateTime = Number.parseInt(Date.now()/1000);
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
}

module.exports = Runner;