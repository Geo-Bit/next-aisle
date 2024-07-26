import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ItemRow = ({ item, onCheck, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(item.id, editedName);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="item-row">
      {isEditing ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleSave}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      ) : (
        <span onClick={handleEdit}>{item.name}</span>
      )}
      <div className="item-buttons">
        <button className="check-button" onClick={() => onCheck(item.id)}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button className="delete-button" onClick={() => onDelete(item.id)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </div>
  );
};

export default ItemRow;
