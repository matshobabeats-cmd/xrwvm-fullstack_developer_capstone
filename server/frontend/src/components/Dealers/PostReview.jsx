import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [date, setDate] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const curr_url = window.location.href;
  const root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  const { id } = useParams();

  const user_name = sessionStorage.getItem("username") || "admin";

  const post_review = async () => {
    let name = user_name;
    if (!review || !date || !model) {
      alert("All details are mandatory");
      return;
    }
    let model_split = model.split(" ");
    let make_name = model_split[0];
    let model_name = model_split.slice(1).join(" ");

    let jsonmessage = JSON.stringify({
      "name": name,
      "dealership": parseInt(id),
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_name,
      "car_model": model_name,
      "car_year": year
    });

        const res = await fetch(`${root_url}djangoapp/add_review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonmessage,
      credentials: "include",
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `${root_url}dealer/${id}`;
    } else {
      alert("Failed to post review");
    }
  };

  const get_dealer = async () => {
    const res = await fetch(`${root_url}djangoapp/dealer/${id}`, {
      method: "GET"
    });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealer(retobj.dealer);
    }
  };

  const get_cars = async () => {
    const res = await fetch(`${root_url}djangoapp/get_cars`, {
      method: "GET"
    });
    const retobj = await res.json();
    let carmodelsarr = retobj.CarModels;
    setCarmodels(carmodelsarr);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "grey" }}>{dealer.full_name}</h1>
        <textarea
          id='review'
          cols='50'
          rows='10'
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className='input_field'>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className='input_field'>
          Car Make & Model
          <select name="cars" id="cars" onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled selected>Select Car Make and Model</option>
            {carmodels.map(carmodel => (
              <option value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>
        <div className='input_field'>
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2026} min={2010} />
        </div>
        <div>
          <button className='postreview' onClick={post_review}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;