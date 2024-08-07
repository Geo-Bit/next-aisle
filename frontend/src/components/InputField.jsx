import React, { useState, useEffect } from "react";
import axios from "axios";

function InputField() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("https://localhost:4000/api/items");
      const sortedItems = response.data.sort((a, b) =>
        a.category.localeCompare(b.category)
      );
      setItems(sortedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:4000/api/items", {
        name: item,
      });
      console.log("Item added:", response.data);
      setItem("");
      fetchItems(); // Refresh the item list
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
          font-size="16px"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
      </form>
      <table className="item-table">
        <thead>
          <tr>
            <th>Shopping Item</th>
            <th>Aisle</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InputField;
