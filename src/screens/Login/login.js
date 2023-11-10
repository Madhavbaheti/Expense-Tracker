import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentEmail } from "../../slice";
import "./login.css";
import backgroundImage from '../../images/backgroundimage.jpg'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const json = await response.json();

      if (!json.success) {
        alert("Invalid Email or Password");
      } else {
        console.log(json.Email);
        dispatch(setCurrentEmail(json.Email));
        window.location.href='/'
        localStorage.setItem("Email",json.Email)
        localStorage.setItem("AuthToken", json.authToken);
        localStorage.setItem("Username", json.Username);

       await fetch("http://localhost:5000/api/Useremail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        });
        
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="login-container" style={{
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
}}>
  <div className="login-box">
    <h2 className="login-heading">Login</h2>
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="login-button">
        Login
      </button>
    </form>
    <p className="signup-link">
      New user? <Link to="/signup">Sign up</Link>
    </p>
  </div>
</div>

    </div>
  );
}

export default Login;
