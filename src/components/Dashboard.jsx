import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";

import { toastOptions } from "../utensils/constants";

import {
  addTaskRoute,
  getAllTasksRoute,
  deleteTaskRoute,
  updateTaskRoute,
} from "../utensils/ApiRoutes";
import { ToastContainer, toast } from "react-toastify";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const taskValue = useRef("");
  const navigate = useNavigate();
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      navigate("/task-manager");
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        if (!isDataFetched) {
          // Check if data is already fetched
          const username = JSON.parse(
            localStorage.getItem("task-manager-user")
          ).username;
          let { data } = await axios.post(getAllTasksRoute, {
            username: username,
          });
          if (data.status === true) {
            setTasks(data.tasks);
            setIsDataFetched(true); // Set the flag to true after fetching data
          }
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    getAllTasks();
  }, [isDataFetched]); // Add isDataFetched as a dependency

  const handleCreateTask = async () => {
    if (taskValue.current.value.length == 0) {
      toast.warning("Add some task information", toastOptions);
      return;
    } else {
      try {
        const username = JSON.parse(
          localStorage.getItem("task-manager-user")
        ).username;
        const { data } = await axios.post(addTaskRoute, {
          task: taskValue.current.value,
          username: username,
        });
        if (data.status == true) {
          toast.success(data.msg, toastOptions);
        }
        taskValue.current.value = "";
        localStorage.setItem("task-manager-user", JSON.stringify(data.user));
        setIsDataFetched(false);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("Error: Bad request");
        } else {
          console.error("Error:", error.message);
        }
      }
    }
  };

  const handleDeleteTask = async (index) => {
    try {
      const username = JSON.parse(
        localStorage.getItem("task-manager-user")
      ).username;
      const taskId = index;
      const { data } = await axios.delete(
        `${deleteTaskRoute}${taskId}?username=${username}`
      );
      if (data.status == true) {
        toast.success(data.msg, toastOptions);
        localStorage.setItem("task-manager-user", JSON.stringify(data.user));
      }
      setIsDataFetched(false);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSave = async (index) => {
    try {
      const username = JSON.parse(
        localStorage.getItem("task-manager-user")
      ).username;
      const taskId = index;
      const task = tasks.find((task) => task._id === index);
      const updatedTask = task.name;
      console.log("updatedTask", updatedTask);
      const { data } = await axios.post(updateTaskRoute, {
        taskId: index,
        updatedTask: updatedTask,
        username: username,
      });
      if (data.status == true) {
        toast.success(data.msg,toastOptions)
        localStorage.setItem("task-manager-user", JSON.stringify(data.user));
      }
      setIsDataFetched(false);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleLogOut = () => {
    const userConfirmed = window.confirm("Are you sure you want to log out?");
    if (!userConfirmed) return;
    localStorage.removeItem("task-manager-user");
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <>
      <div
        style={{
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          height:"100vh"
        }}
      >
        <Button
          sx={{ position: "fixed", top: "10px", right: "10px", zIndex: "10" }}
          variant="contained"
          size="large"
          color="error"
          onClick={handleLogOut}
        >
          Log Out
        </Button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ my: 2 }} variant="h4">
            Task List
          </Typography>
          <br />
          <Box>
            <TextField
              sx={{ mr: 2, mt: -1 }}
              type="text"
              inputRef={taskValue}
              inputProps={{ style: { color: "black" } }}
              placeholder="Create New Task"
            />
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handleCreateTask}
            >
              Create
            </Button>
          </Box>
        </div>
        <div className="TaskContainer">
          <ul>
            {tasks &&
              tasks.map((task, index) => (
                <div>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "fitContent",
                      minHeight: "8rem",
                      height: "fitContent",
                      border: "2px solid black",
                      mx: 3,
                      my: 1,
                      p: 2,
                      borderRadius: "2rem",
                      background:
                        "linear-gradient(45deg, #FFECD6 30%, #EEF5FF 90%)",
                    }}
                  >
                    {focusedIndex === index ? (
                      <Box
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <textarea
                          rows="6"
                          cols="100"
                          value={task.name}
                          onChange={(e) => {
                            const newTasks = [...tasks];
                            newTasks[index].name = e.target.value;
                            setTasks(newTasks);
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography>{task.name}</Typography>
                    )}
                    <Box
                      sx={{
                        marginTop: "10px",
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "35%",
                      }}
                    >
                      {focusedIndex === index ? (
                        <Button
                          startIcon={<SaveIcon />}
                          color="secondary"
                          variant="outlined"
                          size="large"
                          mx={20}
                          onClick={() => {
                            handleSave(tasks[index]._id);
                            setFocusedIndex(null);
                          }}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          startIcon={<EditIcon />}
                          color="secondary"
                          variant="outlined"
                          size="large"
                          mx={2}
                          onClick={() => {
                            if (focusedIndex === null) {
                              setFocusedIndex(index);
                            }
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteTask(task._id)}
                        startIcon={<DeleteIcon />}
                        color="secondary"
                        variant="outlined"
                        size="large"
                        mx={2}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </div>
              ))}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Dashboard;
