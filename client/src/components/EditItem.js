import React, { Fragment, useState } from "react";

const EditItem = ({ item }) => {
  const [description, setDescription] = useState(item.description);
  const [aisle] = useState(item.aisle);

  //edit description function

  const updateDescription = async (e) => {
    e.preventDefault();
    var strippedDescription = description.replace(/[^a-zA-Z ]+/g, "");
    var customExclusions = ["sm", "lg"];
    var currentAisle = aisle;
    // get aisle for new description
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

      var newAisle = "";
      const jsonData = await response.json();
      if (jsonData.length > 0) {
        newAisle = jsonData[0].aisle;
      }
    } catch (error) {
      console.error(error.message);
    }

    // if aisle is different
    if (aisle != newAisle) {
      // update aisle
      currentAisle = newAisle;
    }

    try {
      const body = { description: description, aisle: currentAisle };
      console.log(body);
      const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/items/${item.item_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      window.location = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-warning btn-sm"
        data-toggle="modal"
        data-target={`#id${item.item_id}`}
      >
        E
      </button>

      <div
        class="modal"
        id={`id${item.item_id}`}
        onClick={() => setDescription(item.description)}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                onClick={() => setDescription(item.description)}
              >
                &times;
              </button>
            </div>

            <div class="modal-body">
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning btn-sm"
                data-dismiss="modal"
                onClick={(e) => updateDescription(e)}
              >
                Save
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                data-dismiss="modal"
                onClick={() => setDescription(item.description)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditItem;
