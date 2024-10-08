import React from "react";

const SettingsModal = ({
  showSettings,
  handleSettingsToggle,
  recommendationPeriod,
  handleRecommendationPeriodChange,
  showPurchased,
  setShowPurchased,
  fetchPurchasedItems,
  purchasedItems,
  userEmail,
}) =>
  showSettings && (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={handleSettingsToggle}>
          ✖
        </button>
        <h2>Settings</h2>
        <p>User: {userEmail}</p>
        <label>
          Recommendation Period (days):
          <input
            type="number"
            value={recommendationPeriod}
            onChange={handleRecommendationPeriodChange}
            className="input-field"
          />
        </label>
        <div>
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
        </div>
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
  );

export default SettingsModal;
