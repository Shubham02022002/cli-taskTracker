#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";

program.version("1.0.0").description("Welcome to Task Tracker");

// Add a task
program
  .command("add")
  .description("Add a task")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title",
        },
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

          let tasks = [];
          if (fs.existsSync("./tasks.json")) {
            tasks = JSON.parse(fs.readFileSync("./tasks.json"));
          }

          tasks.push(task);
          fs.writeFileSync("./tasks.json", JSON.stringify(tasks, null, 2)); 
          console.log(
            chalk.green(`${answers.title} added! with id: ${task.id}`)
          );
        }
      });
  });

// Update a task
program
  .command("update")
  .description("Update a task")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: "Enter the ID to update",
        },
      ])
      .then((answers) => {
        const tasks = JSON.parse(fs.readFileSync("./tasks.json"));
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

            fs.writeFileSync("./tasks.json", JSON.stringify(tasks, null, 2));
            console.log(
              chalk.green(`Task with ID ${answers.id} has been updated!`)
            );
          });
      });
  });

program.parse(process.argv);
