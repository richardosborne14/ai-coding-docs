---
title: Start Here (For Non-Techies)
description: Plain-English explanations of the words Claude, Cline and Claude Code will throw at you — before you need them
---

# Start Here (For Non-Techies)

## TLDR

When you build an app with AI, it'll throw words at you that nobody explained — *stack*, *localhost*, *port*, *framework*, *deploy*, *DNS*. None of them are as scary as they sound. This page walks you through the whole picture in plain English, in roughly the order you'll meet each term, so the jargon stops being a wall and starts being a map. Read it once, top to bottom. You don't need to memorise anything — just come back when a word trips you up. When you're ready for the full dictionary, that's the [Concepts Glossary](/part-0/glossary).

---

## The big picture: what you're actually building

Most apps are made of a few working parts that pass messages to each other. The whole collection is your **tech stack** (or just "the stack"). Here are the parts, from the back to the front:

- **A database** — a fancy Excel table with lots of rules. It's where your app remembers things: users, orders, messages. It doesn't forget when the power goes off.
- **A back end** — a mini computer that does the back-office work: checking passwords, doing sums, deciding what's allowed. Nobody ever sees it directly.
- **A front end** — the web page you actually open and click around in. Buttons, colours, text — the bit that lives in your browser.
- **An API** — the wiring between the front end and the back end. When you click "Save" on the page, an API call carries that request to the back end and brings the answer back. Think of a waiter running orders between the dining room and the kitchen.

That's it. A place to store things, a brain to make decisions, a face to look at, and wiring in between. Almost every app you'll build is some version of this.

---

## Running it on your own machine: "local" and "localhost"

When Claude Code or Cline runs your app so you can test it, it runs **locally** — meaning on your own computer, not out on the internet. You'll see the word **localhost**, which literally just means "this computer, right here."

If you opened `http://localhost:5173` and texted that link to a friend, it wouldn't work for them — their "localhost" is *their* computer. Local is your private workshop. Nothing is public until you deliberately put it out there (more on that below).

### Ports: the `:5173` bit

You'll also see the app pick a **port** — that's the number after the colon, like `:5173` or `:8000`. A port is just a numbered off-ramp on your computer, directing traffic to the right place. Your front end gets one off-ramp, your back end another, so they don't collide.

You don't choose these — the tools pick sensible defaults (often 5173 for a front end, 8000 or 3000 for a back end). If two things grab the same off-ramp you'll get a "port already in use" error, which is harmless and easily fixed. [How Apps Run](/part-0/how-apps-run) explains ports and conflicts in more depth.

---

## Frameworks and languages: the "how it's written" part

When Claude sets things up, it'll recommend a **framework** — a ready-made set of rules and building blocks for a coding language, so nobody starts from a blank page. You'll hear names like:

- **React** — a popular way to build front-end web pages.
- **Node** — a way to run back-end processes (it runs JavaScript outside the browser).
- **Python** — another popular language for back-end work, data, and automation.

React, JavaScript (Node) and Python are all **coding languages** — the evolution from raw 1s and 0s into something a human (or, poetically, an AI) can actually read and write. They're just instructions, spelled out precisely enough that a computer can follow them.

You don't need to write any of it. But when Claude says "I'll use React for the front end and Python for the back end," now you know it's describing *what the parts are built out of* — not asking you to learn anything.

---

## Seeing what's going on: DevTools and the Terminal

Two windows let you peek inside the machinery when something misbehaves:

- **DevTools** lives inside your web browser (right-click a page → "Inspect"). It shows the front-end side — the page's structure, its styling, and the API calls flying back and forth. Our [Browser DevTools](/part-0/browser-devtools) page shows you around.
- **The Terminal** (also called the **Command Line**, **CLI**, or **console**) is a text window that shows the back-end side — a running printout of what your app is doing and any errors. Claude Code actually lives here. It looks intimidating; it's just text scrolling by.

When Claude asks you to "check the console" or "paste the terminal output," it's asking you to copy that text so it can see what went wrong. That's all.

---

## Going live: servers, deployment and DNS

Eventually you'll want the world to use your creation. That means moving it off your laptop and onto a **server** — basically a computer inside a computer inside a data centre, which you rent for a monthly or pay-as-you-go fee. Unlike your laptop, it's always on and reachable from anywhere. Moving your app onto it is called **deploying**.

A fresh server has a numeric address like `42.99.158.20` — technically usable, but nobody wants to type that. So you buy a name (`my-awesome-app.com`) from a **domain registrar** and tell it: "point this name at that number." That instruction is a **DNS record**.

Once you save it, the record **propagates** — it spreads across the internet over the next few minutes to hours — until everyone, everywhere, can type your name and land on your app. [How Apps Run](/part-0/how-apps-run) covers deployment, servers and the safety rules in detail.

---

## Words that sound scary but aren't

You'll bump into these constantly. Quick, honest translations:

| You'll hear… | It really means… |
|---|---|
| **Repo / repository** | The folder holding your whole project and its history. |
| **Commit** | Save a snapshot of your work, with a note about what changed. |
| **Push / pull** | Upload your work to GitHub / download the latest down. |
| **Build** | Package the app into its fast, final form for going live. |
| **Environment variable / `.env`** | A file of secret settings (passwords, keys) that never gets shared. |
| **404** | "That page doesn't exist here" — a wrong address, not a crash. |
| **500** | "Something broke on the back end" — check the terminal for the why. |
| **Dependency** | A ready-made bit of code your project borrows instead of rebuilding. |

That's the map. You've got more to learn, young Padawan — but nothing here should feel like a foreign language any more.

---

## Where to go next

- **Ready to set up your machine?** → [Setting Up Your Computer](/part-0/setting-up-your-computer)
- **Want the full dictionary?** → [Concepts Glossary](/part-0/glossary)
- **Curious how local vs live really works?** → [How Apps Run](/part-0/how-apps-run)
- **Ready for the actual method?** → [Introduction](/introduction)

And the golden rule: whenever Claude, Cline or Claude Code uses a word you don't know, just ask it — *"What does that mean in plain English?"* It'll happily explain. That's the whole point.
