import React, { useState, useEffect } from "react";
import axios from "axios";
import DarkModeToggle from "./components/DarkModeToggle";
import "./styles.css";

function App() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showPurchased, setShowPurchased] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/items");
      const sortedItems = response.data.sort((a, b) =>
        a.category.localeCompare(b.category)
      );
      setItems(sortedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchPurchasedItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/purchased-items"
      );
      setPurchasedItems(response.data);
    } catch (error) {
      console.error("Error fetching purchased items:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/items", {
        name: item,
      });
      console.log("Item added:", response.data);
      setItem("");
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCheckItem = async (id) => {
    try {
      await axios.post(`http://localhost:4000/api/items/${id}/check`);
      fetchItems();
    } catch (error) {
      console.error("Error checking item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="app">
      <DarkModeToggle darkMode={darkMode} onToggle={handleToggleDarkMode} />
      <button
        className="show-purchased-button"
        onClick={() => {
          setShowPurchased(!showPurchased);
          if (!showPurchased) {
            fetchPurchasedItems();
          }
        }}
      >
        {showPurchased ? "Hide Purchased Items" : "Show Purchased Items"}
      </button>
      {showPurchased && (
        <table className="purchased-item-table">
          <thead>
            <tr>
              <th>Shopping Item</th>
              <th>Aisle</th>
              <th>Purchased At</th>
            </tr>
          </thead>
          <tbody>
            {purchasedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{new Date(item.purchasedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
      <table className="item-table">
        <thead>
          <tr>
            <th>Shopping Item</th>
            <th>Aisle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => handleCheckItem(item.id)}>✔️</button>
                <button onClick={() => handleDeleteItem(item.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
