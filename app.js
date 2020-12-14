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
      editRole();
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
      connection.query(
        "DELETE FROM department WHERE ?",
        {
          dept: data.departments,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " -- Department Removed --\n");
          // Call updateProduct AFTER the INSERT completes
          init();
        }
      );
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
  // switch (employeeName.roleID) {
  //   case "Intern":
  //     employeeName.roleID = 1;
  //     break;
  //   case "Engineer":
  //     employeeName.roleID = 2;
  //     break;
  //   case "Code Wizard":
  //     employeeName.roleID = 3;
  //     break;
  //   case "Cat Herder":
  //     employeeName.roleID = 4;
  //     break;
  //   case "OnlyFans/Self Employeed":
  //     employeeName.roleID = 5;
  //     break;
  // }
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
async function removeEmployee() {
  connection.query(
    "SELECT first_name AS firstName, last_name AS lastName FROM employee",
    async function (err, employees) {
      const data = await inquirer.prompt([
        {
          name: "employees",
          message: "Which employee would you like to remove?",
          type: "list",
          choices: employees.map((employee) => ({
            name: employee.firstName + " " + employee.lastName,
          })),
        },
      ]);

      // console.log(data);
      const firstAndLast = data.employees.split(" ");
      // console.log(firstAndLast[1]);

      connection.query(
        "DELETE FROM employee WHERE first_name = ? AND last_name = ?",
        [firstAndLast[0], firstAndLast[1]]
      );
      init();
    }
  );
}

async function editRole() {
  const { role } = await inquirer.prompt({
    name: "role",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Role", "Remove Role", "Update Role", "Exit"],
  });

  if (role == "Add Role") {
    addRole();
  } else if (role == "Remove Role") {
    removeRole();
  } else if (role == "Update Role") {
    updateRole();
  } else {
    init();
  }
}

async function addRole() {
  connection.query("SELECT * FROM role", async function (err, roles) {
    if (err) {
      console.log(err);
    }
    const { roleTitle } = await inquirer.prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the new roles title?",
      },
      {
        name: "roleSalary",
        type: "number",
        message: "What is the salary for this role?",
      },
      {
        name: "roleDept",
        type: "list",
        message: "What department is this role in?",
        choices: roles.map((newRoles) => ({
          name: newRoles.title,
        })),
      },
    ]);

    // console.log(data);
  });
  switch (data.roleDept) {
    case "Intern":
      data.roleDept = 1;
      break;
    case "Engineer":
      data.roleDept = 2;
      break;
    case "Code Wizard":
      data.roleDept = 3;
      break;
    case "Cat Herder":
      data.roleDept = 4;
      break;
    case "OnlyFans/Self Employeed":
      data.roleDept = 5;
      break;
  }

  const query = await connection.query(
    "INSERT INTO role SET ?",
    {
      title: data.roleTitle,
      salary: data.roleSalary,
      dept_id: data.roleDept,
    },

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " -- New Employee Added --\n");
      init();
    }
  );
}
async function removeRole() {}

async function updateRole() {}
