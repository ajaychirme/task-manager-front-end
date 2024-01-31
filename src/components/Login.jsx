import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import TextField from "@mui/material/TextField";

import { toastOptions } from "../utensils/constants.js";
import { loginRoute } from "../utensils/ApiRoutes";
import { Button, Typography } from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem("task-manager-user")) {
      navigate("/task-manager");
    }
  }, []);

  const handleChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });
        if (data.status == false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status == true) {
          toast.success(data.msg);
          const { password: userPassword, ...userWithoutPassword } = data.user;
          localStorage.setItem(
            "task-manager-user",
            JSON.stringify(userWithoutPassword)
          );
          localStorage.setItem(
            "jwt",
            JSON.stringify(data.token)
          );
        
          navigate("/task-manager");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.msg, toastOptions);
        } else {
          toast.error("Error:", error.message, toastOptions);
        }
      }
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "40%",
            height: "40%",
            border: "solid black 2px",
            borderRadius: "5%",
            background: "linear-gradient(45deg, #FFECD6 30%, #EEF5FF 90%)",
            p: 5,
          }}
        >
          <Typography variant="h5">Login</Typography>

          <TextField
            type="text"
            color="secondary"
            label="User Name"
            name="username"
            id="filled-size-small"
            defaultValue=""
            variant="filled"
            size="small"
            fullWidth
            onChange={(e) => handleChange(e)}
          />

          <TextField
            type="password"
            color="secondary"
            label="Password"
            name="password"
            id="filled-size-small"
            defaultValue=""
            variant="filled"
            size="small"
            fullWidth
            onChange={(e) => handleChange(e)}
          />
          <Button
            startIcon={<LoginIcon />}
            color="secondary"
            onClick={(e) => handleFormSubmission(e)}
            variant="contained"
            size="large"
          >
            Login
          </Button>
          <Typography variant="description">
            Don't have an account ? <Link to="/register">Register</Link>
          </Typography>
        </Box>

        <ToastContainer />
      </Box>
    </div>
  );
}

export default Login;
