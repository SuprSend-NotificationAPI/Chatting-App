import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserListItem from "./UserListItem";
import { AuthContext } from "../context/context";
import { getSender } from "../config/chat";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = useContext(AuthContext);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/register");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please Provide username");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/auth/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/chat`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 15px",
          alignItems: "center",
          backgroundColor: "#333",
          color: "#fff",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            backgroundColor: "#008CBA",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Search User
        </button>
        <h2>Chat app</h2>
        <div>
          {/* <button onClick={() => setOpen(true)}>Notification</button> */}
          <button
            onClick={logoutHandler}
            style={{
              backgroundColor: "#008CBA",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            left: "0",
            backgroundColor: "#030303c2",
            color: "white",
            height: "70vh",
            width: "35%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // justifyContent:'center',
            padding: "10px",
          }}
        >
          <h2>Search Users</h2>
          {/* <div> */}
          <input
            className="input"
            style={{ width: "100%" }}
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" onClick={handleSearch}>
            Go
          </button>
          {/* </div> */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            searchResult?.map((user) => (
              <div
                key={user._id}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid black",
                  borderRadius: "12px",
                  textAlign:'center',
                  padding:'10px',
                  fontWeight:'bolder',
                  color:'black',
                  
                }}
                onClick={() => accessChat(user._id)}
              >
                {user.name}
              </div>
            ))
          )}
          {loadingChat && <p>Loading Chat...</p>}
        </div>
      )}
    </>
  );
};

export default SideBar;
