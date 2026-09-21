---
title: Adding Files and Styling Basics
description: Where images go in your project, and enough about colours, fonts and CSS to ask Claude for what you want
---

# Adding Files and Styling Basics

## TLDR

Images, icons and other files go in a specific folder (usually `static/` or `public/`) so the build tool includes them when the app is deployed. Colours in code are written as hex codes like `#FF5733` or formats like `rgb(255, 87, 51)`. CSS (Cascading Style Sheets) is the language that controls how everything looks: fonts, colours, spacing, layout. You don't need to master CSS, because Claude writes it. Knowing the basics helps you ask for the right changes.

---

## Adding Images and Files to Your Project

### Where Files Go

Images, PDFs, fonts and other assets need to go in the right folder. Frameworks use different names, but the idea is the same. There's a special folder for "files served as they are, untouched by the build tool."

| Framework | Static files folder | Example URL in browser |
|-----------|-------------------|----------------------|
| SvelteKit | `static/` | `/my-image.png` |
| Next.js | `public/` | `/my-image.png` |
| Vite (vanilla) | `public/` | `/my-image.png` |
| VitePress | `docs/public/` | `/my-image.png` |

If you put `logo.png` in the `static/` folder (for SvelteKit), it becomes available at `http://localhost:5173/logo.png` in your app, and at `https://yoursite.com/logo.png` in production.

### How to Add an Image

1. Find your project's static folder (in VS Code it's in the file explorer on the left)
2. Drag your image file into that folder
3. Reference it in your code using the path from the static folder root

Or skip all that. Tell Claude where the file is on your computer and ask it to copy it into the static folder and use it.

**Example in HTML:**
```html
<img src="/images/hero-photo.jpg" alt="A description of the image" />
```

**Example in Svelte:**
```svelte
<img src="/images/hero-photo.jpg" alt="A description of the image" />
```

**Example in React/JSX:**
```jsx
<img src="/images/hero-photo.jpg" alt="A description of the image" />
```

**The leading `/` matters.** Writing `/images/hero-photo.jpg` means "start from the root of the static folder." Without the slash, the browser looks for the file relative to the current page, which often breaks.

### Organising Files

Create subfolders inside your static/public folder to keep things tidy:

```
static/
  images/
    hero-photo.jpg
    team-alice.jpg
    team-bob.jpg
  icons/
    favicon.ico
    logo.svg
  documents/
    terms-of-service.pdf
  fonts/
    CustomFont-Regular.woff2
```

### Image Formats: Which to Use

- **`.jpg` / `.jpeg`.** Good for photos. Small files, but quality drops if you compress too hard
- **`.png`.** Good for graphics, logos and screenshots. Anything that needs crisp edges or a see-through background
- **`.svg`.** Ideal for icons and logos. SVGs are made of maths, not pixels, so they scale to any size without going blurry. They're tiny too
- **`.webp`.** A modern format, smaller than JPG and PNG at similar quality. Every modern browser supports it
- **`.gif`.** For simple animations. Big files, limited colours. For anything complex, use a video or CSS animation instead

### File Sizes Matter

Large images slow down your app. A 5MB photo that's 4000x3000 pixels is overkill for a web page. Before adding images:

