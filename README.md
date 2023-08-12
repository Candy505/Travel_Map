# Travel_Map


35:31

import { useState } from 'react'
import "leaflet/dist/leaflet"
import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon, divIcon } from 'leaflet'
import MarkerClusterGroup from "react-leaflet-cluster"
import { useEffect } from 'react'
import axios from "axios"
import { format } from "timeago.js"
import { useMapEvents, useMapEvent } from 'react-leaflet'

function App() {

  const [pins, setPins] = useState([]);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(0);

  const currentUser = "Riya";

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
    })
  }

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



  // to make a pin on the map
  const [newPlace, setnewPlace] = useState(null);

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setnewPlace({ lat, lng });
        console.log(lng)

      },
    });


    if (newPlace) {
      return (
        <Marker position={[newPlace.lat, newPlace.lng]} icon={customIcon(currentUser)}>
          <Popup>
            <form onSubmit={handleSubmit}>

              <label>Title</label>
              <input type='text' placeholder='Enter a title' onChange={(e)=>setTitle(e.target.value)}/>
              <label>Review</label>
              <textarea placeholder='tell others about the place' onChange={(e)=>setDesc(e.target.value)}/>
              <label>Rating</label>
              <select onChange={(e)=>setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type='submit'>Add Pin</button>
            </form>

          </Popup>
          <MyZoom />
        </Marker>
      );
    }
    return null;
  }


  function MyZoom() {
    const map = useMapEvent('click', () => {
      map.setZoom(map.getZoom() - 1)
    })
    return null
  }

//form handleSubmit

 const handleSubmit = async (e) => {
  e.preventDefault();
  const newPin = {
    user:currentUser,
    title,
    desc,
    rating,
    lat:newPlace.lat,
    long: newPlace.lng,
  }

  try{
    const res = await axios.post("/api/pins",newPin);
    setPins([...pins,res.data]);
    setnewPlace(null)
  }catch(err)
  {
    console.log(err)
  }
 }


  return (

    <MapContainer center={[26.7041, 77.1025]} zoom={4}
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
                    <b>Rating</b>
                  </div>


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

  )
}

export default App

app.jsx