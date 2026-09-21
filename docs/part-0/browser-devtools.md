---
title: Browser DevTools for Debugging
description: How to read error messages in your browser and hand them to Claude, with screenshots
---

# Browser DevTools for Debugging

## TLDR

Every web browser has built-in developer tools ("DevTools") that show what's happening behind the scenes. The bit you'll use most is the **Console**. It shows error messages when something goes wrong. When your app misbehaves, open the console, copy the error and paste it into Claude. Add a screenshot. That gives Claude the exact information it needs, so you don't have to describe the problem in words.

---

## Opening DevTools

### Chrome

Three ways, all do the same thing:

1. **Keyboard shortcut:** Press `F12` (or `Cmd+Option+I` on Mac / `Ctrl+Shift+I` on Windows)
2. **Right-click method:** Right-click anywhere on the page and select **"Inspect"**
3. **Menu method:** Click the three-dot menu (⋮) > More Tools > Developer Tools

### Firefox

Same shortcuts work:

1. **Keyboard shortcut:** `F12` (or `Cmd+Option+I` / `Ctrl+Shift+I`)
2. **Right-click method:** Right-click > **"Inspect"**
3. **Menu method:** Hamburger menu (☰) > More Tools > Web Developer Tools

### Safari (Mac)

Safari hides DevTools by default. Switch them on first:

1. Go to Safari > Settings > Advanced
2. Tick **"Show features for web developers"** (or "Show Develop menu in menu bar" on older versions)
3. Then press `Cmd+Option+I` or go to Develop > Show Web Inspector

::: simple
If you're building in the Code tab of the Claude desktop app, your app shows up in the Browser pane. For DevTools, open the same `localhost` address in Chrome and use the steps above.
:::

---

## The Console Tab

When DevTools opens, you'll see tabs along the top: **Elements**, **Console**, **Sources**, **Network** and so on. Click **Console**.

The Console shows messages from your app. They come in a few colours:

**Red text = errors.** Something broke. This is the one you need most often. Errors say what went wrong and often where in the code.

**Yellow text = warnings.** Something might be off, but the app still works. Less urgent. Worth a look if things seem odd.

**White, grey or blue text = information.** Normal messages the app logged on purpose. Usually not a problem.

### What an Error Looks Like

Here's a typical console error:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at UserList.svelte:23:15
    at Array.forEach (<anonymous>)
    at renderUserList (UserList.svelte:20:8)
```

This tells you:
- **What happened:** It tried to use `.map` on something that doesn't exist (`undefined`)
- **Where:** In a file called `UserList.svelte`, around line 23
- **The trail:** It started in the `renderUserList` function at line 20

You don't need to understand any of it. Claude does. Just copy the whole thing.

### How to Copy Console Errors

1. Click the error message in the console
2. It may expand to show more detail. Good, you want all of it
3. Right-click the error and choose **"Copy message"**, or select the text and press Ctrl+C / Cmd+C
4. Paste it straight into Claude

**Tip:** Right-click in the console and choose **"Clear console"** to wipe old messages. Then reproduce the bug so you only see the new error. You can also choose **"Save as..."** to save the whole log to a file.

---

## The Network Tab

The Network tab shows every request your app makes: loading files, calling APIs, fetching data. Use it when something isn't loading or an API call is failing.

### How to Use It

1. Click the **Network** tab in DevTools
2. Reload the page (or do the thing that's failing)
3. A list of requests appears, one per row
4. Look for any in **red**. Those failed

### What to Copy for Claude

Click a failed (red) request to see its details. The useful parts are:

- **Status code:** A number like 404 (not found), 500 (server error) or 403 (not allowed)
- **URL:** What it was trying to reach
- **Response tab:** What the server sent back (often an error message)

Copy those into Claude. Something like:

```
The Network tab shows a failed request:
- URL: http://localhost:5173/api/users
- Status: 500 Internal Server Error
- Response: {"error": "Connection refused to database"}
```

That's everything Claude needs to start on it.

---

## The Elements Tab

The Elements tab shows the HTML structure of the page. Think of it as an X-ray of the website. Use it when something looks wrong: misaligned, wrong colour, too big or too small.

### How to Inspect a Specific Element

1. Click the **select element** tool (the arrow icon in the top-left of DevTools, or press `Ctrl+Shift+C` / `Cmd+Shift+C`)
2. Hover over anything on the page. It gets highlighted
3. Click the element you're interested in
4. The Elements panel jumps to that element's HTML
5. On the right you'll see its CSS styles, the rules that control how it looks

You won't need to edit anything here. Take a screenshot of the panel and give it to Claude, so it knows exactly which element is the problem.

---

## Screenshots Matter More Than Ever

I send Claude far more screenshots than I used to. Claude reads images well, and a picture of the broken page beats three paragraphs of me trying to explain it.

- **Mac:** `Cmd+Shift+4` and drag. Add `Ctrl` (`Cmd+Ctrl+Shift+4`) to copy it to the clipboard instead of saving a file.
- **Windows:** `Win+Shift+S`. It goes to the clipboard.

Then paste the screenshot straight into Claude, or drag the image file in. It works in Chat, in the Code tab and in Claude Code in VS Code.

Screenshot anything that looks wrong: the page itself, the console, a Network response, the Elements panel. If you can see it, Claude can too.

---

## The Debugging Workflow

When your app does something wrong:

### Step 1: Reproduce the Problem

Do the thing that causes it. Click the button, submit the form, load the page.

### Step 2: Check the Console

Open DevTools (F12), go to Console and look for red errors.

### Step 3: Take a Screenshot

Grab the broken state. It's quick and it saves a round of questions.

### Step 4: Give Everything to Claude

Put it together in one message:

```
The login button isn't working. When I click it, nothing happens.

Console error:
[paste the console error here]

[paste the screenshot]
```

**Screenshot plus console error = a fast fix.** Claude can usually find the problem in one go instead of asking you questions back and forth.

---

## Common Console Errors and What They Mean

You'll see these a lot. You don't need to memorise them. They're a normal part of building, not a sign that everything is ruined.

**"Failed to fetch" or "NetworkError".** Your app tried to call an API and couldn't reach it. Usually the server isn't running. Check your back end (or Docker containers) is up.

**"CORS error" (Cross-Origin Request Blocked).** Your front end is talking to a server on a different address, and that server isn't set up to allow it. Very common in development, and Claude knows how to fix it.

**"404 Not Found".** The URL your app asked for doesn't exist. Either the route isn't set up or there's a typo in the URL.

**"Cannot read properties of undefined".** The code is using data that isn't there yet. Often the page tries to show data before it has finished loading.

**"SyntaxError: Unexpected token".** A typo in the code, like a missing bracket or an extra comma. The error usually points right at it.

**"Module not found".** An import points at a file or package that doesn't exist. Either it isn't installed (`npm install`) or the file path is wrong.

---

## Quick Reference

| I'm seeing... | Open this tab | Give Claude this |
|---------------|--------------|-----------|
| Something broke / button doesn't work | Console | The red error message |
| Data not loading | Network | The failed request's URL, status and response |
| Something looks wrong | Elements | A screenshot of the page, plus one of the element's CSS |
| Page is slow | Network | Requests that take a long time (sort by time) |

---

**Next:** [How Apps Run: Local vs Cloud](/part-0/how-apps-run). Localhost, ports and deployment.
