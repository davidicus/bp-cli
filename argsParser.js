'use strict';

const fs = require('fs');
const path = require('path');

const configPath = path.join((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE), '/.reaperconfig.json');

// const setConfig = require('./setConfig');
const repoList = (fs.existsSync(configPath)) ? require(configPath) : require('./repoInfo.json');

//output for list flag
const repos = `
  Starter Repo List:
  a: ${repoList.repos.a}
  b: ${repoList.repos.b}
`;

//output for help flag
const help = `
  Usage:
  reaper [repo] [flag]     generate the [repo] starter project in the current directory

  Options:
  -h, --help               print help menu
  -l, --list               list starter repo options
  -r, --remote             create a remote repo for this project

  [repo]                   specify the repo to clone, defaults to "a"

  Starter Repo List:
  a: ${repoList.repos.a}
  b: ${repoList.repos.b}
`;

//regex checking for "-r"
const regex = /^-r/g;

let configFile = false;

const argsParser = (args) => {

  //define the default info object
  let info = {
    clone: repoList.repos.a,
    local: process.cwd(),
    remote: false
  };

  //check if there are any arguments
  const length = args.length;

  //if no arguments passed return the defaults
  if (length === 0) {
    return info;
  }

  //check if there are more than one argument and then make sure it is -r flag
  if (length > 1 && !regex.exec(args[length - 1]) && !args[0].includes('-c')) {
    console.log('ERROR: The last argument must either be the "-r" or "--remote" flag');
    throw new Error;
  }

  //parse each argument
  args.map(arg => {
    // if argument is passed serve up appropriate object
    switch (arg) {
      case '-l':
        console.log(repos);
        info = null;
        break;
      case '--list':
        console.log(repos);
        info = null;
        break;
      case '-c':
        info.clone = args[2];
        break;
      case '--clone':
        info.clone = args[2];
        break;
      case '-h':
        console.log(help);
        info = null;
        break;
      case '--help':
        console.log(help);
        info = null;
        break;
      case 'a':
        break;
      case 'b':
        info.clone = repoList.repos.b;
        break;
      case '-r':
        info.remote = true;
        break;
      case '--remote':
        info.remote = true;
        break;
      default:
        if (!arg.includes('https')) {
          console.log(`ERROR: ${arg} is not valid argument.`);
          throw new Error;
        }
    }
  });

  return info;
};

module.exports = argsParser;