- Resize to the size it actually shows at. If it displays 400px wide, a 400px-wide file is enough (800px at most for high-DPI screens)
- Compress using a free tool like [squoosh.app](https://squoosh.app) or [tinypng.com](https://tinypng.com)
- Aim for under 200KB per image for most web use

Claude can optimise images too. Just ask: "Can you optimise the images in the static folder for the web?"

---

## How Colours Work in Code

Colours in web development are defined in several formats. You'll see all of these in CSS code, but they all describe the same thing: a specific colour.

### Hex Codes

The most common format. A `#` followed by 6 characters (0-9 and A-F):

```css
color: #FF5733;
```

The six characters are three pairs: **RR GG BB**, for Red, Green and Blue. Each pair ranges from `00` (none) to `FF` (maximum).

- `#FF0000` = maximum red, no green, no blue = **red**
- `#00FF00` = no red, maximum green, no blue = **green**
- `#0000FF` = no red, no green, maximum blue = **blue**
- `#FFFFFF` = all maximum = **white**
- `#000000` = all zero = **black**
- `#808080` = middle everything = **grey**
- `#FF5733` = lots of red, some green, a little blue = **an orange-red**

**You don't need to memorise this.** Use a colour picker. Google "colour picker" and one appears in the search results. Pick a colour by eye and it gives you the hex code.

### RGB

Same concept, different notation:

```css
color: rgb(255, 87, 51);
```

The three numbers are Red, Green and Blue, each from 0 to 255. `rgb(255, 87, 51)` is the same colour as `#FF5733`.

### RGBA: Colours with Transparency

Add an alpha (transparency) value:

```css
background-color: rgba(255, 87, 51, 0.5);
```

The fourth number goes from `0` (invisible) to `1` (solid). `0.5` means 50% see-through. Useful for overlay effects, subtle backgrounds, and shadows.

### HSL: Hue, Saturation, Lightness

Some developers prefer HSL because it's more intuitive for making colour variations:

```css
color: hsl(14, 100%, 60%);
```

- **Hue** (0-360): The colour on the colour wheel. 0 = red, 120 = green, 240 = blue
- **Saturation** (0%-100%): How vivid. 100% = pure colour, 0% = grey
- **Lightness** (0%-100%): How bright. 0% = black, 50% = normal, 100% = white

HSL makes it easy to create lighter or darker versions of a colour: just change the lightness percentage.

### Named Colours

CSS also has named colours:

```css
color: tomato;
color: steelblue;
color: papayawhip;
```

There are 140+ named colours. They're fine for prototyping but most projects use hex codes or design system variables for consistency.

### Using Colours Consistently: CSS Variables

Instead of writing `#FF5733` everywhere (and then having to change it in 50 places), good practice is to define colours once:

```css
:root {
  --color-primary: #FF5733;
  --color-secondary: #33A1FF;
  --color-background: #FAFAFA;
  --color-text: #333333;
}
```

Then use them throughout:

```css
.button {
  background-color: var(--color-primary);
  color: white;
}
```

Now you change the primary colour in one place. Claude usually sets this up for you. Knowing the pattern helps you ask for changes: "Can you change the primary colour to a darker blue?"

---

## CSS Basics: How Styling Works

CSS controls how HTML elements look. Colour, size, position, font, spacing, borders, shadows and animations are all set with CSS.

### The Structure of a CSS Rule

```css
.button {
  background-color: #FF5733;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
}
```

Breaking this down:

- `.button` is the **selector** (what to style). The `.` means "any element with the class name 'button'"
- `{ }`, the curly braces, hold the style rules
- `background-color: #FF5733;` is a **property** and its **value**, ended with a semicolon
- Each line is one styling instruction

### Common CSS Properties

| Property | What it does | Example |
|----------|-------------|---------|
| `color` | Text colour | `color: #333;` |
| `background-color` | Background fill | `background-color: #FFF;` |
| `font-size` | Text size | `font-size: 18px;` |
| `font-weight` | Bold/normal/light | `font-weight: bold;` |
| `padding` | Space inside an element | `padding: 16px;` |
| `margin` | Space outside an element | `margin: 20px;` |
| `border` | Border around an element | `border: 1px solid #CCC;` |
| `border-radius` | Rounded corners | `border-radius: 8px;` |
| `width` / `height` | Size of an element | `width: 300px;` |
| `display` | How an element is arranged | `display: flex;` |

### Padding vs Margin

This confuses everyone at first:

- **Padding** is the space between an element's content and its border (inside the element)
- **Margin** is the space between an element's border and the things around it (outside the element)

Think of it like a picture frame: the padding is the matting inside the frame, the margin is the wall space between frames.

### Units: px, rem, em, %

- **`px`** (pixels). Fixed size. `16px` is 16 pixels, whatever else happens. Good for borders and small details
- **`rem`.** Relative to the root font size (usually 16px). `1rem` = 16px, `2rem` = 32px. Good for text and spacing, because it scales if the reader changes their browser font size
- **`em`.** Relative to the parent element's font size. It can cascade in surprising ways, so `rem` is usually preferred
- **`%`.** A percentage of the parent element. `width: 50%` means half the width of the container
- **`vh` / `vw`.** Viewport height and width. `100vh` = the full height of the browser window

For most things, `px` suits small values (borders, shadows) and `rem` suits text and spacing. Claude handles this. Knowing why helps you read the code.

---

## Telling Claude what you want

You don't need to write CSS yourself. That's Claude's job. Knowing the words just helps you give clear instructions:

Instead of: *"Make the button look different"*

Try: *"Make the button background a darker blue, increase the border-radius to 12px for more rounded corners, and add more padding so the text isn't so close to the edges"*

Instead of: *"The spacing is weird"*

Try: *"The cards need more margin between them, maybe a 24px gap. And the text inside each card needs more padding, especially at the top and bottom"*

Instead of: *"Change the colours"*

Try: *"I want the primary colour to be #2563EB (a medium blue) and the background to be #F8FAFC (a very light grey). Update the CSS variables"*

The more specific you are, the fewer rounds it takes. That saves time and eats less of your session limit. A screenshot with an arrow on it works wonders too.

### Finding Colours You Like

If you see a colour on another website and want to use it:

1. Right-click the coloured element on the website
2. Click "Inspect"
3. In the Elements panel, look at the CSS on the right side for `color` or `background-color` values
4. Copy the hex code

Or use a browser extension like **ColorZilla** (Chrome/Firefox). It gives you an eyedropper to click any colour and copy its hex code.

---

## Tailwind CSS: A Shortcut

Many modern projects use **Tailwind CSS** instead of writing traditional CSS. Instead of separate CSS files, you add class names directly to HTML elements:

```html
<!-- Traditional CSS approach -->
<button class="my-button">Click me</button>
<!-- Needs a separate .my-button rule in a CSS file -->

<!-- Tailwind approach -->
<button class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Click me</button>
<!-- All styling is right here in the class names -->
```

Each Tailwind class maps to a CSS property: `bg-blue-500` = blue background, `px-6` = horizontal padding, `rounded-lg` = rounded corners.

**You don't need to learn Tailwind.** Claude knows it well and will use it if your project is set up for it. If you see class names like `flex items-center gap-4 text-sm font-medium`, that's Tailwind, and it's normal.

---

## Quick Reference for Talking to Claude About Styles

| What you want | What to say to Claude |
|--------------|---------------------|
| Change a colour | "Change the primary colour to [hex code or description]" |
| More/less space | "Increase/decrease the padding/margin on [element]" |
| Bigger/smaller text | "Make the heading font-size larger, maybe 24px" |
| Rounded corners | "Add border-radius to the cards, about 12px" |
| A shadow | "Add a subtle box-shadow to the card component" |
| Centre something | "Centre this element horizontally" |
| Side by side | "Display these items in a row using flexbox" |
| Stacked vertically | "Stack these elements vertically with 16px gap between them" |
| Responsive (works on mobile) | "Make this layout responsive: stack vertically on mobile, side by side on desktop" |

---

**That's Part 0 done.** You've got Claude set up and enough vocabulary to talk about how your app looks and works. Head to the [Introduction](/introduction) for the method. If you skipped the setup, it's in [Setting Up Your Computer](/part-0/setting-up-your-computer).
