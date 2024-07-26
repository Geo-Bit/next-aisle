import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import ShoppingList from "./components/ShoppingList";
import ItemRow from "./components/ItemRow";
import SettingsModal from "./components/SettingsModal";
import AddItemForm from "./components/AddItemForm";
import Recommendations from "./components/Recommendations";
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

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
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

  const handleUpdateItem = async (id, name) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/items/${id}`, {
        name,
      });
      console.log("Item updated:", response.data);
      setEditingItem(null);
      setEditedItemName("");
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleItemNameChange = (e) => {
    setEditedItemName(e.target.value);
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

  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="app">
      <button className="settings-button" onClick={handleSettingsToggle}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      <SettingsModal
        showSettings={showSettings}
        handleSettingsToggle={handleSettingsToggle}
        recommendationPeriod={recommendationPeriod}
        handleRecommendationPeriodChange={handleRecommendationPeriodChange}
        showPurchased={showPurchased}
        setShowPurchased={setShowPurchased}
        fetchPurchasedItems={fetchPurchasedItems}
        purchasedItems={purchasedItems}
      />
      <ShoppingList
        shoppingLists={shoppingLists}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        handleCreateShoppingList={handleCreateShoppingList}
      />
      <AddItemForm item={item} setItem={setItem} handleSubmit={handleSubmit} />
      <div className="item-list">
        {Object.keys(groupedItems).map((category) => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            {groupedItems[category].map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                editingItem={editingItem}
                editedItemName={editedItemName}
                handleEditItem={handleEditItem}
                handleItemNameChange={handleItemNameChange}
                handleUpdateItem={handleUpdateItem}
                handleCheckItem={handleCheckItem}
                handleDeleteItem={handleDeleteItem}
              />
            ))}
          </div>
        ))}
      </div>
      <Recommendations
        recommendations={recommendations}
        handleAddRecommendedItem={handleAddRecommendedItem}
      />
    </div>
  );
}

export default App;
