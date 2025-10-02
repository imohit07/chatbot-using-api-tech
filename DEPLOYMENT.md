# 🚀 Deployment Guide for AI Chatbot on Vercel

## Prerequisites

1. **GitHub Account**: [github.com](https://github.com)
2. **Vercel Account**: [vercel.com](https://vercel.com) (sign up with GitHub)
3. **Google AI API Key**: [makersuite.google.com](https://makersuite.google.com/app/apikey)

## Step-by-Step Deployment

### 1. Fork the Repository

1. Go to [github.com/imohit07/chatbot-using-api-tech](https://github.com/imohit07/chatbot-using-api-tech)
2. Click **"Fork"** button
3. Select your GitHub account

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key (keep it safe!)

### 3. Deploy to Vercel

#### Method 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/imohit07/chatbot-using-api-tech&env=GEMINI_API_KEY&envDescription=Get%20your%20API%20key%20from%20Google%20AI%20Studio&envLink=https://makersuite.google.com/app/apikey)

#### Method 2: Manual Deploy

1. **Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**:
   - Click **"New Project"**
   - Select your forked repository
   - Click **"Import"**

3. **Configure Environment Variables**:
   - In the deployment settings, add:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: Your copied API key from step 2

4. **Deploy**:
   - Click **"Deploy"**
   - Wait for deployment to complete (1-2 minutes)

### 4. Test Your Deployment

1. **Access Your App**: 
   - Vercel will provide a URL like `your-app-name.vercel.app`
   - Click to open your chatbot

2. **Test Features**:
   - Send a text message
   - Upload an image
   - Verify AI responses

## Configuration Options

### Custom Domain

1. In Vercel dashboard, go to your project
2. Click **"Domains"** tab
3. Add your custom domain
4. Follow DNS setup instructions

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIzaSyD...` |

### Performance Settings

The `vercel.json` file is pre-configured with:
- Static file caching
- Serverless function optimization
- Proper routing rules

## Troubleshooting

### Common Deployment Issues

1. **Build Failed**:
   - Check that all files are properly committed
   - Verify `vercel.json` syntax

2. **API Key Not Working**:
   - Ensure the API key is correctly set in Vercel environment variables
   - Check API key permissions in Google AI Studio

3. **Function Timeout**:
   - Default timeout is 30 seconds
   - For large images, consider optimizing file size

4. **CORS Errors**:
   - The serverless function handles CORS automatically
   - Ensure you're using the deployed URL, not localhost

### Error Messages

| Error | Solution |
|-------|----------|
| "API key not configured" | Add `GEMINI_API_KEY` to Vercel environment variables |
| "Failed to get response from AI" | Check API key validity and quota |
| "Method not allowed" | Ensure API endpoint is correctly configured |

## Monitoring and Analytics

### Vercel Analytics

1. In your Vercel dashboard
2. Go to your project
3. Click **"Analytics"** tab
4. View performance metrics

### Function Logs

1. Go to **"Functions"** tab in Vercel
2. Click on `api/chat.js`
3. View real-time logs and errors

## Security Best Practices

1. **API Key Protection**:
   - Never expose API keys in frontend code
   - Use environment variables only
   - Rotate keys regularly

2. **Rate Limiting**:
   - Consider implementing rate limiting for production
   - Monitor API usage in Google AI Studio

3. **Content Filtering**:
   - Implement content moderation if needed
   - Handle inappropriate requests gracefully

## Updates and Maintenance

### Updating Your App

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update chatbot"
   git push origin main
   ```

2. **Auto-Deploy**: Vercel automatically redeploys when you push to main branch

### Monitoring

- Set up Vercel notifications for deployment status
- Monitor API usage in Google AI Studio
- Check error logs regularly

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Google AI Documentation**: [ai.google.dev](https://ai.google.dev)
- **Project Issues**: [GitHub Issues](https://github.com/imohit07/chatbot-using-api-tech/issues)

---

🎉 **Congratulations!** Your AI chatbot is now live on Vercel!
