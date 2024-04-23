//VERY IMP: SEE HERE!!!:
//Since we use mongoose and MongoDB for our database,
//whenever we interact with mongodb, we always get a promise, for which you can make use of async and await
//and also have try catch blocks to catch errors. BUTTT there is a better way to this this - asyncHandler(npm i express-async-handler), which is a middleware, which handles exceptions in async express routes and finally passes it into express error handler.
const asyncHandler = require("express-async-handler");

//Bringing our contactmodel i.e. schema here:
const Contact = require("../models/contactModel");

//@desc Get all contacts
//route GET /api/contacts
//@access PRIVATE

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({user_id:req.user.id});
  res.status(200).json(contacts);
});

//@desc Create a new contact
//route POST /api/contacts
//@access PRIVATE

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is:", req.body);
  const { name, email, phone } = req.body;
  // Handling an empty request
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });

  res.status(201).json(contact);
});

//@desc Get a contact
//route GET /api/contacts/:id
//@access PRIVATE

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Update a contact
//route PUT /api/contacts/:id
//@access PRIVATE

//To update a contact we should fetch the contact first and then do the necessary operations. Should not be updated just like that without fetching and error handling
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403)
    throw new Error("Not permitted to edit other user's contacts.")
  }

  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updateContact);
});

//@desc Delete a contact
//route DELETE /api/contacts/:id
//@access PRIVATE

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403)
    throw new Error("Not permitted to delete other user's contacts.")
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
