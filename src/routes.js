const { Router } = require("express");

//Constant to store the projects
const projects = [];

const routes = Router();

//Middleware to chek if my id exist
function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find((el) => el.id == id);
  /* i use the find method to compare if id in my projects array is the same id 
  in my route params*/

  if (!project) {
    return res.status(400).json({ error: "ID doesn't exist" });
  }

  return next();
}

//Middleware to chek the creation of the projects, title and id have to be defined
function checkRequired(req, res, next) {
  const { id, title } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  } else if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  return next();
}

//Middleware just to check the title
function checkRequiredTitle(req, res, next) {
  const { id, title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  return next();
}

//Middleware to prevent creating a project with the same id
function checkDuplicate(req, res, next) {
  const { id } = req.body;
  const idExist = projects.find((el) => el.id == id);

  if (idExist) {
    return res.status(400).json({ error: "Id already exist" });
  }

  return next();
}

//Create Project
routes.post("/projects", checkRequired, checkDuplicate, (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({ id, title, tasks });

  return res.json(projects);
});

//List Project
routes.get("/projects", (req, res) => {
  const project = projects.sort((a, b) => a.id - b.id);

  return res.json(project);
});

//Update Project
routes.put("/projects/:id", checkIdExists, checkRequiredTitle, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const newTitle = projects.find((el) => el.id == id);

  newTitle.title = title;

  return res.json(newTitle);
});

//Delete Project
routes.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex((el) => el.id == id);
  //I use the findIndex to return the index instead the whole element

  projects.splice(project, 1);

  return res.json({ ok: "Removed" });
});

//Create tasks
routes.post(
  "/projects/:id/tasks",
  checkIdExists,
  checkRequiredTitle,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find((el) => el.id == id);

    project.tasks.push(title);

    return res.json(project);
  }
);

module.exports = routes;
