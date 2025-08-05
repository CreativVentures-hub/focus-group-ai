# 🚀 Deployment Guide - Focus Group UI

This guide will help you deploy your Focus Group UI to a live server.

## 📋 **Files to Deploy**

For a basic deployment, you only need these files:
- `index.html`
- `script.js`
- `styles.css`
- `config.js` (or `config.production.js` for production)

## 🌐 **Free Hosting Options**

### **1. GitHub Pages (Recommended for beginners)**

**Steps:**
1. Create a GitHub repository
2. Upload your files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" → Choose "main" branch
5. Your site will be available at `https://yourusername.github.io/repository-name`

**Pros:** Free, reliable, easy setup
**Cons:** Limited to static files

### **2. Netlify (Drag & Drop)**

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub/GitLab/Bitbucket
3. Drag and drop your project folder to the deploy area
4. Your site is live instantly!

**Pros:** Free, instant deployment, custom domains
**Cons:** None for basic use

### **3. Vercel**

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy automatically

**Pros:** Free, excellent performance, automatic deployments
**Cons:** None for basic use

## 🔧 **Production Configuration**

### **Option 1: Use Production Config File**

1. Rename `config.production.js` to `config.js`
2. Update `index.html` to reference the new config:

```html
<!-- Change this line in index.html -->
<script src="config.js"></script>
```

### **Option 2: Modify Existing Config**

In your current `config.js`, change these settings:

```javascript
// Set production mode
IS_PRODUCTION: true,

// Disable development features
USE_CORS_PROXY: false,
DEBUG: false,
LOG_LEVEL: "error",

// Disable test buttons in production
FEATURES: {
    corsProxy: false,
    testButtons: false
}
```

## 🛡️ **Security Considerations**

### **CORS Issues in Production**

When deployed to a live server, you may encounter CORS issues. Solutions:

1. **Contact n8n Support**: Ask them to add your domain to their CORS allowlist
2. **Use a Backend Proxy**: Create a simple backend API that forwards requests
3. **Use a CORS Proxy Service**: (Not recommended for production)

### **Recommended Backend Proxy Setup**

If you need a backend, here's a simple Node.js/Express proxy:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your static files

app.post('/api/webhook', async (req, res) => {
    try {
        const response = await fetch('https://creativventures.app.n8n.cloud/webhook/focus-group-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.text();
        res.set('Content-Type', response.headers.get('content-type'));
        res.status(response.status).send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

Then update your `config.js`:
```javascript
WEBHOOK_URL: "/api/webhook", // Use your proxy instead
```

## 📁 **File Structure for Deployment**

```
your-project/
├── index.html
├── script.js
├── styles.css
├── config.js (or config.production.js)
└── README.md (optional)
```

## 🔍 **Testing Your Deployment**

1. **Test the webhook connection** using the test buttons
2. **Submit a test focus group** to ensure everything works
3. **Check browser console** for any errors
4. **Test on different devices** to ensure responsiveness

## 🚨 **Common Issues & Solutions**

### **CORS Errors**
- **Symptom**: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"
- **Solution**: Contact n8n support to whitelist your domain

### **Webhook Not Responding**
- **Symptom**: "Network error: Unable to connect to the webhook"
- **Solution**: Verify the webhook URL is correct and the n8n workflow is active

### **File Download Issues**
- **Symptom**: Files don't download or preview properly
- **Solution**: Check that the webhook is returning proper `Content-Disposition` headers

## 📞 **Getting Help**

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Test the webhook URL directly in a browser
3. Verify your n8n workflow is active and configured correctly
4. Contact n8n support for webhook-specific issues

## 🎯 **Recommended Deployment Path**

1. **Start with GitHub Pages** (easiest)
2. **Test thoroughly** with the production config
3. **If CORS issues occur**, implement a backend proxy
4. **Consider upgrading** to a paid service if you need more features

---

**Good luck with your deployment! 🚀** 