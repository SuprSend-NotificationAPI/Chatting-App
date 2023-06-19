import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import suprsend from "@suprsend/web-sdk";
import { AuthContext } from "../context/context"; // Add this

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState(""); // Add this
  const [password, setPassword] = useState(""); // Add this

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/auth/login`,
        {
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
      setIsAuthenticated(true)
      toast.success(`Welcome! ${data.name}. Please wait...`, {
        duration: 5000,
        isClosable: true,
        position: toast.POSITION.TOP_CENTER,
      });

      localStorage.setItem("user", JSON.stringify(data));
      suprsend.identify(email);
      setTimeout(() => {
        navigate("/");
        
      }, 4000);
      
    } catch (error) {
      console.log(error.response.data.error);
      setIsAuthenticated(false)
      toast.error(error.response.data.error, {
        duration: 5000,
        isClosable: true,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="welcome-container">
      <form className="form" onSubmit={handleLogin}>
        <label htmlFor="email">Provide your email</label>
        <input
          type="email"
          name="email"
          className="input"
          id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          className="input"
          name="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">Log In</button>
      </form>
    </div>
  );
};
export default Login;
