---
title: Start Here
description: Plain-English explanations of the words Claude and Claude Code will throw at you, before you need them
---

# Start Here

## Pick your track

There are two ways through this guide. Pick one now and the site hides what you don't need. You can switch whenever you like.

<TrackChooser />

## TLDR

When you build an app with AI, it'll throw words at you that nobody explained: *stack*, *localhost*, *port*, *framework*, *deploy*, *DNS*. None of them are as scary as they sound. This page walks through the whole picture in plain English, in roughly the order you'll meet each term. Read it once, top to bottom. You don't need to memorise anything. Just come back when a word trips you up. The full dictionary is the [Concepts Glossary](/part-0/glossary).

---

## The big picture: what you're actually building

Most apps are made of a few working parts that pass messages to each other. The whole collection is your **tech stack** (or just "the stack"). Here are the parts, from the back to the front:

- **A database.** A fancy Excel table with lots of rules. It's where your app remembers things: users, orders, messages. It doesn't forget when the power goes off.
- **A back end.** A mini computer that does the back-office work: checking passwords, doing sums, deciding what's allowed. Nobody ever sees it directly.
- **A front end.** The web page you actually open and click around in. Buttons, colours and text live here, in your browser.
- **An API.** The wiring between the front end and the back end. When you click "Save", an API call carries that request to the back end and brings the answer back. Think of a waiter running orders between the dining room and the kitchen.

That's it. A place to store things, a brain to make decisions, a face to look at, and wiring in between. Almost every app you'll build is some version of this.

---

## Running it on your own machine: "local" and "localhost"

When Claude Code runs your app so you can test it, it runs **locally**. That means on your own computer, not out on the internet. You'll see the word **localhost**, which just means "this computer, right here."

If you opened `http://localhost:5173` and texted that link to a friend, it wouldn't work for them. Their "localhost" is *their* computer. Local is your private workshop. Nothing is public until you deliberately put it out there (more on that below).

::: simple
In the Code tab of the Claude desktop app, your running app shows up in the Browser pane. That's localhost too. You just don't have to type the address.
:::

### Ports: the `:5173` bit

You'll also see the app pick a **port**. That's the number after the colon, like `:5173` or `:8000`. A port is a numbered off-ramp on your computer that sends traffic to the right place. Your front end gets one off-ramp and your back end another, so they don't collide.

You don't choose these. The tools pick sensible defaults (often 5173 for a front end, 8000 or 3000 for a back end). If two things grab the same off-ramp you'll get a "port already in use" error. It's harmless and easy to fix. [How Apps Run](/part-0/how-apps-run) goes into ports and conflicts in more depth.

---

## Frameworks and languages: the "how it's written" part

When Claude sets things up, it'll recommend a **framework**. That's a ready-made set of rules and building blocks for a coding language, so nobody starts from a blank page. You'll hear names like:

- **React**, a popular way to build front-end web pages.
- **Node**, a way to run back-end processes (it runs JavaScript outside the browser).
- **Python**, another popular language for back-end work, data and automation.

JavaScript and Python are **coding languages** (React is built on JavaScript). They're the evolution from raw 1s and 0s into something a human, or an AI, can read and write. They're just instructions, spelled out precisely enough that a computer can follow them.

You don't need to write any of it. When Claude says "I'll use React for the front end and Python for the back end," it's describing what the parts are built out of. It isn't asking you to learn anything.

---

## Seeing what's going on: DevTools and the Terminal

Two windows let you peek inside the machinery when something misbehaves:

- **DevTools** lives inside your web browser (right-click a page, then "Inspect"). It shows the front-end side: the page's structure, its styling, and the API calls flying back and forth. The [Browser DevTools](/part-0/browser-devtools) page shows you around.
- **The Terminal** (also called the **Command Line**, **CLI** or **console**) is a text window that shows the back-end side. It's a running printout of what your app is doing, errors included. It looks intimidating. It's just text scrolling by.

::: everything
Claude Code can live in the terminal too. That's the route the "Show me everything" track takes, alongside VS Code.
:::

When Claude asks you to "check the console" or "paste the terminal output," it wants you to copy that text so it can see what went wrong. A screenshot works too. That's all.

---

## Going live: servers, deployment and DNS

Eventually you'll want the world to use your creation. That means moving it off your laptop and onto a **server**. A server is basically a computer inside a computer inside a data centre, rented for a monthly or pay-as-you-go fee. Unlike your laptop, it's always on and reachable from anywhere. Moving your app onto it is called **deploying**.

A fresh server has a numeric address like `42.99.158.20`. It works, but nobody wants to type that. So you buy a name (`my-awesome-app.com`) from a **domain registrar** and tell it: "point this name at that number." That instruction is a **DNS record**.

Once you save it, the record **propagates**. It spreads across the internet over the next few minutes to hours, until anyone can type your name and land on your app. [How Apps Run](/part-0/how-apps-run) covers deployment, servers and the safety rules in detail.

---

## Words that sound scary but aren't

You'll bump into these constantly. Quick, honest translations:

| You'll hear… | It really means… |
|---|---|
| **Repo / repository** | The folder holding your whole project and its history. |
| **Commit** | Save a snapshot of your work, with a note about what changed. |
| **Push / pull** | Upload your work to GitHub, or download the latest. |
| **Build** | Package the app into its fast, final form for going live. |
| **Environment variable / `.env`** | A file of secret settings (passwords, keys) that never gets shared. |
| **404** | "That page doesn't exist here." A wrong address, not a crash. |
| **500** | "Something broke on the back end." Check the terminal for the why. |
| **Dependency** | A ready-made bit of code your project borrows instead of rebuilding. |

That's the map. You've got more to learn, young Padawan, but nothing here should feel like a foreign language any more.

---

## Where to go next

- **Ready to set up your machine?** [Setting Up Your Computer](/part-0/setting-up-your-computer)
- **Want the full dictionary?** [Concepts Glossary](/part-0/glossary)
- **Curious how local vs live really works?** [How Apps Run](/part-0/how-apps-run)
- **Ready for the actual method?** [Introduction](/introduction)

And the golden rule: whenever Claude uses a word you don't know, ask it. *"What does that mean in plain English?"* It'll happily explain. That's the whole point.
