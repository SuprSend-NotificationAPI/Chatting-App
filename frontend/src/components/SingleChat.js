import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../config/chat";
import ScrollableChat from "./ScrollableChat";
import { AuthContext } from "../context/context";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import io from "socket.io-client";
import emojiIcon from "./smileyEmoji.svg";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import suprsend from "@suprsend/web-sdk";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBox, setShowEmojiBox] = useState(false);

  const { user, notification, setNotification, selectedChat, setSelectedChat } =
    useContext(AuthContext);
  const fetchMessages = async () => {
    if (!selectedChat) {
      console.log("no selected chat");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessages(data);
      setLoading(false);
      // console.log("User joined" + selectedChat._id);
      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter"&& newMessage) {
      socket.emit("stop-typing", selectedChat._id);
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_URL}/message`,
          {
            message: newMessage,
            chatId: selectedChat,
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setNewMessage("");
        setShowEmojiBox(false);
        socket.emit("new-message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error(error);
      }
    }
  };

  useEffect(() => {
    socket = io(`${process.env.REACT_APP_URL}`);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message-received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
        suprsend.track("NEW_MSG");
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat !== undefined ? (
        <>
          <div
            style={{
              fontSize: "20px",
              padding: "10px 15px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setSelectedChat(undefined)}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Back
            </button>
            {!selectedChat.isGroupChat ? (
              <div style={{ fontSize: "25px", marginRight: "10px" }}>
                {getSender(user, selectedChat.users)}
              </div>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "15px",
              backgroundColor: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <div
                style={{
                  alignSelf: "center",
                  margin: "auto",
                }}
              >
                Loading...
              </div>
            ) : (
              <div
                className="message"
                style={{ maxHeight: "90%", overflowY: "auto" }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div
              style={{
                height: "10%",
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {isTyping && selectedChat.isGroupChat ? (
                <div>{getSender(user, selectedChat.users)} is typing ...</div>
              ) : isTyping ? (
                <div>Typing ...</div>
              ) : (
                <></>
              )}
              <div
                style={{
                  width: "63%",
                  margin:'auto',
                  position: "fixed",
                  bottom: "30px",
                  border: "1px solid white",
                  border:'none',
                  backgroundColor:'white',
                  borderRadius:'10px',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#E0E0E0",
                }}
              >
                <img
                  src={emojiIcon}
                  alt="emojiIcon"
                  height="20px"
                  width="20px"
                  style={{ filter: "contrast(0.3)", marginRight: "5px" }}
                  onClick={() => setShowEmojiBox(!showEmojiBox)}
                />
                {showEmojiBox && (
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      bottom: "45px",
                      zIndex: "1",
                    }}
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) =>
                        setNewMessage(newMessage.concat(emoji.native))
                      }
                    />
                  </div>
                )}
                <input
                  style={{
                  
                    width: "95%",
                    backgroundColor:'white',
                    border: "none",
                    borderRadius: "5px",
                    outline: "none",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onKeyDown={sendMessage}
                  onChange={typingHandler}
                />
               
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <p
            style={{
              fontSize: "30px",
              paddingBottom: "15px",
            }}
          >
            Click On A User to Start Conversation
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
