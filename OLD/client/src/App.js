import React, { Fragment } from "react";
import "./App.css";

//components

//import InputItem from "./components/InputItem";
import ListItems from "./components/ListItems";
import ItemRecs from "./components/ItemRecs";
import CreateList from "./components/CreateList";
import ShowLists from "./components/GroceryStoreList";

function App() {
  return (
    <Fragment>
      <div className="container">
        <CreateList />
        <ListItems />
      </div>
    </Fragment>
  );
}

export default App;
