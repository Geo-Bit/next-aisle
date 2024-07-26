import React from "react";

const ShoppingList = ({
  shoppingLists,
  selectedList,
  setSelectedList,
  handleCreateShoppingList,
}) => (
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
);

export default ShoppingList;
