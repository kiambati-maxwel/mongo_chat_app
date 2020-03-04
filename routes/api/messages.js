const express = require('express');
const router = express.Router();
const message = require('../../models/models')

// ----- this route gets all members 

router.get('/', (req, res) => {
    message.find({},(err, messages)=> {
      res.send(messages);
      
    })
  })

  router.post('/', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
    //   io.emit('message', req.body);
      res.sendStatus(200);
    })
  })

module.exports = router;