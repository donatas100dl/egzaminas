const { response } = require('express')
const mongoose = require('mongoose')
const Envets = require('../../models/EventModel.js')
const Users = require('../../models/userModel.js')
const multer = require("multer")
const { verify } = require('jsonwebtoken')

// 4 thing create, get, update, delete

// 1 create 

exports.createEvent = async function (req, res) {
  try {

  //getting body 
  const body = req.body
  if (!body)
    return res.status(400).json({ message: 'Content cannot be empty!' });
  //mising fields

  if (!body.name || !body.category || !body.category || !body.date )
    return res.status(400).json({ message: 'Missing fields' });
  // cheking user
  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized!' });

  //chesck if event already exists
  const eventExists = await Envets.findOne({ name: body.name });
  if (eventExists) 
    return res.status(400).json({ message: 'event already exists!' });


  // creating new event
  const newevent = new Envets({
    name: body.name,
    votes: body.votes,
    place: body.place,
    category: body.category,
    author: req.user.name,
    user_id: req.user._id,
    date: body.date,
    votes: 0,
    verified: false
  })

  // saving event to DB
  const createdItem = await newevent.save()
  if (createdItem)
    return res.status(200).json(createdItem)


  } catch (error){
    res.status(400).json({ message: error.message })
  }
}

// 2 getting by user

exports.getEvents = async function (req, res) {
  try{
    const events = await Envets.find({})
    if (!events)
      return res.status(404).json({ message: 'No events found!' });

    return res.status(200).json(events);

    } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// 3 updating event

exports.updateEvent = async function (req, res) {
  try{
    // getting body
    const body = req.body
    if (!body)
      return res.status(400).json({ message: 'Content cannot be empty!' });
    
    // cheking user
    if (!req.user)
      return res.status(401).json({ message: 'Unauthorized!' });
    
    // getting event by id
    console.log(req.params.id.toString())
    const event = await Envets.findById(req.params.id);
    console.log(event)
    if (!event || event.length === 0)
      return res.status(404).json({ message: 'No event found with that id!' });
    
    // checking if user is the owner of the event
    if (event.user_id.toString()!== req.user._id.toString() && !req.user.admin )
      return res.status(401).json({ message: 'Unauthorized!' });
    
    // updating event
    event.name = body.name;
    event.place = body.place;
    event.date = body.date;
    event.category = body.category
    // img
    
    // saving updated event
    const updatedevent = await event.save();
    if (updatedevent)
      return res.status(200).json({event: updatedevent});
  }
  catch(error){
    res.status(400).json({ message: error.message })
  }
}

// 4 deleting event
exports.deleteEvent = async function(req, res) {
  try{

    // cheking user
    if (!req.user)
      return res.status(401).json({ message: 'Unauthorized!' });
    
    // getting event by id
    const event = await Envets.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: 'No event found with that id!' });
    
    // checking if user is the owner of the event
    if (event.user_id.toString()!== req.user._id.toString() && !req.user.admin )
      return res.status(401).json({ message: 'Unauthorized!' });
    
    // deleting event
    const response = await Envets.deleteOne({_id: req.params.id});
    if (response)
      return res.status(200).json({ message: 'event deleted!' });


  } catch(error){
    res.status(400).json({ message: error.message})
  }
}


exports.verifyEvent = async function (req, res) {
  try{
    if (!req.user.admin)
      return res.status(400).json({ message: 'user not admin!' });

    const event = await Envets.findOne({_id: req.params.id})
    console.log(req.params.id)
    if(!event)
      return res.status(404).json({ message: 'No event found with that id!' });

    event.verified = true
    const updatedevent = await event.save();
    if (updatedevent)
      return res.status(200).json({event: updatedevent});


    } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

