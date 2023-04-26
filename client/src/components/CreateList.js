import React, { Fragment, useState } from "react";

const CreateList = () => {
  const [description, setDescription] = useState("");

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
      <button className="btn btn-success pull-left" data-toggle="modal">
        +
      </button>
      <div
        class="modal"
        // id={`id${item.item_id}`}
        // onClick={() => setDescription(item.description)}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                // onClick={() => setDescription(item.description)}
              >
                &times;
              </button>
            </div>

            <div class="modal-body">
              <input
                type="text"
                className="form-control"
                //value={description}
                //onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning btn-sm"
                data-dismiss="modal"
                //onClick={(e) => updateDescription(e)}
              >
                Save
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                data-dismiss="modal"
                //onClick={() => setDescription(item.description)}
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

export default CreateList;
