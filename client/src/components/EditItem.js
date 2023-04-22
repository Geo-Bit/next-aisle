import React, { Fragment, useState } from "react";

const EditItem = ({ item }) => {
  const [description, setDescription] = useState(item.description);

  //edit description function

  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      const body = { description };
      const response = await fetch(
        `http://10.0.1.63:5000/items/${item.item_id}`,
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
        Edit
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
