import React, { Fragment } from "react";
import "./App.css";

//components

//import InputItem from "./components/InputItem";
import ListItems from "./components/ListItems";
import ItemRecs from "./components/ItemRecs";
import CreateList from "./components/CreateList";

function App() {
  return (
    <Fragment>
      <div className="container">
        <ListItems />
      </div>
    </Fragment>
  );
}

export default App;
