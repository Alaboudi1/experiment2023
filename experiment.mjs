// run npm start
import open from "open";
import { exec } from "child_process";
import path from "path";

const bugsBasePath = path.join(process.cwd(), "experiment", "bugs");
const toolBasePath = path.join(process.cwd(), "experiment", "tool");

const BUG1 = path.join(bugsBasePath, "bug-1");
const BUG2 = path.join(bugsBasePath, "bug-3");

// get the params
const group = process.argv.slice(2)[0];

const npmStart = (dir) => {
  return new Promise((resolve, reject) => {
    exec(`npm run start `, { cwd: dir }).on("error", (err) => {
      reject(err);
    });

    return resolve();
  });
};

const experimentWithTool = async (bug) => {
  // run the tool
  return Promise.all([npmStart(bug), npmStart(toolBasePath), open(bug)]).catch(
    (err) => {
      console.error(err);
    }
  );
};

const experimentWithoutTool = async (bug) => {
  return Promise.all([npmStart(bug), open(bug)], open("localhost:3000")).catch(
    (err) => {
      console.error(err);
    }
  );
};

const runExperiment = async () => {
  switch (group) {
    case "H1":
      await experimentWithTool(BUG1);
      break;
    case "H2":
      await experimentWithTool(BUG2);
      break;
    case "C1":
      await experimentWithoutTool(BUG1);
      break;
    case "C2":
      await experimentWithoutTool(BUG2);
      break;
    default:
      console.log("Please enter a valid group");
      break;
  }
};

runExperiment();
