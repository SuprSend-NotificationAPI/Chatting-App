const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: "#E8E8E8",
        padding: "0.5em",
        marginBottom: "0.5em",
        borderRadius: "0.5em",
        color: "black",
        width: "45%",
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "rgba(67, 43, 255, 0.8)";
        e.target.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#E8E8E8";
        e.target.style.color = "black";
      }}
    >
      <div>
        <div>{user.name}</div>
        <div style={{ fontSize: "0.75em" }}>
          <b>Email : </b>
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
