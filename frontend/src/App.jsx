import React, { useState, useEffect } from "react";
import axios from "axios";
import DarkModeToggle from "./components/DarkModeToggle";
import "./styles.css";

function App() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [showPurchased, setShowPurchased] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemName, setEditedItemName] = useState("");
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      fetchItems();
    }
  }, [selectedList]);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const fetchShoppingLists = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/shopping-lists"
      );
      setShoppingLists(response.data);
      if (response.data.length > 0) {
        setSelectedList(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/items", {
        params: { shoppingListId: selectedList },
      });
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
        shoppingListId: selectedList,
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

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditedItemName(item.name);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/items/${editingItem.id}`,
        {
          name: editedItemName,
        }
      );
      console.log("Item updated:", response.data);
      setEditingItem(null);
      setEditedItemName("");
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditedItemName("");
  };

  const handleCreateShoppingList = async () => {
    const name = prompt("Enter the name of the new shopping list:");
    if (name) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/shopping-lists",
          { name }
        );
        setShoppingLists([...shoppingLists, response.data]);
        setSelectedList(response.data.id);
      } catch (error) {
        console.error("Error creating shopping list:", error);
      }
    }
  };

  return (
    <div className="app">
      <DarkModeToggle darkMode={darkMode} onToggle={handleToggleDarkMode} />
      <div className="shopping-lists">
        {shoppingLists.length > 0 ? (
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
          >
            {shoppingLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        ) : (
          <button onClick={handleCreateShoppingList}>
            + Create Shopping List
          </button>
        )}
      </div>
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
      {editingItem && (
        <form onSubmit={handleUpdateItem} className="input-form">
          <input
            type="text"
            placeholder="Edit grocery item"
            value={editedItemName}
            onChange={(e) => setEditedItemName(e.target.value)}
            className="input-field"
          />
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </form>
      )}
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
                <button onClick={() => handleEditItem(item)}>✏️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
