import React, { useState, useRef } from 'react';
import "leaflet/dist/leaflet";
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, divIcon } from 'leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect } from 'react';
import axios from "axios";
import { format } from "timeago.js";
import { useMapEvents } from 'react-leaflet';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const mystorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [currentUser, setUser] = useState(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ratingRef = useRef(null);
  const [showRegister,setshowRegister] = useState(false);
  const [showLogin,setshowLogin] = useState(false);

  const customIcon = (name) => {
    let url = name === currentUser ? "https://cdn-icons-png.flaticon.com/128/3710/3710297.png" : "https://cdn-icons-png.flaticon.com/128/6730/6730787.png";
    return new Icon({
      iconUrl: url,
      iconSize: [38, 38]
    });
  };

  const createCustomIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      iconSize: [33, 33, true],
      className: "cluster-marker-cluster",
    });
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/api/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title: titleRef.current.value,
      description: descRef.current.value,
      rating: ratingRef.current.value,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    console.log("new user" + newPin)
    // console.log(descRef.current.value)
    //console.log(ratingRef.current.value)
    //console.log(newPlace.lat)
    //console.log(currentUser)

    try {
      console.log("heyeh")
      const res = await axios.post("/api/pins", newPin);
      console.log(res)
      setPins([...pins, res.data]);


      setNewPlace(null);
    } catch (err) {
      console.error(err);
    }
  };

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setNewPlace({ lat, lng });
      },
    });

    if (newPlace) {
      return (
        <Marker position={[newPlace.lat, newPlace.lng]} icon={customIcon(currentUser)}>
          <Popup>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input type='text' placeholder='Enter a title' ref={titleRef} />
              <label>Review</label>
              <textarea placeholder='Tell others about the place' ref={descRef} />
              <label>Rating</label>
              <select ref={ratingRef}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type='submit'>Add Pin</button>
            </form>
          </Popup>
        </Marker>
      );
    }
    return null;
  }

const handleLogout = () => {
  mystorage.removeItem("user")
  setUser(null);
}
  return (
    <>
    {currentUser ?(
      <button className='logout btn' onClick={handleLogout}>Log Out</button>)
        :(
        <div>
          
          <button className='login btn' onClick={()=>setshowLogin(true)}>Login</button>
          <button className='register btn' onClick={()=>setshowRegister(true)}>Register</button>
        </div>)      
      }
      {showRegister && <Register setshowRegister={setshowRegister}/>}
      {showLogin && <Login setshowLogin={setshowLogin} mystorage={mystorage} currentUser={setUser}/>}
   
   
      <MapContainer className='map-box' center={[26.7041, 77.1025]} zoom={4}
        minZoom={3}
        maxZoom={18}
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createCustomIcon}
        >

          {pins.map(p => (
            <Marker
              position={[p.lat, p.long]}
              icon={customIcon(p.username)}
            >
              <Popup>
                <div className='container'>
                  <div className='box'>
                    <h4>Place</h4>
                    <h3>{p.title}</h3>
                    <br></br>
                    <h4>Review</h4>
                    <h5>{p.description}</h5>
                  </div>

                  <div className=''>
                    <div>
                      <b>Rating</b> <br />
                      {Array(p.rating).fill(<span>⭐</span>)}
                    </div>

                    <br />
                    <i>Information created by <b>{p.username}</b></i>
                    <br /><br />
                    <h6>{format(p.createdAt)}</h6>
                  </div>
                </div>

              </Popup>

            </Marker>

          ))}
          <MyComponent />
        </MarkerClusterGroup>
      </MapContainer>

    </>

  )
}

export default App

