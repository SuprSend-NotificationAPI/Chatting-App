import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/register"; 
import Chatpage from "./pages/chatpage";
import Login from "./components/login"; 

import { AuthProvider } from "./context/context"; // Add this
import ProtectedRoute from "./components/protectedroute"; //Add this


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route // Add this route
          path="/"
          element={
            <ProtectedRoute>
              <Chatpage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-center" />
    </AuthProvider>
  );
}

export default App;
