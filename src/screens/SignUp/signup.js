import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import backgroundImage from '../../images/backgroundimage.jpg'



function SignupPage() {
  const [info,SetInfo] = useState({
  
    username: "",
    email:"",
     password: ""
  })
  const navigate=useNavigate()
  const HandleSubmit= async (e)=> {
    e.preventDefault()
    try{
   const response = await fetch("http://localhost:5000/api/signup", {
    method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify( {
        username:info.username,
        email:info.email ,
        password:info.password
      })
  })
   const json = await response.json();
   console.log(json);
   if(!json.success) {
    console.log("Not successful")
   }
   else {
   navigate("/login")
   }
    }
  catch (error) {
    console.error("An error occurred:", error);
  }
}
   
  const HandleChange = (event) => {
        SetInfo ({...info,[event.target.name]:event.target.value})
    }


  
  return (
    <div className="signup-container" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
    }}>
      <div className="signup-box">
        <form onSubmit={HandleSubmit}>
        <h2 className="signup-heading">Sign Up</h2>
       
        <input
          type="text"
          placeholder="Username"
          className="signup-input"
          name="username"
          value={info.username}
          onChange={HandleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          name="email"
          value={info.email}
          onChange={HandleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          name="password"
          value={info.password}
          onChange={HandleChange}
        />
       
        <button className="signup-button" type="submit">
          Sign Up
        </button>
        <p className="login-link">
          Already a user? <Link to="/login">Login</Link>
        </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
