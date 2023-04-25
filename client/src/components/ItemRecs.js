import React, { Fragment, useEffect, useState } from "react";
import ListItems from "./ListItems";

const ItemRecs = () => {
  const [items, purchaseRecs] = useState([]);
  const [description, setDescription] = useState("");

  const getPurchaseHistory = async () => {
    try {
      console.log("going");
      const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/purchased`
      );
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error.message);
    }
  };

  const setItemRecs = async () => {
    const purchaseHistory = await getPurchaseHistory();
    const consecutiveWeeks = 2;
    const dayCount = consecutiveWeeks * 7 + 7;
    const todaysDate = new Date();
    var recs = [];
    var frequency = 2;
    //recommendation criteria
    //items purchased two weeks in a row
    //get a list of unique items from purchase history
    var uniquePurchaseItems = purchaseHistory.filter(
      (o, i) =>
        i ===
        purchaseHistory.findIndex((oo) => o.description === oo.description)
    );
    //for each unique purchased item
    uniquePurchaseItems.forEach((item) => {
      var occurence = 0;
      //get purchase dates of that item
      const occurenceDates = purchaseHistory.filter(function (i) {
        return i.description == item.description;
      });
      //For each purchase date
      occurenceDates.forEach((occurenceDate) => {
        //convert ts (timestamp) to a formal Date object)
        occurenceDate = new Date(occurenceDate["ts"]);
        //get difference in time between those dates (in seconds)
        var Difference_In_Time = todaysDate.getTime() - occurenceDate.getTime();
        //covnert seconds to days
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        //if the difference in days is less than our week window
        if (Difference_In_Days < dayCount) {
          //we have a match
          occurence += 1;
        }
      });

      //if the number of occurences in the last X days is >= our frequency
      if (occurence >= frequency) {
        //we have a recommended item
        recs.push(item);
      }
    });
    //return our recommended items
    purchaseRecs(recs);
  };

  useEffect(() => {
    setItemRecs();
  }, []);

  return (
    <Fragment>
      {" "}
      <div className="d-flex align-items-center justify-content-center mt-1">
        {items.map((item) => (
          <div key={item.item_id}>
            <button className="btn mr-1 btn-success btn-sm">
              {item.description}
            </button>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default ItemRecs;
