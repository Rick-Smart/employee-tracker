const connection = require("./assets/js/connection");
const inquirer = require("inquirer");
const questions = require("./assets/js/questions");

// Start our application
init();

async function init() {
  const { action } = await inquirer.prompt(questions);
  switch (action) {
    case "Edit Department":
      editDepartments();
      break;
    case "Edit Role":
      // multiSearch();
      break;
    case "Edit Employee":
      editEmployee();
      break;
    case "View All Employees":
      removeEmployee();
      break;
    case "Search Employees By Manager":
      // songAndAlbumSearch();
      break;
    case "Update Employee Managers":
      // songAndAlbumSearch();
      break;
    case "Total Budget By Department":
      // songAndAlbumSearch();
      break;
    case "Exit":
      process.exit(0);
      break;
    default:
      break;
  }
}

// starts department selection process
async function editDepartments() {
  const { department } = await inquirer.prompt({
    name: "department",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Department", "Remove Department", "Exit"],
  });

  if (department === "Add Department") {
    addDepartment();
  } else if (department === "Remove Department") {
    removeDepartment();
  } else {
    init();
  }
}

async function addDepartment() {
  const departmentName = await inquirer.prompt({
    name: "department",
    type: "input",
    message: "What is the department name",
  });

  const data = departmentName.department;

  const query = await connection.query(
    "INSERT INTO department SET ?",
    {
      dept: data,
    },

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " -- New Department Added --\n");
      // Call updateProduct AFTER the INSERT completes
      init();
    }
  );
}

async function removeDepartment() {
  connection.query(
    "SELECT dept AS departments FROM department",
    async function (err, departments) {
      const data = await inquirer.prompt([
        {
          name: "departments",
          message: "What department would you like to remove?",
          type: "list",
          choices: departments.map((department) => ({
            name: department.departments,
          })),
        },
      ]);
      connection.query("DELETE FROM department WHERE ?", {
        dept: data.departments,
      });
      console.log(res.affectedRows + " -- Department Removed --\n");
      // Call updateProduct AFTER the INSERT completes
      init();
    }
  );
}
async function editEmployee() {
  const { employee } = await inquirer.prompt({
    name: "employee",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Employee", "Remove Employee", "Exit"],
  });

  if (employee === "Add Employee") {
    addEmployee();
  } else if (employee === "Remove Employee") {
    removeEmployee();
  } else {
    init();
  }
}
async function addEmployee() {
  const employeeName = await inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the employees first name?",
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the employees last name?",
    },
    {
      name: "roleID",
      type: "list",
      message: "What is the employees role?",
      choices: [
        "Intern",
        "Engineer",
        "Code Wizard",
        "Cat Herder",
        "OnlyFans/Self Employeed",
      ],
    },
    {
      name: "managerID",
      type: "confirm",
      message: "Is this person a manager",
    },
  ]);
  switch (employeeName.roleID) {
    case "Intern":
      employeeName.roleID = 1;
      break;
    case "Engineer":
      employeeName.roleID = 2;
      break;
    case "Code Wizard":
      employeeName.roleID = 3;
      break;
    case "Cat Herder":
      employeeName.roleID = 4;
      break;
    case "OnlyFans/Self Employeed":
      employeeName.roleID = 5;
      break;
  }
  switch (employeeName.managerID) {
    case true:
      employeeName.managerID = 1;
      break;
    case false:
      employee.managerID = 0;
      break;
  }

  const query = await connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: employeeName.firstName,
      last_name: employeeName.lastName,
      role_id: employeeName.roleID,
      manager_id: employeeName.managerID,
    },

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " -- New Employee Added --\n");
      init();
    }
  );
}
// this is where the remove employee function will go.
async function removeDepartment() {
  connection.query(
    "SELECT dept AS departments FROM department",
    async function (err, departments) {
      const data = await inquirer.prompt([
        {
          name: "departments",
          message: "What department would you like to remove?",
          type: "list",
          choices: departments.map((department) => ({
            name: department.departments,
          })),
        },
      ]);
      connection.query("DELETE FROM department WHERE ?", {
        dept: data.departments,
      });
      console.log(res.affectedRows + " -- Department Removed --\n");
      // Call updateProduct AFTER the INSERT completes
      init();
    }
  );
}

// * A query which returns all artists who appear within the top 5000 more than once
async function multiSearch() {
  const query =
    "SELECT artist, count(*) AS count FROM top5000 GROUP BY artist HAVING count(*) > 1 ORDER BY count DESC";
  const data = await connection.query(query);
  console.table(data);
  init();
}
// * A query which returns all data contained within a specific range
async function rangeSearch() {
  const { start, end } = await inquirer.prompt([
    {
      name: "start",
      type: "input",
      message: "Enter starting position: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    },
    {
      name: "end",
      type: "input",
      message: "Enter ending position: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    },
  ]);

  const query = `SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ${connection.escape(
    start
  )} AND ${connection.escape(end)}`;
  const data = await connection.query(query);
  console.table(data);
  init();
}

// * A query which searches for a specific song in the top 5000 and returns the data for it
async function specificSong() {
  const { song } = await inquirer.prompt({
    name: "song",
    type: "input",
    message: "What song would you like to look for?",
  });
  const data = await connection.query("SELECT * FROM top5000 WHERE ?", {
    song,
  });
  console.table(data);
  init();
}
