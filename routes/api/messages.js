const express = require('express');
const router = express.Router();
const messageModel = require('../../models/models')


// ----- this route gets all members 

router.get('/', async (req, res) => {
  await messageModel.find({}, (err, messages) => {
    res.send(messages);

    // console.log(messages) -----test

  })
});

// ------ post api request

router.post('/', async (req, res) => {
  res.json({
    message: 'im probably ganna return an error'
  })
  let messages = new messageModel(req.body);
  
  // console.log(messages) --- test

  await messages.save((err) => {
    if (err)
      res.sendStatus(500);
    res.sendStatus(200);
  })
})

// ------ delete api request ----test

router.delete('/', async (req, res) => {
  try {
    const food = await messageModel.deleteMany({})

    if (err) res.status(404).send("No item found");
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router;