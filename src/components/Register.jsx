import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../utensils/constants.js";
import { registerRoute } from "../utensils/ApiRoutes";

import Box from "@mui/material/Box";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("task-manager-user")) {
      navigate("/task-manager");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (password === "" || confirmPassword===""){
      toast.error("Password & Confirm Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleFormSubmission = async (event) => {
    try {
      event.preventDefault();
      if (handleValidation()) {
        const { email, username, password } = values;
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          navigate("/login");
        }
      }
    } catch (err) {
      toast.error(err, toastOptions);
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
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "40%",
            height: "55%",
            border: "solid black 2px",
            borderRadius: "5%",
            background: 'linear-gradient(45deg, #FFECD6 30%, #EEF5FF 90%)',
            p: 5,
            '@media screen and (max-width: 767px)': {
              width: '70%',
            },
          }}
        >
          <Typography variant="h5">Register</Typography>

          <TextField
            type="text"
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
            type="text"
            label="Email"
            name="email"
            id="filled-size-small"
            defaultValue=""
            variant="filled"
            size="small"
            fullWidth
            onChange={(e) => handleChange(e)}
          />

          <TextField
            type="password"
            label="Password"
            name="password"
            id="filled-size-small"
            defaultValue=""
            variant="filled"
            size="small"
            fullWidth
            onChange={(e) => handleChange(e)}
          />

          <TextField
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            id="filled-size-small"
            variant="filled"
            size="small"
            fullWidth
            onChange={(e) => handleChange(e)}
          />

          <Button
            startIcon={<HowToRegIcon />}
            color="secondary"
            variant="contained"
            size="large"
            onClick={(e) => {
              handleFormSubmission(e);
            }}
          >
            Create User
          </Button>
          <Typography>
            Already have an account ? <Link to="/login">Login</Link>
          </Typography>
        </Box>
        <ToastContainer />
      </Box>
    </div>
  );
}

export default Register;
