import React from "react";

const SignOutButton = ({ onSignOut }) => {
  return <button className="signout-btn" onClick={onSignOut}>Sign Out</button>;
};

export default SignOutButton;
