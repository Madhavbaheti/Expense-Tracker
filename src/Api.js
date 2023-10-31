//home.js

const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("Email"),
        }),
      });

      const json = await response.json();

      if (json.success) {
        return { cards: json.cards, total: json.total };
      } else {
        throw new Error(json.message || "Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const addUserCard = async (newCardName) => {
    try {
      const response = await fetch("http://localhost:5000/api/Userdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("Email"),
          card: newCardName,
        }),
      });
  
      const json = await response.json();
  
      if (json.status === 200) {
        return false;
      } else if (json.status === 201) {
        return true;
      }
    } catch (error) {
      console.error("Error adding user card:", error.message);
      throw error;
    }
  }

  const deleteCard = async(name)=> {
    try {
      const response = await fetch(`http://localhost:5000/api/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("Email"),
          cardName: name,
        }),
      });
      const json = await response.json();
      if(json.success) {
        return true;
      }
      else {
        return false;
      }
    }catch(e) {

    }
  }

  export {fetchUserData,addUserCard,deleteCard}


  //intoCard

  const saveData = async(name,id,updatedExpenditure,updatedRemark)=> {
    try {
      const response = await fetch("http://localhost:5000/api/update-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("Email"),
          cardName: name,
          id: id,
          expenditure: updatedExpenditure,
          remark: updatedRemark,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
     if(res.success) {return true}

     else  {return {message:res.message}}
      
    }catch(e) {
   
    }
  }


  const deleteEntry = async(name,id) => {
    try {
      const response = await fetch("http://localhost:5000/api/data-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("Email"),
          cardName: name,
          id: id,
        }),
      });
      const res = await response.json();
      if(res.success) {
        return {success:true,details:res.details}
      }
      else {
        return {message:res.message}
      }
    }catch(e) {

    }
  }


  const cardEntries = async(name,currentExpenditure) => {
    try {
      const response = await fetch("http://localhost:5000/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("Email"),
          cardName: name,
          expenditureData: currentExpenditure,
        }),
      });

      const res = await response.json();
      if(res.success) {
        return {success:true,details:res.data.details}
      }
      else {
        return false
      }

    }catch(e) {

    }
  }
  export {saveData,deleteEntry,cardEntries}