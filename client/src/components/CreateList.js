import React, { Fragment, useState } from "react";

const CreateList = () => {
  const [listName, setListName] = useState("");

  const createList = async (e) => {
    e.preventDefault();
    try {
      const body = { listName: listName };
      const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_IP}:3000/lists`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      window.location = "/"; //once a response has been sent, the page will refresh
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        +
      </button>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-dark" id="exampleModalLabel">
                Create New List
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input
                type="text"
                placeholder="enter list name"
                className="form-control"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              ></input>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={createList}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateList;
