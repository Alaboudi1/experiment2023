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
    exec(`yarn `, { cwd: dir }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
// run npm start
const npmStart = (dir) => {
  return new Promise((resolve, reject) => {
    exec(`npm run start `, { cwd: dir }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
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

const experimentWithTool = async (bug) => {
  // run the tool
  return Promise.all([npmStart(bug), npmStart(toolBasePath)]).catch((err) => {
    console.error(err);
  });
};

const experimentWithoutTool = async (bug) => {
  npmStart(bug).catch((err) => {
    console.error(err);
  });
};

createFolder("experiment").then(() => {
  return Promise.all([setupBug(), setupTheTool()]).then(() => {
    const q = ora().info(
      "Please enter the group number and press enter to start the experiment"
    );

    process.stdin.on("data", (data) => {
      const group = data.toString().trim();
      if (group === "A" || group === "a") {
        // hypothesizer with bug 1
        experimentWithTool(BUG1);
      } else if (group === "B" || group === "b") {
        // hypothesizer with bug 2
        experimentWithTool(BUG2);
      } else if (group === "C" || group === "c") {
        //  without hypothesizer bug 1
        experimentWithoutTool(BUG1);
      } else if (group === "D" || group === "d") {
        //  without hypothesizer bug 2
        experimentWithoutTool(BUG2);
      }
      q.color = "green";
      q.text = "The experiment started!";
      q.info("When you finish the experiment, please press 1 and enter");

      process.stdin.on("data", (data) => {
        const finish = data.toString().trim();
        if (finish === "1") {
          q.color = "green";
          q.text = "The experiment finished!";
          q.info("Thank you for your participation");
        }
      });
    });
  });
});
