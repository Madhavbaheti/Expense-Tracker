const express = require('express')
const router = express.Router();
const Users = require('../schema/user')
const UsersData = require('../schema/userData')
const { body,validationResult } = require('express-validator')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userData = require('../schema/userData');
const jwtsecret = "MynameisMadhavBaheti"



router.post("/api/signup",async(req,res) => {
   const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const email = req.body.email
    try {
        const useremail = Users.findOne({email})
        if(!useremail) {
        await Users.create({
            "username": req.body.username,
            "email": req.body.email,
            "password": req.body.password
        })
        res.json({success: "true"});
    }
    else {
        alert("Email already used");
    }
    }catch(err) {
        console.log("error in creating user");
        res.json({success:"False"});
    }
});



router.post("/api/login", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const email = req.body.email;
    const password = req.body.password;
    try {
        const UserData = await Users.findOne({ email });
        if (!UserData) {
            return res.status(400).json({ error: "User Not Found" });
        }
        if (UserData.password !== password) {
            return res.status(401).json({ error: "Invalid Password" });
        }
        const data = {
            user: {
                id : UserData._id ,
            }
        }
        const authToken = jwt.sign(data,jwtsecret)
        return res.status(200).json({ success: true ,authToken:authToken,Username:UserData.username,Email:UserData.email})

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "False" });
    }
});




router.delete('/api/delete', async (req, res) => {
  try {
    const { email, cardName } = req.body;


    const user = await UsersData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cards = user.cards.filter(card => card.name !== cardName);

    // Save the updated user data
    await user.save();

    // Send a success response
    res.status(200).json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/api/Useremail', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    const  email  = req.body.email;
  
    if (email) {
      try {
        const existingUser = await UsersData.findOne({ email });
  
        if (existingUser) {
          return res.status(200).json({ data: "User already exists" });
        } else {
          await UsersData.create({ email });
          return res.status(201).json({ data: "User created" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
      }
    } else {
      return res.status(400).json({ error: "Email is required" });
    }
  });



  router.post('/api/Userdata', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const cardName = req.body.card;
    const currentEmail = req.body.email;
  
    if (currentEmail) {
      try {
        const existingUser = await UsersData.findOne({ email: currentEmail });
  
        if (existingUser) {
          // If the user exists, update the cardName
          if (cardName) {
            const existingCardName = existingUser.cards.find(card => card.name === cardName);
  
            if (existingCardName) {
              return res.status(200).json({ status: 200, data: "exists" });
            } else {
              // If the cardName does not exist, add a new card
              existingUser.cards.push({ name: cardName, details: [] });
              await existingUser.save();
              return res.status(201).json({ status: 201, data: "created" });
            }
          } else {
            return res.status(400).json({ status: 400, error: "Card name is required" });
          }
        } else {
          // Handle the case where the user does not exist or handle during login
          return res.status(400).json({ status: 400, error: "User not found" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false });
      }
    } else {
      return res.status(400).json({ status: 400, error: "Email is required" });
    }
  });
  
  
  router.post('/api/expense', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, cardName, expenditureData } = req.body;

    try {
        const existingUser = await UsersData.findOne({ email });

        if (existingUser) {
            const cardDetails = existingUser.cards.find((card) => card.name === cardName);

            if (cardDetails) {
                // If expenditureData is provided, push it to the details array
                if (expenditureData) {
                    cardDetails.details.push(expenditureData);
                }

                // Calculate total expenditure using reduce
                const totalExpenditure = cardDetails.details.reduce((total, expense) => total + expense.expenditure, 0);

                // Update the total property of cardDetails
                cardDetails.total = totalExpenditure;

                await UsersData.findOneAndUpdate(
                    { email, 'cards.name': cardName },
                    { $set: { 'cards.$': cardDetails } }
                );

                return res.status(201).json({ success: true, data: cardDetails });
            } else {
                return res.status(400).json({ success: false, error: 'Card not found' });
            }
        } else {
            return res.status(400).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        console.error('Error handling expense:', error.message);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

  

  router.delete('/api/data-delete', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, cardName, id } = req.body;
  
    try {
      const existingUser = await UsersData.findOne({ email });
  
      if (existingUser) {
        const cardDetails = existingUser.cards.find((card) => card.name === cardName);
  
        if (cardDetails) {
          // Use filter instead of map to remove the item with a specific index
          cardDetails.details = cardDetails.details.filter((number) => number.id !== id);
          
          await existingUser.save();
          return res.status(200).json({success:true, message: 'Data deleted successfully' ,details: cardDetails.details });
        } else {
          return res.status(404).json({ message: 'Card not found' });
        }
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  const updateUserDetails = async (email, cardName, id, expenditure, remark) => {
    try {
      const updatedCard = await userData.findOneAndUpdate(
        {
          email,
          'cards.name': cardName,
          'cards.details.id': id,
        },
        {
          $set: {
            'cards.$[card].details.$[detail].expenditure': parseInt(expenditure),
            'cards.$[card].details.$[detail].remark': remark,
          },
        },
        {
          arrayFilters: [
            { 'card.name': cardName },
            { 'detail.id': id },
          ],
          new: true,
        }
      );
  
      if (!updatedCard) {
        return null;
      }
  
      return updatedCard;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  };
  
  
  router.put('/api/update-data', async (req, res) => {
    const { email, cardName, id, expenditure, remark } = req.body;
  
    try {
      const updatedCard = await updateUserDetails(email, cardName, id, expenditure, remark);
  
      if (updatedCard) {
        return res.status(200).json({
          success: true,
          message: 'Data updated successfully',
          data: updatedCard,
        });
      } else {
        return res.status(404).json({ success: false, message: 'User, card, or details not found' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  
  
  
 
module.exports = router;
