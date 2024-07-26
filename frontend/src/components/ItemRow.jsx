import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ItemRow = ({
  item,
  editingItem,
  editedItemName,
  handleEditItem,
  handleItemNameChange,
  handleUpdateItem,
  handleCheckItem,
  handleDeleteItem,
}) => (
  <div key={item.id} className="item-row" onClick={() => handleEditItem(item)}>
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
);

export default ItemRow;
