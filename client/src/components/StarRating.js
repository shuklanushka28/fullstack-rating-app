import React from "react";

const StarRating = ({ value, onChange }) => {
  const handleClick = (newValue) => {
    onChange(newValue);
  };

  return (
    <div style={{ display: "flex", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          style={{
            color: star <= value ? "gold" : "#ccc",
            fontSize: "20px",
            marginRight: "5px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
