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
}) =>
  showSettings && (
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
  );

export default SettingsModal;
