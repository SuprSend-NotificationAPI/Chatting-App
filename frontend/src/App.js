import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/register"; 
import Chatpage from "./pages/chatpage";
import Login from "./components/login"; 
import suprsend from "@suprsend/web-sdk";
import { AuthProvider } from "./context/context"; // Add this
import ProtectedRoute from "./components/protectedroute"; //Add this

suprsend.init('BGWR8ZvzWH3OByVZsiKb', 'MhfyVl56yf9YcdDlRbSa', {
  vapid_key: 'BEz-aPYp90r-pnFeiGr_ByxEzjHZU0Cw3BY4W2r2Ui6sCyE7BayL-tuCpxR4UrMI3HOGHP6lg_AXmVJ7yolCy4o'
});

suprsend.web_push.register_push();
suprsend.web_push.notification_permission();

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
