import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./intocard.css";
import { v4 as uuidv4 } from "uuid";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { saveData,deleteEntry,cardEntries } from "../../Api";
import Button from "../../Components/Navbar/Button/Button";

function Intocard() {
  
  const [inputValue, setInputValue] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const name = useSelector((state) => state.Current_Card.opened_card);
  const [expenditures, setExpenditures] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [updatedExpenditure, setUpdatedExpenditure] = useState();
  const [updatedRemark, setUpdatedRemark] = useState("");


  const handleStartEdit = (id) => {
    expenditures.map((item) => {
      if (item.id === id) {
        setUpdatedExpenditure(item.expenditure);
        setUpdatedRemark(item.remark);
      }
    });
    setEditedItem(id);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.text(`${name}`, 20, 10);

    // Add data
    const tableData = [];
  expenditures.forEach((item, index) => {
    tableData.push([
      index + 1,
      item.expenditure,
      item.remark,
      item.date
    ]);
  });
  autoTable(doc, {
    head: [['Index', 'Expenditure', 'Remark', 'Date']],
    body: tableData,startY: 20,margin: { top: 20 }
  })

  const totalExpenditure = calculateTotalExpenditure();
  doc.setFont('bold');
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text(`Total Expenditure: ${totalExpenditure}`, 20, doc.autoTable.previous.finalY + 10);
  

    // Save the PDF
    doc.save(`${name}.pdf`);
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await saveData(name,id,updatedExpenditure,updatedRemark)

      if (response) {
        cardDetails();
        setShowUpdatePopup(true);
        setEditedItem(null);
        setUpdatedExpenditure("");
        setRemarkValue("");
        setTimeout(() => {
          setShowUpdatePopup(false);
        }, 3000);
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditedItem(null);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    // Ensure that inputValue is a positive number
    if (/^\d+$/.test(inputValue) || inputValue === "") {
      setInputValue(inputValue);
    }
  };

  const handleRemarkChange = (e) => {
    setRemarkValue(e.target.value);
  };

  const handleAddExpenditure = async (e) => {
    e.preventDefault();
    if (!inputValue) {
      return alert("Please enter an amount");
    }
    const newExpenditure = {
      id: uuidv4(),
      expenditure: parseInt(inputValue),
      remark: remarkValue,
      date: new Date().toLocaleString(),
    };

    setInputValue("");
    setRemarkValue("");

    cardDetails(newExpenditure);
  };

  const handleDeleteExpenditure = async (id) => {
    const response = await deleteEntry(name,id)
    if (response.success) {
      cardDetails();
      setExpenditures(response.details);
      setShowDeletePopup(true);

      // Hide the pop-up after 1 second
      setTimeout(() => {
        setShowDeletePopup(false);
      }, 3000);
    } else {
      console.log(res.message);
    }
  };

  useEffect(() => {
    cardDetails();
  }, []);

  const cardDetails = async (currentExpenditure) => {
    try {
      const response = await cardEntries(name,currentExpenditure)
      if (response.success) {
        setExpenditures(response.details);
      }
    } catch (error) {
      console.error("Error sending data to the backend:", error.message);
    }
  };

  const calculateTotalExpenditure = () => {
    if (!editedItem) {
      return expenditures.reduce(
        (total, expenditure) => total + expenditure.expenditure,
        0
      );
    } else {
      return;
    }
  };

  return (
    <div
      className="intocard-container"
      onKeyDown={(e) => e.key === "Enter" && handleAddExpenditure(e)}
    >
      {(showDeletePopup && (
        <div className="popup bg-danger">Entry Deleted</div>
      )) ||
        (showUpdatePopup && (
          <div className="popup bg-success">Entry Updated</div>
        ))}

      <h1>{name}</h1>

      <div className="input-section">
        <label htmlFor="expenditureInput">Enter Expenditure: </label>
        <input
          type="number"
          id="expenditureInput"
          value={inputValue}
          onChange={handleInputChange}
        />
        <label htmlFor="remarkInput">Remark: </label>
        <input
          type="text"
          id="remarkInput"
          value={remarkValue}
          onChange={handleRemarkChange}
        />
        <button className="add-button" onClick={handleAddExpenditure}>
          Add
        </button>
      </div>
      <Button className="pdf-button" text=" Generate PDF"onClick={generatePDF}>
       
      </Button>

      <table className="expenditure-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Expenditure</th>
            <th>Remark</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        {expenditures.map((item, index) => (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td>
              {editedItem === item.id ? (
                <input
                  type="number"
                  value={updatedExpenditure}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Check if inputValue is a positive number
                    if (inputValue === "" || /^\d*\.?\d+$/.test(inputValue)) {
                      setUpdatedExpenditure(inputValue);
                    }
                  }}
                />
              ) : (
                item.expenditure
              )}
            </td>
            <td>
              {editedItem === item.id ? (
                <input
                  type="text"
                  value={updatedRemark}
                  onChange={(e) => setUpdatedRemark(e.target.value)}
                />
              ) : (
                item.remark
              )}
            </td>
            <td>{item.date}</td>
            <td className="button-container">
              {editedItem === item.id ? (
                <>
                  <Button
                    className="save-button mx-4"
                    onClick={() => handleSaveEdit(item.id)}
                    disabled={updatedExpenditure === item.expenditure && updatedRemark==item.remark}
                    text="Save"
                  >
                   
                  </Button>
                  {console.log(
                    "updatedExpenditure:",
                    updatedExpenditure,
                    "item.expenditure:",
                    item.expenditure
                  )}
                  <Button
                    className="cancel-button"
                    onClick={() => handleCancelEdit()}
                    text="Cancel"
                  >
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="update-button"
                    onClick={() => handleStartEdit(item.id)}
                    text="Update"
                  >
                    
                  </Button>
                  <Button
                    className="delete-button mx-3"
                    onClick={() => handleDeleteExpenditure(item.id)}
                    text="Delete"
                  >
                
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </table>

      <div className="total-expenditure">
        <strong>Total Expenditure: {calculateTotalExpenditure()}</strong>
      </div>
    </div>
  );
}

export default Intocard;
