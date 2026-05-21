# Aradhana Rani's Portfolio - Backend Setup Guide

## Contact Form Database Integration

Your portfolio now has a fully functional contact form with backend message storage. Here's how to set it up and use it.

---

## **Option 1: Node.js Backend (Recommended for Local Testing)**

### Prerequisites
- Node.js installed ([download here](https://nodejs.org/))

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd /path/to/portfolio
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   Portfolio backend running at http://localhost:5000
   ```

3. **Open Your Portfolio**
   - Navigate to `portfolio.html` in your browser
   - The contact form will now work locally

4. **View Messages (Admin Dashboard)**
   - Open `admin.html` in your browser
   - See all messages, mark as read/unread, delete, copy emails

### File Structure
```
portfolio/
├── portfolio.html        (Your portfolio)
├── portfolio.css         (Styling)
├── portfolio.js          (With form handler)
├── server.js             (Backend API)
├── admin.html            (Admin dashboard)
├── package.json          (Dependencies)
├── messages.json         (Auto-created - stores all messages)
└── firebase-config.js    (Optional - for Firebase)
```

### API Endpoints

**POST /api/messages**
- Submits a new message
- Body: `{ name, email, message }`
- Returns: Success/error response

**GET /api/messages**
- Retrieves all messages
- Returns: Array of messages with timestamps

**PATCH /api/messages/:id**
- Marks message as read/unread
- Returns: Updated message

**DELETE /api/messages/:id**
- Deletes a message
- Returns: Success response

---

## **Option 2: Firebase Cloud (Production-Ready)**

### Setup Steps

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create Project"
   - Name it "aradhana-portfolio"
   - Enable Google Analytics (optional)

2. **Set Up Firestore Database**
   - Go to Build > Firestore Database
   - Click "Create Database"
   - Select "Start in production mode"
   - Choose region (closest to you)
   - Click "Create"

3. **Get Firebase Credentials**
   - Go to Project Settings > Web App
   - Click "Add App" > Web
   - Copy the config object
   - Paste into `firebase-config.js`

4. **Update your form handler**
   - Replace the fetch-based handler with Firebase Firestore methods
   - See `firebase-example.js` for implementation

5. **Set Firestore Security Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /messages/{document=**} {
         allow read, write: if true;  // For testing only
         // Production: restrict to authenticated users
       }
     }
   }
   ```

---

## **How It Works**

### When Someone Submits the Form:

1. **Validation**
   - Checks all fields are filled
   - Validates email format
   - Shows error if validation fails

2. **Submission**
   - Sends data to backend
   - Shows loading state on button
   - Validates on server again

3. **Storage**
   - Message saved with timestamp & ID
   - Marked as unread by default
   - Available in admin dashboard

4. **Confirmation**
   - Success notification appears
   - Form resets for next submission
   - Green success toast with message

### Admin Dashboard Features

✅ View all messages  
✅ See total, read, unread counts  
✅ Mark messages as read/unread  
✅ Copy email addresses  
✅ Delete messages  
✅ Auto-refresh every 30 seconds  
✅ Real-time updates  

---

## **Testing Locally**

### 1. Start Backend
```bash
npm start
```

### 2. Open Portfolio
```
file:///path/to/portfolio/portfolio.html
```

### 3. Fill Contact Form
- Enter name, email, message
- Click "Send Message"
- See success notification

### 4. View in Admin
```
file:///path/to/portfolio/admin.html
```

---

## **Deployment Options**

### Deploy Backend to Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create aradhana-portfolio-api

# Deploy
git push heroku main
```

### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy Backend to Railway.app
- Push code to GitHub
- Connect GitHub repo to Railway
- Set Node.js as service
- Auto-deployed on push

---

## **Customization**

### Change Message Storage
Edit `server.js` to use:
- MongoDB Atlas
- PostgreSQL
- SQLite
- AWS DynamoDB

### Add Email Notifications
Install `nodemailer`:
```bash
npm install nodemailer
```

Then add in `server.js`:
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'app-password'
  }
});

// In POST handler:
await transporter.sendMail({
  to: 'aradhana.rani.738@gmail.com',
  subject: `New message from ${name}`,
  text: message
});
```

### Add Rate Limiting
```bash
npm install express-rate-limit
```

---

## **Troubleshooting**

**"Connection error. Make sure the backend server is running..."**
- Ensure `npm start` is running
- Check server is on `http://localhost:5000`
- Check CORS is enabled (it is by default)

**Messages not saving**
- Check `messages.json` has write permissions
- Check server console for errors
- Verify JSON is valid (use `jq` or JSON validator)

**Admin dashboard blank**
- Refresh page
- Check browser console for errors
- Ensure backend is running

**Form submission hanging**
- Check network tab in DevTools
- Verify API endpoint is correct
- Check server logs

---

## **Security Notes**

⚠️ **Current Setup:** Messages stored in JSON file (local development)

🔒 **For Production:**
- Use environment variables for secrets
- Add authentication to admin dashboard
- Implement rate limiting
- Use HTTPS
- Validate & sanitize all inputs
- Add CSRF protection
- Set up database backups

---

## **Need Help?**

- Check console logs (DevTools F12)
- Verify all files are in the same directory
- Make sure Node.js is installed (`node -v`)
- Try restarting the backend server

---

**Last Updated:** May 2026  
**Status:** ✅ Fully Functional
