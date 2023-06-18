import {React,useContext} from "react";
import SingleChat from "./SingleChat";
import { AuthContext } from "../context/context";

// const ChatContainer = ({ fetchAgain, setFetchAgain }) => {
const ChatContainer = ({  fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(AuthContext);

  return (
    <div
      style={{
        display:  "flex",
        // display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "5px",
        backgroundColor: "white",
        width: "66%",
        border: "1px solid lightgrey",
        borderRadius: "12px",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatContainer;
