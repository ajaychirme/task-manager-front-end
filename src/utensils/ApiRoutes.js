const hostName = "http://localhost:3003";

const loginRoute = `${hostName}/auth/login`;
const registerRoute = `${hostName}/auth/register`;
const addTaskRoute = `${hostName}/task/add-task`;
const getAllTasksRoute = `${hostName}/task/get-all-tasks`;
const deleteTaskRoute = `${hostName}/task/delete-task/`;
const updateTaskRoute = `${hostName}/task/update-task`;
export {
  loginRoute,
  registerRoute,
  addTaskRoute,
  getAllTasksRoute,
  deleteTaskRoute,
  updateTaskRoute,
};
