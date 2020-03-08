import config from "../config";
import { getData } from "../utils";

const base = `${config.protocol}://${config.server}:${config.port}/api`;
const getHeaders = () => ({
  "Content-Type": "application/json;charset=utf-8",
  auth: getData().token
});

const login = async values => {
  console.log("Sending request to login.");
  const response = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(values)
  });
  if (!response.ok) {
    throw new Error("Failed login.");
  }
  return response.json();
};

const getTasks = async () => {
  console.log("Sending request to get tasks");
  const response = await fetch(`${base}/task/`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

const submitFlag = async (id, flag) => {
  console.log("Sending request to submit flag");
  const response = await fetch(`${base}/task/submit/${id}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ flag })
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

const getScore = async () => {
  console.log("Sending request to get tasks");
  const response = await fetch(`${base}/task/scoreboard`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

const addTeam = async values => {
  console.log("Sending request to add team");
  const response = await fetch(`${base}/auth/addUser`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(values)
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

const addTask = async task => {
  console.log("Sending request to add task");
  const response = await fetch(`${base}/task/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task)
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

const onToggle = async (id, enabled) => {
  console.log("Sending request to enable task");
  const response = await fetch(`${base}/task/force`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ force: enabled ? -1 : 1, taskId: id })
  });
  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }
  return response.json();
};

export default {
  login,
  getTasks,
  submitFlag,
  getScore,
  addTeam,
  addTask,
  onToggle
};
