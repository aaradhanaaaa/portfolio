const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// File paths
const messagesFile = path.join(__dirname, 'messages.json');

// Initialize messages file if not exists
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, JSON.stringify([], null, 2));
}

// GET all messages (protected - would need authentication in production)
app.get('/api/messages', (req, res) => {
  try {
    const messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST new message
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Read existing messages
    let messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));

    // Create new message object
    const newMessage = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    // Add to messages
    messages.push(newMessage);

    // Write back to file
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    res.json({ 
      success: true, 
      message: 'Message received! I will get back to you soon.',
      data: newMessage 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE message (admin)
app.delete('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    let messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    messages = messages.filter(m => m.id != id);
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MARK message as read/unread
app.patch('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    let messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    const message = messages.find(m => m.id == id);
    if (message) {
      message.read = !message.read;
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
      res.json({ success: true, data: message });
    } else {
      res.status(404).json({ success: false, error: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio backend running at http://localhost:${PORT}`);
});
