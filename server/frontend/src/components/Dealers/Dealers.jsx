import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  let dealer_url = "/djangoapp/get_dealers";
  
  const filterDealers = async (state) => {
    let url = state === "All" ? dealer_url : `/djangoapp/get_dealers/${state}`;
    const res = await fetch(url, {
      method: 'GET'
    });
    const retobj = await res.json();
    if (retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers);
      setDealersList(state_dealers);
    }
  };

  const get_dealers = async () => {
    const res = await fetch(dealer_url, {
      method: 'GET'
    });
    const retobj = await res.json();
    
    let all_dealers = [];
    if (retobj.status === 200 && Array.isArray(retobj.dealers)) {
      all_dealers = retobj.dealers;
    } else if (Array.isArray(retobj)) {
      all_dealers = retobj;
    }

    if (all_dealers.length > 0) {
      let state_list = [];
      all_dealers.forEach((dealer) => {
        if (dealer.state && !state_list.includes(dealer.state)) {
          state_list.push(dealer.state);
        }
      });
      setDealersList(all_dealers);
      setStates(state_list.sort());
    }
  };

  useEffect(() => {
    get_dealers();
  }, []);

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return(
    <div>
      <Header/>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                <option value="All">All States</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </th>
            {isLoggedIn ? (
              <th>Review Dealer</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td><a href={'/dealer/' + dealer.id}>{dealer.full_name}</a></td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn ? (
                <td><a href={`/postreview/${dealer.id}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;