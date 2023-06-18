
import { useContext, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import MyChats from "../components/MyChats";
import { AuthContext } from "../context/context";
import SideBar from "../components/sidebar";
const Chatpage = () => {
  const { user } = useContext(AuthContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "92.5vh",
          padding: "10px",
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatContainer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>
    </div>
  );
};

export default Chatpage;
