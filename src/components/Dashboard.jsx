import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
        const username = JSON.parse(localStorage.getItem("task-manager-user")).username;
        let { data } = await axios.post(getAllTasksRoute, {
          username: username,
        });
        if (data.status === true) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    getAllTasks();
  }, []);

  useEffect(() => {
    // This useEffect will run whenever tasks change, i.e., after every drag and drop
    const updateLocalStorage = () => {
      const user = JSON.parse(localStorage.getItem("task-manager-user"));
      if (user) {
        user.tasks = tasks;
        localStorage.setItem("task-manager-user", JSON.stringify(user));
      }
    };

    updateLocalStorage();
  }, [tasks]);

  function DraggableTaskBox({
    task,
    index,
    focusedIndex,
    setFocusedIndex,
    handleSave,
    handleDeleteTask,
    moveTask,
  }) {
    const [{ isDragging }, drag] = useDrag({
      type: "TASK",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const [, drop] = useDrop({
      accept: "TASK",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveTask(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    const textareaRef = useRef("");
    const [editedTaskName, setEditedTaskName] = useState(task.name);
    useEffect(() => {
      if (focusedIndex === index && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }
    }, [focusedIndex, index]);
  
    return (
      <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
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
            background: "linear-gradient(45deg, #FFECD6 30%, #EEF5FF 90%)",
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
                value={editedTaskName}
                ref={textareaRef}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[index].name = e.target.value;
                  setTasks(newTasks);
                  setEditedTaskName(e.target.value);
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
    );
  }

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
          setTasks(data.user.tasks);
        }
        taskValue.current.value = "";
        localStorage.setItem("task-manager-user", JSON.stringify(data.user));
      } catch (error) {
        toast.error(error.message, toastOptions);
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
        setTasks(data.user.tasks);
      }
    } catch (error) {
      toast.error(error.message, toastOptions);
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
      const { data } = await axios.post(updateTaskRoute, {
        taskId: index,
        updatedTask: updatedTask,
        username: username,
      });
      if (data.status == true) {
        toast.success(data.msg, toastOptions);
        setTasks(data.user.tasks);
        localStorage.setItem("task-manager-user", JSON.stringify(data.user));
      }
    } catch (error) {
      toast.error(error.message, toastOptions);
    }
  };

  const handleLogOut = () => {
    const userConfirmed = window.confirm("Are you sure you want to log out?");
    if (!userConfirmed) return;
    localStorage.removeItem("task-manager-user");
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  const moveTask = (fromIndex, toIndex) => {
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);
    setTasks(newTasks);
  };

  return (
    <>
      <div
        style={{
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          height: "fit-content",
          minHeight: "100vh",
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
        <div>
          <DndProvider backend={HTML5Backend}>
            <Box>
              {tasks &&
                tasks.map((task, index) => (
                  <DraggableTaskBox
                    key={task._id}
                    task={task}
                    index={index}
                    focusedIndex={focusedIndex}
                    setFocusedIndex={setFocusedIndex}
                    handleSave={handleSave}
                    handleDeleteTask={handleDeleteTask}
                    moveTask={moveTask}
                  />
                ))}
            </Box>
          </DndProvider>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Dashboard;
