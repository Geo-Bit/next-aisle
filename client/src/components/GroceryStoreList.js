import React, { useState, useEffect } from "react";

// Your function to fetch JSON data
const getLists = async () => {
  let jsonData = "";
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_SERVER_IP}:3000/lists`
    );
    jsonData = await response.json();
    console.log(jsonData);
  } catch (error) {
    console.error(error.message);
  }
  return jsonData;
};

const GroceryStoreList = () => {
  const [groceryStores, setGroceryStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLists();
      setGroceryStores(data);
    };
    fetchData();
  }, []);

  const handleStoreClick = (store) => {
    setSelectedStore(store.list_id);
    console.log(store.list_name);
  };

  return (
    <div className="grocery-store-list">
      {groceryStores.map((store) => (
        <div
          key={store.list_id}
          className={`grocery-store-item ${
            selectedStore === store.list_id ? "selected" : ""
          }`}
          onClick={() => handleStoreClick(store)}
        >
          {store.list_name}
        </div>
      ))}
    </div>
  );
};

export default GroceryStoreList;
