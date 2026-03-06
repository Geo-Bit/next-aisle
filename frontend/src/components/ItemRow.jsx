import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ItemRow = ({ item, onCheck, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);

  const handleSave = () => {
    onEdit(item.id, editedName);
    setIsEditing(false);
  };

  return (
    <div className="item-row">
      {isEditing ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleSave}
          onKeyPress={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
      ) : (
        <>
          <div onClick={() => setIsEditing(true)}>{item.name}</div>
          <div className="item-buttons">
            <button className="check-button" onClick={() => onCheck(item.id)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button className="delete-button" onClick={() => onDelete(item.id)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemRow;
