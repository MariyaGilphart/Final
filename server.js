const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  

app.use(express.json());

// Update the MongoDB URI hereconst 
mongoURI = "mongodb+srv://mariyagilphart:Rpntech02@rpn.7odyk.mongodb.net/?retryWrites=true&w=majority&appName=RPN";


mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const formSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  service: String,
  message: String,
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);

// Route for submitting a form (POST)
app.post('/api/forms', async (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);

  try {
    // Create and save a new form document
    const newForm = new Form(formData);
    await newForm.save();

    res.status(201).json({
      status: 'success',
      message: 'Form created successfully!',
      data: newForm,
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating form.',
      error: error.message,  // Include error message for debugging
    });
  }
});

// Route to get all form submissions (GET)
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();  // Retrieve all forms
    res.status(200).json({
      status: 'success',
      data: forms,
    });
  } catch (error) {
    console.error('Error retrieving forms:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving forms.',
      error: error.message,  // Include error message for debugging
    });
  }
});

// Route to update an existing form (PUT)
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
    console.error('Error updating form:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating form.',
      error: error.message, 
    });
  }
});

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
    console.error('Error deleting form:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting form.',
      error: error.message, 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
