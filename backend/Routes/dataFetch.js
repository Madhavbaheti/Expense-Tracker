const express = require('express')
const router = express.Router();
const UsersData = require('../schema/userData')




router.post('/api/cards', async (req, res) => {
    try {
      const email  = req.body.email;
      const user = await UsersData.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const cardNames = user.cards.map(card => card.name);
      const totalList = user.cards.map(card=>card.total)
  
      res.status(200).json({ success:true,cards: cardNames,total:totalList }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
