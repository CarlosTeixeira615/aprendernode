const express = require("express");
const cors = require('cors')
const { uuid, isUuid } = require("uuidv4");
const app = express();

app.use(cors());
app.use(express.json());

const projects = [];
function logReq(req, res, next){ 
 const { method, url }= req
 const logLabel = `[${method.toUpperCase()}] ${url}`;
  return next()
}

function validateProjetcIdm(req, res, next){
   const { id } = req.params
   if(!isUuid(id)){
     return res.status(400).json({ error: 'Invalid project id'})
   }
   return next()
}

app.use(logReq)
app.use('/projects/:id', validateProjetcIdm)

app.get("/projects",logReq, (req, res) => {
    const { title } = req.query;
  const results = title
     ? projects.filter(project => project.title.includes(title))
     : projects;
  return res.json(results);
});

app.post("/projects",  (req, res) => {
  const { title, owner } = req.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return res.json(project);
});

app.put("/projects/:id",  (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;
  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found" });
  }
  const project = {
    id,
    title,
    owner,
  }
  projects[projectIndex] = project
  return res.json(project)
});

app.delete("/projects/:id", (req, res) => {
  const {id} = req.params
  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found" });
  }
  projects.splice(projectIndex, 1)
  return res.status(204).send();
});

app.listen(3333, () => {
  console.log("😎 pai ta on");
});
