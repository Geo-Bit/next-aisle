import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

function App() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showPurchased, setShowPurchased] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemName, setEditedItemName] = useState("");
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [recommendationPeriod, setRecommendationPeriod] = useState(14); // Default to two weeks
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://10.0.1.162:4000";

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      fetchItems();
      fetchRecommendations();
    }
  }, [selectedList]);

  const fetchShoppingLists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shopping-lists`);
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
      const response = await axios.get(
        `${API_BASE_URL}/api/shopping-lists/${selectedList}/items`
      );
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
      const response = await axios.get(`${API_BASE_URL}/api/purchased-items`);
      setPurchasedItems(response.data);
    } catch (error) {
      console.error("Error fetching purchased items:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/recommendations?period=${recommendationPeriod}`
      );
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedList) {
      alert("Please select a shopping list first.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/shopping-lists/${selectedList}/items`,
        {
          name: item,
        }
      );
      console.log("Item added:", response.data);
      setItem("");
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleCheckItem = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/items/${id}/check`);
      fetchItems();
    } catch (error) {
      console.error("Error checking item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditedItemName(item.name);
  };

  const handleUpdateItem = async (id, newName) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/items/${id}`, {
        name: newName,
      });
      console.log("Item updated:", response.data);
      setEditingItem(null);
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCreateShoppingList = async () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (newListName) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/shopping-lists`,
          { name: newListName }
        );
        setShoppingLists([...shoppingLists, response.data]);
        setSelectedList(response.data.id);
        setNewListName("");
        setShowModal(false);
      } catch (error) {
        console.error("Error creating shopping list:", error);
      }
    }
  };

  const handleAddRecommendedItem = async (itemName) => {
    if (!selectedList) {
      alert("Please select a shopping list first.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/shopping-lists/${selectedList}/items`,
        {
          name: itemName,
        }
      );
      console.log("Recommended item added:", response.data);
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error adding recommended item:", error);
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleRecommendationPeriodChange = (e) => {
    setRecommendationPeriod(e.target.value);
    fetchRecommendations();
  };

  const handleItemNameChange = (e) => {
    setEditedItemName(e.target.value);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="app">
      <button className="settings-button" onClick={handleSettingsToggle}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      {showSettings && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={handleSettingsToggle}>
              ✖
            </button>
            <h2>Settings</h2>
            <label>
              Recommendation Period (days):
              <input
                type="number"
                value={recommendationPeriod}
                onChange={handleRecommendationPeriodChange}
              />
            </label>
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
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <form onSubmit={handleModalSubmit}>
              <label>
                New Shopping List Name:
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleModalSubmit(e);
                    }
                  }}
                />
              </label>
            </form>
          </div>
        </div>
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
      <div className="shopping-lists">
        <button onClick={handleCreateShoppingList}>+</button>
        {shoppingLists.map((list) => (
          <button
            key={list.id}
            className={selectedList === list.id ? "selected" : ""}
            onClick={() => setSelectedList(list.id)}
          >
            {list.name}
          </button>
        ))}
      </div>
      <div className="item-list">
        {Object.keys(groupedItems).map((category) => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            {groupedItems[category].map((item) => (
              <div
                key={item.id}
                className="item-row"
                onClick={() => handleEditItem(item)}
              >
                {editingItem && editingItem.id === item.id ? (
                  <input
                    type="text"
                    value={editedItemName}
                    onChange={handleItemNameChange}
                    onBlur={() => handleUpdateItem(item.id, editedItemName)}
                  />
                ) : (
                  <>
                    <span>{item.name}</span>
                    <div className="item-buttons">
                      <button
                        className="check-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckItem(item.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="recommendations">
        <h3>Recommendations</h3>
        <div className="recommendation-buttons">
          {recommendations.map((item, index) => (
            <button
              key={index}
              className="recommendation-button"
              onClick={() => handleAddRecommendedItem(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
