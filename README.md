
# Task Tracker CLI

💡 https://roadmap.sh/projects/task-tracker

Welcome to the Task Tracker CLI project! This command-line tool helps you manage your tasks using various commands. You can add, update, delete, and view tasks, as well as search and sort them.

## Features


```
Add: Add a new task with a title, description, and status.
Update: Update the details of an existing task.
Delete: Remove a task by its ID.
Clear: Delete all tasks.
Get: Retrieve all tasks or filter them by status (done, pending, in-progress).
Search: Search tasks by keyword.
Sort: Sort tasks by title, status, or ID.
Stats: Get statistics on your tasks.
```
### Prerequisites
Node.js (v12 or higher)

### Installation
Clone the repository:
```
git clone https://github.com/Shubham02022002/cli-taskTracker
```
Navigate to the project directory:
```
cd cli-taskTracker
```
Install the dependencies:
``` 
npm Install
```

### Usage
To use the Task Tracker CLI, run the following command followed by one of the available commands:

#### Commands
Add a task:
```
node index.js add
```
Follow the prompts to enter the task details.

Update a task:
```
node index.js update
```
Enter the task ID and updated details when prompted.

Delete a task:
```
node index.js delete
```
Enter the task ID to delete the task.

Clear all tasks:
```
node index.js clear
```
Confirm the deletion of all tasks.

Get all tasks:

```
node index.js get
```

Get done tasks:
```
node index.js get-done
```

Get pending tasks:
```
node index.js get-pending
```

Get in-progress tasks:
```
node index.js get-in-progress
```
Search tasks:
```
node index.js search
```
Enter a keyword to search for tasks.

Sort tasks:
```
node index.js sort
```
Choose a criteria (title, status, or ID) to sort tasks.


Get task statistics:
```
node index.js stats
```
Example

```
$ node index.js add
? Enter the title Go to gym
? Enter task's description Go to gym from 8-9
? What's the status? todo
Go to gym added! with ID: 1725255105899
```

### Contributing
If you want to contribute to this project, please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project’s coding standards and includes appropriate tests.