import ora from "ora";
import fs from "fs";
import { exec } from "child_process";
import path from "path";

const bugsBasePath = path.join(process.cwd(), "experiment", "bugs");
const toolBasePath = path.join(process.cwd(), "experiment", "tool");

const BUG1 = path.join(bugsBasePath, "bug-1");
const BUG2 = path.join(bugsBasePath, "bug-2");

const bugsRepo = "https://github.com/Alaboudi1/modernWebApplicationBugs.git";
const toolRepo = "https://github.com/Alaboudi1/electron-hypothesizer.git";

// clone a repo to a folder and run npm install
const cloneRepo = (repo, dir) => {
  return new Promise((resolve, reject) => {
    exec(`git clone ${repo} ${dir}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// run npm install
const npmInstall = (dir) => {
  return new Promise((resolve, reject) => {
    exec(`npm i  --force `, { cwd: dir }, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
};

// create a folder
const createFolder = (dir) => {
  // check if the folder exists
  if (!fs.existsSync(dir)) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  return Promise.resolve();
};

const setupBug = async () => {
  // check if the folder exists
  if (fs.existsSync(bugsBasePath)) {
    console.log("The bugs folder exists!");
    return Promise.resolve();
  }
  const spinner = ora("Cloning the bugs repo").start();
  return cloneRepo(bugsRepo, bugsBasePath).then(() => {
    spinner.succeed("The bugs repo cloned");
    const spinner2 = ora("Installing the dependencies for the repo").start();
    return Promise.all([npmInstall(BUG1), npmInstall(BUG2)])
      .then(() => spinner2.succeed("The dependencies installed for the repo"))
      .catch((err) => console.error(err));
  });
};

const setupTheTool = async () => {
  if (fs.existsSync(toolBasePath)) return Promise.resolve();

  const spinner = ora("Cloning the tool repo").start();
  return cloneRepo(toolRepo, toolBasePath)
    .then(() => spinner.succeed("The tool repo cloned"))
    .then(() => {
      const spinner2 = ora("Installing the dependencies for the tool").start();
      return npmInstall(toolBasePath).then(() =>
        spinner2.succeed("The dependencies installed for the tool")
      );
    })
    .catch((err) => {
      console.error(err);
    });
};

createFolder("experiment").then(() => {
  return Promise.all([setupBug(), setupTheTool()]).then(async () => {
    await ora().succeed("Done!");
    //exit the program
    process.exit(0);
  });
});
