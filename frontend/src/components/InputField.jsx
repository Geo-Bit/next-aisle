import React, { useState } from "react";
import axios from "axios";

function InputField() {
  const [item, setItem] = useState("");
  const [aisle, setAisle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/items", {
        name: item,
      });
      console.log("Item added:", response.data);
      setAisle(response.data.category);
      setItem("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Enter grocery item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Add Item
        </button>
      </form>
      {aisle && <p>Aisle: {aisle}</p>}
    </div>
  );
}

export default InputField;
