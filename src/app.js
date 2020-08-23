const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function logRequest(request,response, next){
  const {url, method} = request;
  const log = `[${method.toUpperCase()}] ${url}`;
  console.time(log);
  next();
  return console.timeEnd(log);
}
app.use(logRequest)
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {id : uuid(), title ,url,likes : 0,techs};
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error : "Not found repositoy id."});
  }

  var repository = repositories[repositoryIndex];
  repository.title = title 
    ? title 
    : repository.title;
  repository.url = url
    ? url
    : repository.url;
  repository.techs = techs
    ? techs
    : repository.techs;
  
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json("Not found repository id.");
  }
  //const repository = repositories[repositoryIndex];
  repositories.splice(repositoryIndex,1);
  //return response.json({message : "Repository deleted", repository });
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "Not found repository id."});
  }

  const repository = repositories[repositoryIndex];
  repository.likes ++;

  //repositories[repositoryIndex] = repository;
  //return response.json(repository);
  return response.json({likes : repository.likes})
});

module.exports = app;
