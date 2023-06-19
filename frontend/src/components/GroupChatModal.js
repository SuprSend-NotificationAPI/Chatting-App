import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/context";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import { toast } from "react-toastify";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats, user } = useContext(AuthContext);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_URL}/auth/users?search=${search}`,{
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User Already Added!");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please Fill Up All The Fields");
      return;
    }

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_URL}/chat/createGroup`, {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      },{
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats([data, ...chats]);
      setIsOpen(false);
      toast.success("Successfully Created New Group");
    } catch (error) {
      toast.error("Failed To Create Group.");
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "5",
            backgroundColor: "#958c8c94",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>Create Group Chat</h2>
          <div>
            <button
              className="btn"
              style={{ position: "fixed", top: "10px", right: "10px" }}
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "10px",
              overflowY:'scroll'
            }}
          >
            <input
              style={{ margin: "10px" }}
              className="input"
              placeholder="Group Name"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <input
              style={{ margin: "10px" }}
              className="input"
              placeholder="Add Users:"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </div>
          <button className="btn" onClick={handleSubmit}>
            Create Chat
          </button>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
