import React, { useState, useContext } from "react";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import { AuthContext } from "../context/context";
import { toast } from "react-toastify";

const UpdateGroupChatModel = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only Admin Have Permission To Remove User");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.patch(
        `${process.env.REACT_APP_URL}/chat/removeFromGroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const { data } = await axios.patch(
        `${process.env.REACT_APP_URL}/chat/renameGroup`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already In Group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Ony Admin Can Add Users");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.patch(
        `${process.env.REACT_APP_URL}/chat/addUserToGroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <button
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        View
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            zIndex: "5",
            // flexDirection:'column',
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              width: "50vw",
              // minHeight: "70vh",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                // alignItems: "center",
                justifyContent: "center",
                position: "relative",
                // border:'5px solid'
                padding:'5px 0'
              }}
            >
              <h3
                style={{
                  fontSize: "35px",
                  // textAlign: "center",
                }}
              >
                {selectedChat.chatName}
              </h3>

              <button
                style={{
                  position: "absolute",
                  right: "5px",
                  // top:'10px',
                  backgroundColor: "black",
                  color: "#fff",
                  fontWeight:'bolder',
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                X
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent:'center'
                // fontFamily: "Poppins",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent:'center',
                  flexWrap: "wrap",
                  paddingBottom: "15px",
                }}
              >
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection:'column', width:'80%', alignItems:'center' }}>
                <input
                className="input"
                  placeholder="Chat Name"
                  style={{ marginBottom: "15px",width:'100%' }}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
             
                <button
                className="btn"
                  style={{ marginLeft: "10px", marginBottom:'25px' }}
                  disabled={renameloading}
                  onClick={handleRename}
                >
                  Update
                </button>
                <input
                className="input"
                  placeholder="Add User to group"
                  style={{ marginBottom: "10px" ,width:'100%'}}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              
                </div>

              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            
              <button
                className="btn"
                onClick={() => handleRemove(user)}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModel;
