import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { isAuthenticated,setIsAuthenticated} = useContext(AuthContext);
  const [name, setName] = useState(""); // Add this
  const [email, setEmail] = useState(""); // Add this
  const [password, setPassword] = useState(""); // Add this
  const navigate = useNavigate();

  const getUserFromLocalStorage = () => {
    const result = localStorage.getItem("user");
    const user = result ? JSON.parse(result) : null;
    return user;
  };
  useEffect(() => {
    if (getUserFromLocalStorage("user")) {
      setIsAuthenticated(true)
        navigate("/");
    
    }
  }, [navigate]);
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/auth/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
        
      console.log(data);
      toast.success("Success!", {
        duration: 5000,
        isClosable: true,
        position: toast.POSITION.TOP_CENTER,
      });

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error, {
        duration: 5000,
        isClosable: true,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="welcome-container">
      <form className="form" onSubmit={handleRegister}>
        <label htmlFor="name">Enter your name</label>
        <input
          type="string"
          name="name"
          id="name"
          className="input"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label htmlFor="email">Enter your email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="input"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Choose a password</label>
        <input
          type="password"
          name="password"
          className="input"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-container">
          <button type="submit" className="btn">
            Register
          </button>
          <button className="btn" onClick={() =>{
            console.log("nav to loggiinn")
            navigate("/login")
            }}>
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
