const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI (Make sure to add this to your Vercel environment variables)
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the schema for the form data
const formSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  service: String,
  message: String,
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);

// POST route to handle form submissions
app.post('/api/forms', async (req, res) => {
  const formData = req.body;
  try {
    const newForm = new Form(formData);
    await newForm.save();
    res.status(201).json({
      status: 'success',
      message: 'Form created successfully!',
      data: newForm,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating form.',
      error: error.message,
    });
  }
});

// GET route to retrieve all forms
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json({
      status: 'success',
      data: forms,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving forms.',
      error: error.message,
    });
  }
});

// PUT route to update a form
app.put('/api/forms/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedForm = await Form.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedForm) {
      return res.status(404).json({
        status: 'error',
        message: 'Form not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Form updated successfully!',
      data: updatedForm,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating form.',
      error: error.message,
    });
  }
});

// DELETE route to remove a form
app.delete('/api/forms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(404).json({
        status: 'error',
        message: 'Form not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Form deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting form.',
      error: error.message,
    });
  }
});

// Export the Express app to be used by Vercel
module.exports = app;
