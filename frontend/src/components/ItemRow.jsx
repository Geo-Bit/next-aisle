import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ItemRow = ({ item, onCheck, onDelete, onEdit, onEditCategory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editedCategory, setEditedCategory] = useState(item.category);

  const handleSave = () => {
    onEdit(item.id, editedName);
    setIsEditing(false);
  };

  const handleSaveCategory = () => {
    if (editedCategory !== item.category) {
      onEditCategory(item.id, editedCategory);
    }
    setIsEditingCategory(false);
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
          <div className="item-info">
            <div onClick={() => setIsEditing(true)}>{item.name}</div>
            {isEditingCategory ? (
              <input
                type="text"
                className="category-edit"
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                onBlur={handleSaveCategory}
                onKeyPress={(e) => e.key === "Enter" && handleSaveCategory()}
                autoFocus
              />
            ) : (
              <span className="item-category" onClick={() => setIsEditingCategory(true)}>
                {item.category || "Uncategorized"}
              </span>
            )}
          </div>
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
