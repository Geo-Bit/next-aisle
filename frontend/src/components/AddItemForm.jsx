import React from "react";

const AddItemForm = ({ item, setItem, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="input-form">
    <input
      type="text"
      placeholder="Enter grocery item"
      value={item}
      onChange={(e) => setItem(e.target.value)}
      className="input-field"
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      }}
    />
  </form>
);

export default AddItemForm;
