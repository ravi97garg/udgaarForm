import React, { useState, useEffect } from "react";
import axios from 'axios';
import DoneIcon from "./DoneIcon";
import iiycData from './iiycData.json';
import './App.css';

export default function App() {
  const [submitted, setSubmitted] = React.useState(null);
  const [allData, setData] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [showThanks, setShowThanks] = useState(false);
  const [postData, setPostData] = useState({
    arcName: "",
    arcContact: "",
    pledge: "",
    arcNameGirl: "",
    arcContactGirl: ""
  })



  useEffect(() => {

    const fetchData = async () => {
      const { data } = await axios.get("https://umang.iyfghaziabad.in/api/get-udgaar-data");
      setData(data.data)
      console.log(data.data);
    }

    fetchData();
  }, [])

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      state: selectedState,
      area: selectedArea,
      project: selectedProject,
      ...postData
    }
    console.log(data)

    if(data.state && data.area && data.project && data.arcName && data.arcContact && data.pledge && !isNaN(data.pledge)) {
      setShowThanks(true)
    }

    axios.post("https://umang.iyfghaziabad.in/api/udgaar-arc-pledge", data)
    setSubmitted(postData);
  };

  return (
    <div className="form-container">
    {!Object.keys(allData).length && <div className="loader">Please wait few seconds. Fetching latest details</div>}
      {!showThanks ? <div className="form">
        <div className="header">UDGAAR 2025 Pledge and ARC Form</div>
        <label>Select state*</label>
        <select value={selectedState} onChange={(e) => {
          setSelectedState(e.target.value)
          setSelectedArea("");
          setSelectedProject("");
        }}>
          <option value="" disabled selected>Choose state</option>
          {Object.keys(allData).map((state) => {
            return <><option>{state}</option></>
          })}
        </select>
        {submitted && !selectedState && <div className="errorMessage">This field cannot be blank</div>}

        <label>Select area*</label>
        <select value={selectedArea} onChange={(e) => {
          setSelectedArea(e.target.value);
          setSelectedProject("");
        }}>
          <option value="" disabled selected>{selectedState ? 'Choose area' : 'Choose state first'}</option>
          {Object.keys(allData?.[selectedState] || []).map((area) => {
            return <><option>{area}</option></>
          })}
        </select>
        {submitted && !selectedState && <div className="errorMessage">This field cannot be blank</div>}

        <label>Select project/L3 Preacher*</label>
        <select value={selectedProject} onChange={(e) => {
          setSelectedProject(e.target.value)
        }}>
          <option value="" disabled selected>{selectedState ? (selectedArea ? 'Choose project' : 'Choose area first') : 'Choose state first'}</option>
          {(allData?.[selectedState]?.[selectedArea] || []).map((project) => {
            return <><option>{project}</option></>
          })}
        </select>
        {submitted && !selectedProject && <div className="errorMessage">This field cannot be blank</div>}


        <label>Enter Pledging*</label>
        <input name="pledge" value={postData.pledge} onChange={(e) => {
          setPostData({ ...postData, [e.target.name]: e.target.value })
        }} />
        {submitted && !postData.pledge && <div className="errorMessage">This field cannot be blank</div>}
        {submitted && isNaN(postData.pledge) && <div className="errorMessage">This field needs a number value</div>}

        <label>Enter Male ARC name*</label>
        <input name="arcName" value={postData.arcName} onChange={(e) => {
          setPostData({ ...postData, [e.target.name]: e.target.value })
        }} />
        {submitted && !postData.arcName && <div className="errorMessage">This field cannot be blank</div>}

        <label>Enter Male ARC contact*</label>
        <input name="arcContact" value={postData.arcContact} onChange={(e) => {
          setPostData({ ...postData, [e.target.name]: e.target.value })
        }} />
        {submitted && !postData.arcContact && <div className="errorMessage">This field cannot be blank</div>}

        <label>Enter Female ARC name</label>
        <input name="arcNameGirl" value={postData.arcNameGirl} onChange={(e) => {
          setPostData({ ...postData, [e.target.name]: e.target.value })
        }} />

        <label>Enter Female ARC contact</label>
        <input name="arcContactGirl" value={postData.arcContactGirl} onChange={(e) => {
          setPostData({ ...postData, [e.target.name]: e.target.value })
        }} />


        <button className="submitButton" onClick={onSubmit}>Submit</button>
      </div> : <div>
        <DoneIcon/>
        <div className="thanksMsg">Form submitted</div>
        </div>}
    </div>

  );
}

