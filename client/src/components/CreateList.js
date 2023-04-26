import React, { Fragment, useState } from "react";

const CreateList = () => {
  const [listName, setListName] = useState("");

  const onSubmitForm = async (e, description) => {
    CreateList.e.preventDefault();
    // try {
    //   const response = await fetch(
    //     `https://api.spoonacular.com/food/ingredients/autocomplete?query=${description}&number=1&metaInformation=true`,
    //     {
    //       headers: { "x-api-key": process.env.REACT_APP_API_KEY },
    //     }
    //   );

    //   var aisle = "";
    //   const jsonData = await response.json();
    //   if (jsonData.length > 0) {
    //     aisle = jsonData[0].aisle;
    //   }
    // } catch (error) {
    //   console.error(error.message);
    // }

    // try {
    //   const body = { description: description, aisle: aisle };
    //   const response = await fetch("http://10.0.1.63:5000/items", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });

    //   //window.location = "/"; //once a response has been sent, the page will refresh
    // } catch (error) {
    //   console.error(error.message);
    // }
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
              <h5 class="modal-title" id="exampleModalLabel">
                Modal title
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
                className="form-control"
                //value={description}
                //onChange={(e) => setListName(e.target.value)}
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
              <button type="button" class="btn btn-primary">
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
