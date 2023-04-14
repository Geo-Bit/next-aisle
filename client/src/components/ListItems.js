import React, { Fragment, useEffect, useState } from "react";

import EditItem from "./EditItem";

const ListItems = () => {
  const [items, setItems] = useState([]);

  //delete item function
  const deleteItem = async (id) => {
    try {
      const deleteItem = await fetch(`http://localhost:5000/items/${id}`, {
        method: "DELETE",
      });

      setItems(items.filter((item) => item.item_id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const getItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/items");
      const jsonData = await response.json();

      setItems(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getItems();
  }, []);

  return (
    <Fragment>
      {" "}
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {/*<tr>
                <td>John</td>
                <td>Doe</td>
                <td>john@example.com</td>
            </tr>*/}
          {items.map((item) => (
            <tr key={item.item_id}>
              <td>{item.description}</td>
              <td>
                <EditItem item={item} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteItem(item.item_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListItems;
