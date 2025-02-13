import React from "react";

function TopSearch({ children }) {
  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "20px 0px",
      }}
    >
      {children}
    </div>
  );
}

export default TopSearch;
