import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentCard } from "../../slice";
import "./home.css";
import { fetchUserData,addUserCard,deleteCard } from "../../Api";
import Button from "../../Components/Navbar/Button/Button";
import backgroundImage from '../../images/backgroundimage.jpg'

function Home() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [cardNameList, setCardNameList] = useState([]);
  const [showError, setShowError] = useState(false); // State to control error message
  const [newCardName, setNewCardName] = useState(""); // New state for card name
  const [totalList, setTotalList] = useState([]);
  const dispatch = useDispatch();
  const email = localStorage.getItem("Email");

  const handleAddCard = () => {
    setShowOverlay(true);
  };

  const navigate = useNavigate();
  const handlecardClick = (name) => {
    dispatch(setCurrentCard(name));
    navigate("/intocard");
  };

  const handleOutsideClick = (e) => {
    if (showOverlay && !e.target.closest(".overlay-content")) {
      setShowOverlay(false);
      setShowError(false);
    }
  };

  const fetchData = async () => {
    try {
      const { cards, total } = await fetchUserData(email);
      setCardNameList(cards);
      setTotalList(total);
    } catch (error) {
      console.error("Error in component:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCardName === "") {
      setShowError(true);
    } else {
      setCardNameList((names) => [...names, newCardName]);
      const response = await addUserCard(newCardName)
      if (response) {
        fetchData();
        setNewCardName("");
        setShowOverlay(false);
        setShowError(false);
        
      } else {
        alert("Card already exists");
      }
    }
  };

  const handleDelete = async (name) => {
    const response = await deleteCard(name)
    if (response) {
      setCardNameList((prevCards) => prevCards.filter((card) => card !== name));
    } else {
      // Handle errors or show a notification
      console.error("Error deleting card");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div onClick={handleOutsideClick} style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
    }}>
      <Navbar />
      {!localStorage.getItem("AuthToken") ? (
        <div>
          <h1 style={{ textAlign: "center" }}>Login to use the cards</h1>
        </div>
      ) : (
        <div>
          <button className="add-a-card-button p-3" style={{"z-index":"1000                                                                                                                  "}} onClick={handleAddCard}>
            Add a Card
          </button>

          <div className="cards-display">
            {cardNameList.map((name, index) => (
              <div
                className="card w-25 mx-4 my-4 text-white mb-4"
                key={index}
                onClick={() => {
                  handlecardClick(name);
                }}
              >
                <button
                  className="btn position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(name);
                  }}
                >
                  <img
                    src={require("../../static/perfect-cross.png")}
                    alt="Delete"
                    style={{ width: "25px", height: "25px" }}
                  />
                </button>
                <h2 className="card-header">{name}</h2>
                <div className="card-body">
                  <h5 className="card-title"></h5>
                  <p className="card-text">
  Total: <span className="mr-2">{totalList[index]}</span>
</p>

                </div>
              </div>
            ))}
          </div>
          {showOverlay && (
            <div className="overlay ">
            <div className="overlay-content p-5">
              <input
                type="text"
                placeholder="Enter card name"
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="add-a-card-input p-3"
              />
          
              {showError && <p className="error-message">Give card a name</p>}
              <Button className="overlay-button mt-3" onClick={handleSubmit} text="Add Card">
              </Button>
            </div>
          </div>
          
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
