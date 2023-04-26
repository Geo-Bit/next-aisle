import React, { Fragment, useEffect, useState } from "react";

import EditItem from "./EditItem";
import ItemRecs from "./ItemRecs";

const ListItems = () => {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  //const [lists, setLists] = useState([]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    var customExclusions = ["sm", "lg"];
    // get item description
    try {
      // remove special characters and numbers from description
      var strippedDescription = description.replace(/[^a-zA-Z ]+/g, "");
      // convert string to all lowercase
      strippedDescription = strippedDescription.toLowerCase();
      // remove exclusions
      customExclusions.forEach((excl) => {
        console.log(excl);
        var regex = `^${excl} `;
        regex = new RegExp(regex, "g");
        strippedDescription = strippedDescription.replace(regex, "");
      });

      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${strippedDescription}&number=1&metaInformation=true`,
        {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        }
      );

      var aisle = "";
      const jsonData = await response.json();
      if (jsonData.length > 0) {
        aisle = jsonData[0].aisle;
      }
    } catch (error) {
      console.error(error.message);
    }

    try {
      const body = { description: description, aisle: aisle };
      const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      getItems(); //refresh the component instead of refreshing the whole page
      //window.location = "/"; //once a response has been sent, the page will refresh
      setDescription("");
    } catch (error) {
      console.error(error.message);
    }
  };

  // const getLists = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://${process.env.REACT_APP_SERVER_IP}:5000/lists`
  //     );
  //     const jsonData = await response.json();
  //     console.log(jsonData);
  //     setLists(jsonData);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  //delete item function
  const deleteItem = async (id) => {
    try {
      const deleteItem = await fetch(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/items/${id}`,
        {
          method: "DELETE",
        }
      );

      setItems(items.filter((item) => item.item_id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  //purchase an item
  const purchaseItem = async (description, id) => {
    try {
      const body = { description: description };

      const purchaseItem = await fetch(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/purchased`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      await deleteItem(id);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getItems = async () => {
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/items`
      );
      const jsonData = await response.json();
      var sorted_items = sortItems(jsonData);
      console.log(sorted_items);
      setItems(sorted_items);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getItems();
    //getLists();
  }, []);

  const sortItems = (grocery_items) => {
    var sorted_items = grocery_items.sort((a, b) => {
      if (a.aisle < b.aisle) {
        return -1;
      }
      if (a.aisle > b.aisle) {
        return 1;
      }
      return 0;
    });
    return sorted_items;
  };
  return (
    <Fragment>
      {" "}
      <h1 className="text-center mt-5">Grocery List</h1>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
      <ItemRecs getItems={getItems} />
      {/* <ul class="nav nav-tabs">
        {lists.map((list) => (
          <ul class="nav nav-tabs" key={list.list_id}>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                {list.list_name}
              </a>
            </li>
          </ul>
        ))}
      </ul> */}
      <table className="table-responsive-sm -sm mt-5 text-center">
        <thead>
          <tr>
            <th className=""></th>
            <th className="pl-5"></th>
            <th className="px-5"></th>
            <th className="px-5"></th>
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
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => purchaseItem(item.description, item.item_id)}
                >
                  ✓
                </button>
              </td>
              <td className="">{item.description}</td>
              <td className="pl-4">{item.aisle}</td>
              <td className="pl-4">
                <EditItem item={item} />
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteItem(item.item_id)}
                >
                  D
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
