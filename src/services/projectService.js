import API from "./api";

export const getProjects = async () => {
  const res = await API.get("/projects");
  return res.data;
};

export const createProject = async (data) => {
  const res = await API.post("/projects", data);
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await API.get(`/projects/${id}`);
  return res.data;
};