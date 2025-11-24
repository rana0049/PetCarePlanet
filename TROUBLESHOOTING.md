# Troubleshooting Blank Pages

## Issue
Pages are showing blank/empty in the browser.

## Solution Steps

### 1. Hard Refresh Browser
Press **Ctrl + Shift + R** (or **Ctrl + F5**) to clear cache and reload

### 2. Check Browser Console
1. Press **F12** to open Developer Tools
2. Click on **Console** tab
3. Look for any red error messages
4. Take a screenshot and share if you see errors

### 3. Verify Dev Server is Running
The dev server should show:
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 4. Restart Everything
If still blank, run these commands:

```bash
# Stop the dev server (Ctrl+C in terminal)
# Then run:
cd client
npm run dev
```

### 5. Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Check if files are loading (should see main.jsx, Home.jsx, etc.)

## Common Causes
- Browser cache holding old version
- JavaScript error preventing render
- Dev server not fully started
- Missing dependencies

## Quick Test
Try opening in **Incognito/Private** window to rule out cache issues.
