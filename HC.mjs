const q = await ora()
  .info("Please enter the group number and press enter to start the experiment")
  .stopAndPersist();
// force the program to wait for the user to enter the group number

rl.question("Group number: ", (group) => {
  if (group === "A" || group === "a") {
    // hypothesizer with bug 1
    const spinner = ora("Wait...").start();
    experimentWithTool(BUG1).then(() => {
      spinner.succeed("Done!");
      rl.close();
    });
  } else if (group === "B" || group === "b") {
    // hypothesizer with bug 2
    const spinner = ora("Wait...").start();
    experimentWithTool(BUG2).then(() => {
      spinner.succeed("Done!");
      rl.close();
    });
  } else if (group === "C" || group === "c") {
    //  without hypothesizer bug 1
    const spinner = ora("Wait...").start();
    experimentWithoutTool(BUG1).then(() => {
      spinner.succeed("Done!");
      rl.close();
    });
  } else if (group === "D" || group === "d") {
    //  without hypothesizer bug 2
    const spinner = ora("Wait...").start();
    experimentWithoutTool(BUG2).then(() => {
      spinner.succeed("Done!");
      rl.close();
    });
  }
});
