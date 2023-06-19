 const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '0.2em 0.4em',
          margin: '0.2em',
          marginBottom: '0.4em',
          fontSize: '12px',
          borderRadius: '0.5em',
          cursor: 'pointer',
          backgroundColor: 'purple',
          color: 'white',
        }}
        onClick={handleFunction}
      >
        {user.name}
        {admin === user._id && <span> (Admin)</span>}
        <span style={{paddingLeft: '0.4em', fontWeight:'900'}}>X</span>
      </span>
    );
  };
  
  export default UserBadgeItem;
  