import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import SettingsModal from "./components/SettingsModal";
import ItemRow from "./components/ItemRow";
import DarkModeToggle from "./components/DarkModeToggle";
import "./styles.css";

function App() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showPurchased, setShowPurchased] = useState(false);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showManageLists, setShowManageLists] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [recommendationPeriod, setRecommendationPeriod] = useState(14); // Default to two weeks
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (selectedList) {
      fetchItems();
      fetchRecommendations();
    }
  }, [selectedList]);

  const fetchShoppingLists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shopping-lists`);
      setUserEmail(response.data.userEmail);
      setShoppingLists(response.data.lists);
      if (response.data.lists.length > 0) {
        setSelectedList(response.data.lists[0].id);
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shopping-lists/${selectedList}/items`
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
      const response = await axios.get(`${API_BASE_URL}/purchased-items`);
      setPurchasedItems(response.data);
    } catch (error) {
      console.error("Error fetching purchased items:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/recommendations?period=${recommendationPeriod}`
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
        `${API_BASE_URL}/shopping-lists/${selectedList}/items`,
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
      await axios.post(`${API_BASE_URL}/items/${id}/check`);
      fetchItems();
    } catch (error) {
      console.error("Error checking item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditItem = async (id, name) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/items/${id}`, { name });
      console.log("Item updated:", response.data);
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await axios.delete(`${API_BASE_URL}/shopping-lists/${listId}`);
      const updatedLists = shoppingLists.filter((l) => l.id !== listId);
      setShoppingLists(updatedLists);
      if (selectedList === listId) {
        setSelectedList(updatedLists.length > 0 ? updatedLists[0].id : null);
      }
      if (editingListId === listId) setEditingListId(null);
    } catch (error) {
      console.error("Error deleting shopping list:", error);
    }
  };

  const handleRenameList = async (listId) => {
    if (!editingListName.trim()) {
      setEditingListId(null);
      return;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/shopping-lists/${listId}`, {
        name: editingListName,
      });
      setShoppingLists(shoppingLists.map((l) => (l.id === listId ? response.data : l)));
      setEditingListId(null);
    } catch (error) {
      console.error("Error renaming shopping list:", error);
    }
  };

  const handleCreateShoppingList = async () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (newListName) {
      try {
        const response = await axios.post(`${API_BASE_URL}/shopping-lists`, {
          name: newListName,
        });
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
        `${API_BASE_URL}/shopping-lists/${selectedList}/items`,
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

  const categorizedItems = items.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="app">
      <h1>Next Aisle</h1>
      <button className="settings-button" onClick={handleSettingsToggle}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      <DarkModeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
      <SettingsModal
        showSettings={showSettings}
        userEmail={userEmail}
        handleSettingsToggle={handleSettingsToggle}
        recommendationPeriod={recommendationPeriod}
        handleRecommendationPeriodChange={handleRecommendationPeriodChange}
        showPurchased={showPurchased}
        setShowPurchased={setShowPurchased}
        fetchPurchasedItems={fetchPurchasedItems}
        purchasedItems={purchasedItems}
      />
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
                  className="input-field"
                />
              </label>
            </form>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="input-field"
          style={{ fontSize: "16px" }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
      </form>
      <div className="shopping-lists">
        <button onClick={handleCreateShoppingList}>+</button>
        <button className="manage-lists-btn" onClick={() => setShowManageLists(true)}>
          <FontAwesomeIcon icon={faPen} />
        </button>
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
      {showManageLists && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => { setShowManageLists(false); setEditingListId(null); }}>
              ✖
            </button>
            <h2>Manage Lists</h2>
            {shoppingLists.map((list) => (
              <div key={list.id} className="manage-list-row">
                {editingListId === list.id ? (
                  <input
                    className="input-field manage-list-input"
                    type="text"
                    value={editingListName}
                    onChange={(e) => setEditingListName(e.target.value)}
                    onBlur={() => handleRenameList(list.id)}
                    onKeyPress={(e) => e.key === "Enter" && handleRenameList(list.id)}
                    autoFocus
                  />
                ) : (
                  <span
                    className="manage-list-name"
                    onClick={() => { setEditingListId(list.id); setEditingListName(list.name); }}
                  >
                    {list.name}
                  </span>
                )}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="item-list">
        {Object.keys(categorizedItems).map((category) => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            {categorizedItems[category].map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onCheck={handleCheckItem}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="recommendations">
        <h3>Recommendations v1.1</h3>
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
