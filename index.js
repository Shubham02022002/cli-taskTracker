#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";

const getTasks = () => {
  if (fs.existsSync("./tasks.json")) {
    return JSON.parse(fs.readFileSync("./tasks.json", "utf-8"));
  }
  return [];
};

const saveTasks = (tasks) => {
  fs.writeFileSync("./tasks.json", JSON.stringify(tasks, null, 2));
};

program
  .version("1.0.0")
  .description(chalk.blue.bold("Welcome to Task Tracker"));

// Add a task
program
  .command("add")
  .description("Add a task")
  .action(() => {
    inquirer
      .prompt([
        { type: "input", name: "title", message: "Enter the title" },
        {
          type: "input",
          name: "description",
          message: "Enter task's description",
        },
        {
          type: "list",
          name: "status",
          choices: ["todo", "in-progress", "done"],
          message: "What's the status?",
        },
      ])
      .then((answers) => {
        if (!answers.title || !answers.description || !answers.status) {
          console.log(chalk.red("Please add required entries"));
        } else {
          const task = {
            id: Date.now(),
            title: answers.title,
            description: answers.description,
            status: answers.status,
          };

          const tasks = getTasks();
          tasks.push(task);
          saveTasks(tasks);
          console.log(
            chalk.green(`${answers.title} added! with ID: ${task.id}`)
          );
        }
      });
  });

// Update a task
program
  .command("update")
  .description("Update a task")
  .action(() => {
    const tasks = getTasks();
    if (tasks.length === 0) {
      console.log(chalk.red("No tasks found."));
      return;
    }

    inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: "Enter the ID to update",
        },
      ])
      .then((answers) => {
        const taskIndex = tasks.findIndex((t) => t.id == answers.id);

        if (taskIndex === -1) {
          console.log(chalk.red("Invalid task ID"));
          process.exit();
        }

        inquirer
          .prompt([
            {
              type: "input",
              name: "title",
              message: "Enter updated title (leave blank to keep current)",
              default: tasks[taskIndex].title,
            },
            {
              type: "input",
              name: "description",
              message:
                "Enter updated description (leave blank to keep current)",
              default: tasks[taskIndex].description,
            },
            {
              type: "list",
              name: "status",
              choices: ["todo", "in-progress", "done"],
              message: "What's the current status?",
              default: tasks[taskIndex].status,
            },
          ])
          .then((updateAnswers) => {
            tasks[taskIndex] = {
              ...tasks[taskIndex],
              title: updateAnswers.title || tasks[taskIndex].title,
              description:
                updateAnswers.description || tasks[taskIndex].description,
              status: updateAnswers.status || tasks[taskIndex].status,
            };

            saveTasks(tasks);
            console.log(
              chalk.green(`Task with ID ${answers.id} has been updated!`)
            );
          });
      });
  });

// Delete a task
program
  .command("delete")
  .description("Delete a task by ID")
  .action(() => {
    const tasks = getTasks();
    if (tasks.length === 0) {
      console.log(chalk.red("No tasks found."));
      return;
    }

    inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: "Enter the ID of the task to delete",
        },
      ])
      .then((answers) => {
        const newTasks = tasks.filter((t) => t.id != answers.id);

        if (newTasks.length === tasks.length) {
          console.log(chalk.red("Task ID not found."));
        } else {
          saveTasks(newTasks);
          console.log(
            chalk.green(`Task with ID ${answers.id} has been deleted.`)
          );
        }
      });
  });

// Clear all tasks
program
  .command("clear")
  .description("Clear all tasks")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Are you sure you want to delete all tasks?",
        },
      ])
      .then((answers) => {
        if (answers.confirm) {
          saveTasks([]);
          console.log(chalk.green("All tasks have been cleared."));
        }
      });
  });

// Get all tasks
program
  .command("get")
  .description("Get all tasks")
  .action(() => {
    const tasks = getTasks();
    console.log(chalk.blue.bold("All Tasks:"));
    console.log(chalk.green(JSON.stringify(tasks, null, 2)));
  });

// Get done tasks
program
  .command("get-done")
  .description("Get all tasks that are done")
  .action(() => {
    const tasks = getTasks();
    const doneTasks = tasks.filter((t) => t.status === "done");
    console.log(chalk.blue.bold("Done Tasks:"));
    console.log(chalk.greenBright(JSON.stringify(doneTasks, null, 2)));
  });

// Get pending tasks
program
  .command("get-pending")
  .description("Get all tasks that are pending")
  .action(() => {
    const tasks = getTasks();
    const pendingTasks = tasks.filter((t) => t.status === "todo");
    console.log(chalk.blue.bold("Pending Tasks:"));
    console.log(chalk.greenBright(JSON.stringify(pendingTasks, null, 2)));
  });

// Get in-progress tasks
program
  .command("get-in-progress")
  .description("Get all tasks that are in progress")
  .action(() => {
    const tasks = getTasks();
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
    console.log(chalk.blue.bold("In-Progress Tasks:"));
    console.log(chalk.greenBright(JSON.stringify(inProgressTasks, null, 2)));
  });

// Search for tasks
program
  .command("search")
  .description("Search tasks by keyword")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "keyword",
          message: "Enter a keyword to search for",
        },
      ])
      .then((answers) => {
        const tasks = getTasks();
        const filteredTasks = tasks.filter(
          (t) =>
            t.title.includes(answers.keyword) ||
            t.description.includes(answers.keyword)
        );
        console.log(chalk.blue.bold(`Tasks matching "${answers.keyword}":`));
        console.log(chalk.greenBright(JSON.stringify(filteredTasks, null, 2)));
      });
  });

// Sort tasks
program
  .command("sort")
  .description("Sort tasks by title, status, or ID")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "criteria",
          choices: ["title", "status", "id"],
          message: "Sort tasks by:",
        },
      ])
      .then((answers) => {
        const tasks = getTasks();
        const sortedTasks = tasks.sort((a, b) =>
          a[answers.criteria].localeCompare(b[answers.criteria])
        );
        console.log(chalk.blue.bold(`Tasks sorted by ${answers.criteria}:`));
        console.log(chalk.greenBright(JSON.stringify(sortedTasks, null, 2)));
      });
  });

// Get task statistics
program
  .command("stats")
  .description("Get task statistics")
  .action(() => {
    const tasks = getTasks();
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress"
    ).length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;

    console.log(chalk.blue.bold("Task Statistics:"));
    console.log(chalk.green(`Total Tasks: ${totalTasks}`));
    console.log(chalk.green(`Pending (Todo): ${todoTasks}`));
    console.log(chalk.green(`In Progress: ${inProgressTasks}`));
    console.log(chalk.green(`Done: ${doneTasks}`));
  });

program.parse(process.argv);

function startCLI() {
  if (process.argv.slice(2).length === 0) {
    promptCommand();
  }
}

function promptCommand() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "command",
        message: chalk.blue.bold("Enter a command (or 'exit' to quit):"),
      },
    ])
    .then((answers) => {
      if (answers.command.trim().toLowerCase() === "exit") {
        console.log(chalk.green.bold("Goodbye!"));
        process.exit();
      } else {
        const args = answers.command.trim().split(" ");
        program.parse(["node", "index.js", ...args]);
        promptCommand();
      }
    });
}

startCLI();
