import React from "react";

const Recommendations = ({ recommendations, handleAddRecommendedItem }) => (
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
);

export default Recommendations;
