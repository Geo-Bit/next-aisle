import React, { Fragment, useState } from "react";

const InputItem = () => {
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${description}&number=1&metaInformation=true`,
        {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        }
      );

      var aisle = "";
      const jsonData = await response.json();
      if (jsonData.length > 0) {
        aisle = jsonData[0].aisle;
        console.log(aisle);
      }
    } catch (error) {
      console.error(error.message);
    }

    try {
      const body = { description: description, aisle: aisle };
      const response = await fetch("http://localhost:5000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.location = "/"; //once a response has been sent, the page will refresh
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Shopping List</h1>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-success">Add</button>
      </form>
    </Fragment>
  );
};

export default InputItem;
