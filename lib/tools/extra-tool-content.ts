import type { ToolContent } from "@/components/tools/tool-seo-content";

export const extraToolContent = {
  "remove-extra-spaces": {
    intro: "Clean up spacing that arrived from PDFs, emails, spreadsheets, or notes with too many invisible elbows.",
    whatThisDoes:
      "Remove Extra Spaces collapses repeated spaces, trims text, normalizes tabs, and fixes awkward spaces around punctuation and brackets.",
    whenToUse:
      "Use it when copied text has weird gaps, misaligned spaces, tabs from tables, or punctuation that looks like it got dressed in the dark.",
    howItWorks:
      "Paste text, choose exactly which spacing rules to apply, review the live output, then copy the cleaned version. Processing stays in your browser.",
    limitations:
      "The tool works on plain text spacing. It does not understand layout from PDFs or preserve rich text styles.",
    useCases: ["Cleaning copied PDF text.", "Tidying email drafts and notes.", "Fixing spreadsheet-pasted text before sharing."],
    faqs: [
      { question: "Will this remove line breaks?", answer: "Only if you turn off the option to preserve them. By default, useful line breaks stay put." },
      { question: "Does this upload my text?", answer: "No. The spacing cleanup runs locally in your browser." },
    ],
  },
  "remove-empty-lines": {
    intro: "Delete blank lines or tame oversized gaps without turning paragraphs into one giant text brick.",
    whatThisDoes:
      "Remove Empty Lines removes blank rows, trims whitespace-only lines, or collapses repeated empty lines into a single spacer.",
    whenToUse:
      "Use it when copied text has accidental blank rows from PDFs, exports, forms, chat logs, or note apps.",
    howItWorks:
      "Paste text, pick whether to remove or collapse empty lines, and the output updates immediately in the browser.",
    limitations:
      "It treats lines as plain-text rows. It cannot detect visual paragraph spacing from rich-text documents.",
    useCases: ["Cleaning exported lists.", "Removing blank rows from copied notes.", "Preparing text for forms or tickets."],
    faqs: [
      { question: "Can I preserve paragraph spacing?", answer: "Yes. Use the paragraph spacing option to keep a single blank line between blocks." },
      { question: "What counts as an empty line?", answer: "A blank line or, when enabled, a line containing only spaces or tabs." },
    ],
  },
  "find-and-replace": {
    intro: "Replace text locally, from tiny typo fixes to cautious regex surgery with a safety rail.",
    whatThisDoes:
      "Find and Replace Text searches pasted text and replaces matches using case matching, whole-word matching, regex mode, first match, or all matches.",
    whenToUse:
      "Use it when a name, phrase, token, label, or repeated typo needs to change in a block of text without opening a heavier editor.",
    howItWorks:
      "Enter the source text, find text, and replacement. Invalid regular expressions are caught and shown as friendly errors.",
    limitations:
      "Very complex regular expressions can still be slow in any browser. Keep regex patterns practical for interactive use.",
    useCases: ["Renaming repeated labels.", "Fixing repeated typos.", "Testing simple regex replacements before using them elsewhere."],
    faqs: [
      { question: "Are find and replace strings tracked?", answer: "No. Analytics never receives your text, find string, or replacement string." },
      { question: "Can it replace only the first match?", answer: "Yes. Switch from replace all to replace first when you only want the first occurrence changed." },
    ],
  },
  "text-diff-checker": {
    intro: "Compare two text blocks and spot what changed without squinting between tabs.",
    whatThisDoes:
      "Text Diff Checker compares original and changed text using line or word mode, then highlights additions, removals, and unchanged parts.",
    whenToUse:
      "Use it when reviewing edits, comparing drafts, checking config snippets, or finding what changed in copied notes.",
    howItWorks:
      "Paste both versions, choose line or word diff, and review the summary plus highlighted output. No text leaves the browser.",
    limitations:
      "The diff is designed for practical review, not a full version-control replacement for huge files or semantic code comparison.",
    useCases: ["Comparing two drafts.", "Checking edited instructions.", "Reviewing small config or copy changes."],
    faqs: [
      { question: "Does it support word diff?", answer: "Yes, the word mode gives a practical token-level comparison for smaller passages." },
      { question: "Can I copy the full diff?", answer: "You can copy the summary, which is usually the useful part to share." },
    ],
  },
  "speaking-time-calculator": {
    intro: "Estimate how long your script will take aloud before the meeting, video, or podcast runs long.",
    whatThisDoes:
      "Speaking Time Calculator turns word count into a speech duration using slow, average, fast, or custom words-per-minute settings.",
    whenToUse:
      "Use it for presentations, voiceovers, videos, podcasts, speeches, standups, or anything that has to fit a speaking slot.",
    howItWorks:
      "Paste text, choose a speaking pace, and get minutes, seconds, word count, and sentence count. Your speed preference can be saved locally.",
    limitations:
      "Real delivery varies with pauses, emphasis, audience reactions, and how often you stop to say 'quickly' while not being quick.",
    useCases: ["Timing speeches.", "Planning video scripts.", "Estimating podcast or voiceover segments."],
    faqs: [
      { question: "What speaking speed should I pick?", answer: "Average is a useful default; slow fits careful presentations, while fast fits energetic scripts." },
      { question: "Is my script stored?", answer: "No. Only the harmless speed preference may be saved in localStorage." },
    ],
  },
  "instagram-line-breaks": {
    intro: "Clean caption spacing and hashtags before a post turns into a cramped paragraph soup.",
    whatThisDoes:
      "Instagram Line Break Formatter trims captions, preserves visible line breaks, cleans hashtags, and can move hashtags into a final block.",
    whenToUse:
      "Use it when drafting captions, launch notes, event posts, creator updates, or anything where spacing affects readability.",
    howItWorks:
      "Paste a caption, choose spacing and hashtag cleanup options, review the simple preview, then copy the formatted caption.",
    limitations:
      "This is a practical formatter, not a guarantee against platform-specific rendering changes or account-level behavior.",
    useCases: ["Cleaning caption drafts.", "Removing duplicate hashtags.", "Keeping line breaks readable before posting."],
    faqs: [
      { question: "Does this bypass Instagram rules?", answer: "No. It simply formats plain text so you can paste a cleaner caption." },
      { question: "Can it remove duplicate hashtags?", answer: "Yes. The hashtag cleanup option keeps one copy of repeated hashtags." },
    ],
  },
  "instagram-character-counter": {
    intro: "Check caption, bio, username, and name-field lengths before Instagram trims your masterpiece.",
    whatThisDoes:
      "Instagram Character Counter measures characters, words, hashtags, mentions, and remaining space for common Instagram text limits.",
    whenToUse:
      "Use it while writing captions, bios, profile names, usernames, or short social copy with strict limits.",
    howItWorks:
      "Paste text, select the Instagram field, and watch the progress bar and remaining count update live.",
    limitations:
      "Platform rules can change, so treat counts as practical guidance and confirm important posts in the app before publishing.",
    useCases: ["Checking caption length.", "Writing a tight bio.", "Counting hashtags and mentions."],
    faqs: [
      { question: "Does it count hashtags separately?", answer: "Yes. It shows hashtag count along with mentions and word count." },
      { question: "Which limit is selected by default?", answer: "Caption length is the default because it is the most common check." },
    ],
  },
  "twitter-character-counter": {
    intro: "Estimate X/Twitter post length, thread chunks, and remaining space before the post box complains.",
    whatThisDoes:
      "X/Twitter Character Counter counts characters, words, URLs, and approximate 280-character chunks, with an optional long-post mode.",
    whenToUse:
      "Use it for short posts, thread drafts, launch updates, announcements, or compact writing where every character starts billing rent.",
    howItWorks:
      "Paste text, choose the limit mode, and review remaining characters plus an approximate thread chunk count.",
    limitations:
      "This is an estimate. Platform counting rules, URL treatment, and paid-account limits may change.",
    useCases: ["Drafting 280-character posts.", "Estimating thread length.", "Checking URL-heavy social copy."],
    faqs: [
      { question: "Does it exactly match X/Twitter?", answer: "No. It is intentionally honest: useful guidance, not a platform-certified counter." },
      { question: "Can I use long-post mode?", answer: "Yes. The 25,000-character mode is available, while 280 remains the default." },
    ],
  },
  "linkedin-post-formatter": {
    intro: "Make a post draft easier to scan without making it sound like it came from a conference lanyard.",
    whatThisDoes:
      "LinkedIn Post Formatter trims lines, cleans spaces, preserves paragraph breaks, normalizes bullets, and previews a generic post card.",
    whenToUse:
      "Use it before pasting professional updates, hiring posts, launch notes, lessons learned, or longer paragraph-based posts.",
    howItWorks:
      "Paste the post, apply cleanup options, review the preview, and copy the formatted text. No official platform branding is used.",
    limitations:
      "The preview is a generic writing aid and does not promise exact platform rendering.",
    useCases: ["Cleaning long post drafts.", "Normalizing bullet lists.", "Checking paragraph length before posting."],
    faqs: [
      { question: "Is this affiliated with LinkedIn?", answer: "No. It is a generic text formatter for posts you may paste there." },
      { question: "Will it rewrite my post?", answer: "No. It only cleans formatting; the words remain yours." },
    ],
  },
  "whatsapp-text-formatter": {
    intro: "Turn chat text into something readable before it lands in a group and starts a formatting incident.",
    whatThisDoes:
      "WhatsApp Text Formatter cleans message spacing, preserves line breaks, converts lines into bullets or numbers, and previews a generic chat bubble.",
    whenToUse:
      "Use it for announcements, lists, event details, instructions, or forwarded text that needs a quick tidy-up.",
    howItWorks:
      "Paste a message, choose list and cleanup options, preview the result, then copy the formatted text.",
    limitations:
      "The preview is generic and not affiliated with WhatsApp. Platform-specific display can vary by device.",
    useCases: ["Formatting group announcements.", "Turning lines into bullet lists.", "Cleaning forwarded-message clutter."],
    faqs: [
      { question: "Does it use WhatsApp branding?", answer: "No. It uses a generic chat-style preview only." },
      { question: "Can it add numbered lists?", answer: "Yes. You can convert lines into numbered or bulleted lists." },
    ],
  },
  "meta-description-checker": {
    intro: "Check whether a meta description is probably too short, pleasantly concise, or starting to monologue.",
    whatThisDoes:
      "Meta Description Length Checker counts characters, estimates practical snippet length, and previews a generic search result.",
    whenToUse:
      "Use it while writing SEO descriptions for pages, posts, products, docs, and landing pages.",
    howItWorks:
      "Enter title, URL, and description text. The tool shows character status, guidance, and a live snippet preview.",
    limitations:
      "Google can rewrite snippets, and there is no exact guaranteed length. The 120-160 character range is practical guidance.",
    useCases: ["Drafting page meta descriptions.", "Checking product page snippets.", "Keeping search copy concise."],
    faqs: [
      { question: "Is 160 characters a hard limit?", answer: "No. It is a common guideline, not a guarantee of how search engines display snippets." },
      { question: "Does the URL get tracked?", answer: "No. URL fields stay in the browser and are not sent to analytics." },
    ],
  },
  "xml-validator": {
    intro: "Validate XML text locally and find parser complaints without firing up a full IDE.",
    whatThisDoes:
      "XML Validator checks whether XML parses correctly, reports friendly errors, and summarizes the root element, elements, and attributes.",
    whenToUse:
      "Use it for XML snippets, config files, feeds, SOAP-ish payloads, exported data, and small structured documents.",
    howItWorks:
      "Paste XML and the browser DOMParser validates it locally. Valid XML gets a quick structural summary.",
    limitations:
      "This is basic XML well-formedness validation only. It does not validate against XSD, DTD, or business rules.",
    useCases: ["Checking XML snippets.", "Finding malformed tags.", "Inspecting root elements and attribute counts."],
    faqs: [
      { question: "Does it validate schemas?", answer: "No. It checks basic XML parsing, not XSD or DTD schema rules." },
      { question: "Is my XML uploaded?", answer: "No. Validation happens in your browser." },
    ],
  },
  "html-formatter": {
    intro: "Pretty-print HTML that arrived as one long tag noodle.",
    whatThisDoes:
      "HTML Formatter formats or minifies HTML text with indentation controls and quick browser-only output.",
    whenToUse:
      "Use it for snippets from CMS fields, emails, docs, templates, or copied markup that needs to be readable.",
    howItWorks:
      "Paste HTML, choose indentation or minify mode, and copy the formatted output. The tool treats markup as text.",
    limitations:
      "It is a lightweight formatter, so very unusual HTML may not be rearranged exactly like a dedicated code formatter.",
    useCases: ["Tidying copied markup.", "Preparing snippets for docs.", "Minifying small HTML fragments."],
    faqs: [
      { question: "Does this execute scripts?", answer: "No. HTML is handled as text and not executed." },
      { question: "Can it format full pages?", answer: "Yes for practical cleanup, though huge files belong in a real editor." },
    ],
  },
  "css-formatter": {
    intro: "Make CSS readable again after minifiers, copy-paste, or one very ambitious single line.",
    whatThisDoes:
      "CSS Formatter prettifies or minifies stylesheet text with indentation settings and copyable output.",
    whenToUse:
      "Use it for quick CSS snippets, copied styles, theme overrides, CMS custom CSS, or small debugging chores.",
    howItWorks:
      "Paste CSS, choose indentation or minify, and review the output. Formatting happens locally.",
    limitations:
      "It is intended for practical formatting, not full linting, prefixing, or CSS correctness guarantees.",
    useCases: ["Pretty-printing minified CSS.", "Cleaning theme snippets.", "Preparing styles for docs or comments."],
    faqs: [
      { question: "Will it fix invalid CSS?", answer: "No. It formats text and may show a friendly failure if formatting cannot continue." },
      { question: "Does it load globally?", answer: "No. It only runs on the formatter page in the browser." },
    ],
  },
  "javascript-formatter": {
    intro: "Format JavaScript as text, with absolutely no surprise execution. The code stays politely on the page.",
    whatThisDoes:
      "JavaScript Formatter prettifies JS text with indentation controls, sample loading, copy, and clear controls.",
    whenToUse:
      "Use it for snippets, config-like JavaScript, bookmarklet-ish fragments, docs examples, and quick readability checks.",
    howItWorks:
      "Paste code text, choose indentation, and format. The tool does not run user JavaScript.",
    limitations:
      "Formatting is lightweight. Complex modern syntax may not be handled as deeply as a full editor formatter.",
    useCases: ["Cleaning copied JS snippets.", "Preparing code for documentation.", "Making minified examples easier to inspect."],
    faqs: [
      { question: "Does this execute my JavaScript?", answer: "No. It formats code as text and never runs it." },
      { question: "Can it replace Prettier?", answer: "No. It is a quick browser utility, not a project formatter." },
    ],
  },
  "markdown-to-html": {
    intro: "Turn Markdown into HTML and preview the result without leaving your browser.",
    whatThisDoes:
      "Markdown to HTML converts common Markdown into sanitized HTML for headings, lists, links, blockquotes, code, and tables.",
    whenToUse:
      "Use it for docs, notes, README sections, CMS drafts, email fragments, and simple content migrations.",
    howItWorks:
      "Paste Markdown, inspect rendered preview, and copy the generated HTML. Rendering avoids executing scripts.",
    limitations:
      "Markdown flavors differ by platform. Very platform-specific extensions may not match their final destination exactly.",
    useCases: ["Converting README snippets.", "Preparing CMS HTML.", "Checking Markdown output before publishing."],
    faqs: [
      { question: "Is rendered HTML sanitized?", answer: "Yes. The renderer escapes risky markup so previewing does not execute scripts." },
      { question: "Does it support tables?", answer: "Yes, practical Markdown tables are supported by the existing renderer." },
    ],
  },
  "html-to-markdown": {
    intro: "Convert common HTML into Markdown when the web hands you tags and you wanted plain text with manners.",
    whatThisDoes:
      "HTML to Markdown converts headings, paragraphs, links, lists, emphasis, code, blockquotes, and simple tables into Markdown.",
    whenToUse:
      "Use it when moving content from CMS exports, docs, emails, snippets, or old pages into Markdown-based workflows.",
    howItWorks:
      "Paste HTML, choose what to preserve, and copy the Markdown output. Unsupported complexity gets a friendly warning.",
    limitations:
      "Complex layouts, scripts, forms, and heavily styled HTML cannot be perfectly represented as Markdown.",
    useCases: ["Migrating simple HTML docs.", "Converting articles to Markdown.", "Cleaning snippets for README files."],
    faqs: [
      { question: "Can it convert tables?", answer: "It supports simple tables where the structure is clear." },
      { question: "Does it preserve CSS?", answer: "No. Markdown is content-focused and does not preserve styling." },
    ],
  },
  "table-to-markdown": {
    intro: "Paste CSV, TSV, or spreadsheet cells and get a Markdown table that does not wobble.",
    whatThisDoes:
      "Table to Markdown converts delimited table text into a Markdown table with header and alignment options.",
    whenToUse:
      "Use it when copied spreadsheet data needs to go into a README, issue, docs page, changelog, or note.",
    howItWorks:
      "Paste rows, choose header and alignment options, preview the table, and copy the Markdown output.",
    limitations:
      "CSV parsing is practical and lightweight. Very complex quoted CSV can need a dedicated spreadsheet export workflow.",
    useCases: ["Converting spreadsheet rows.", "Creating README tables.", "Turning CSV snippets into Markdown."],
    faqs: [
      { question: "Can I paste directly from a spreadsheet?", answer: "Yes. Tab-separated copied cells are supported." },
      { question: "Can I align columns?", answer: "Yes. Choose left, center, or right alignment." },
    ],
  },
  "markdown-table-generator": {
    intro: "Build Markdown tables with an editable grid instead of counting pipes like a tiny spreadsheet accountant.",
    whatThisDoes:
      "Markdown Table Generator lets you edit cells, add or remove rows and columns, set header behavior, align columns, and copy Markdown.",
    whenToUse:
      "Use it when creating tables for README files, docs, notes, GitHub issues, release notes, or plain-text reports.",
    howItWorks:
      "Edit the grid, adjust rows, columns, and alignment, and the Markdown table updates live.",
    limitations:
      "The grid is intentionally simple. For large datasets, paste into Table to Markdown instead.",
    useCases: ["Creating small docs tables.", "Drafting README comparison tables.", "Building issue-template tables."],
    faqs: [
      { question: "Can I add columns on mobile?", answer: "Yes, the controls are mobile-friendly, though wide tables naturally scroll." },
      { question: "Can the first row be a header?", answer: "Yes. The first row can be treated as the Markdown table header." },
    ],
  },
  "utm-builder": {
    intro: "Build a campaign URL without a spreadsheet, a bookmark, and a small sigh.",
    whatThisDoes:
      "UTM Builder adds source, medium, campaign, term, and content parameters to a valid base URL and shows the final link.",
    whenToUse:
      "Use it for newsletters, social posts, launch links, partner campaigns, paid links, and tidy campaign tracking.",
    howItWorks:
      "Enter a base URL and UTM fields. The tool validates the URL, encodes parameters, and builds the final URL locally.",
    limitations:
      "It builds URLs; it does not test analytics setup or guarantee how your analytics platform groups campaign data.",
    useCases: ["Building newsletter links.", "Preparing campaign URLs.", "Creating consistent source and medium parameters."],
    faqs: [
      { question: "Is the URL sent to analytics?", answer: "No. The full URL is never sent through Unannoy analytics." },
      { question: "Can I leave optional fields blank?", answer: "Yes. Blank UTM fields are skipped." },
    ],
  },
  "qr-code-generator": {
    intro: "Generate a QR code locally for text or links, then download it without uploading the content.",
    whatThisDoes:
      "QR Code Generator creates QR codes in the browser with size and error-correction options plus PNG and SVG downloads.",
    whenToUse:
      "Use it for event links, menus, docs, Wi-Fi instructions, forms, product pages, or any short text that needs a scannable square.",
    howItWorks:
      "Enter text or a URL, choose output settings, and download the generated QR code. The data stays in your browser.",
    limitations:
      "Very long text can produce dense QR codes that are harder to scan. Always test printed codes before relying on them.",
    useCases: ["Creating QR codes for links.", "Generating printable codes.", "Sharing short text snippets locally."],
    faqs: [
      { question: "Is QR content uploaded?", answer: "No. QR generation happens locally in your browser." },
      { question: "Should I test the code?", answer: "Yes. Test QR codes after resizing or printing, especially for small labels." },
    ],
  },
  "qr-code-reader": {
    intro: "Upload a QR image and decode it locally when the picture is clear enough to cooperate.",
    whatThisDoes:
      "QR Code Reader reads an uploaded image in the browser, tries to detect a QR code, and shows the decoded text.",
    whenToUse:
      "Use it when you have a screenshot or saved QR image and want to inspect what it contains before opening it.",
    howItWorks:
      "Choose an image file, the browser reads pixel data locally, and the decoder returns text if a QR code is found.",
    limitations:
      "Detection can fail for blurry, cropped, low-contrast, distorted, or very small QR codes.",
    useCases: ["Checking QR screenshots.", "Reading saved QR images.", "Inspecting a QR code before visiting a link."],
    faqs: [
      { question: "Is my image uploaded?", answer: "No. The image is processed in your browser." },
      { question: "What if no QR is detected?", answer: "The tool shows a friendly failure message so you can try a clearer image." },
    ],
  },
  "image-compressor": {
    intro: "Shrink image files locally before upload forms start judging your megabytes.",
    whatThisDoes:
      "Image Compressor re-encodes images in the browser with quality and optional dimension controls, then shows size savings and preview.",
    whenToUse:
      "Use it for profile images, blog images, forms, attachments, portfolio images, or any upload with a file-size limit.",
    howItWorks:
      "Load an image, adjust quality and dimensions, preview the output, and download the compressed file. The image stays local.",
    limitations:
      "Compression quality depends on the source image and format. PNG transparency and browser encoder support can affect output size.",
    useCases: ["Reducing upload size.", "Preparing web images.", "Compressing screenshots before sharing."],
    faqs: [
      { question: "Is the image uploaded?", answer: "No. Compression uses browser canvas APIs locally." },
      { question: "Why is a PNG sometimes larger?", answer: "Some images compress better as JPEG or WebP; PNG is not always the smallest format." },
    ],
  },
  "image-resizer": {
    intro: "Resize an image in-browser when you need dimensions, not a full design app.",
    whatThisDoes:
      "Image Resizer changes width, height, or percentage locally, with aspect-ratio lock, preview, and download.",
    whenToUse:
      "Use it for upload requirements, thumbnails, profile photos, docs screenshots, blog images, and small visual prep.",
    howItWorks:
      "Load an image, set dimensions or scale percentage, preview the result, and download the resized file.",
    limitations:
      "Canvas resizing is practical for everyday images, but very large files can be limited by device memory.",
    useCases: ["Matching exact upload dimensions.", "Making thumbnails.", "Reducing screenshot dimensions."],
    faqs: [
      { question: "Can it keep aspect ratio?", answer: "Yes. Keep the lock enabled to update the other dimension automatically." },
      { question: "Is resizing local?", answer: "Yes. The image is processed in your browser." },
    ],
  },
  "image-to-webp": {
    intro: "Convert images to WebP locally and see whether the file gets delightfully smaller.",
    whatThisDoes:
      "Convert Image to WebP re-encodes supported browser image formats as WebP with a quality slider, preview, and size comparison.",
    whenToUse:
      "Use it when preparing faster web images, reducing upload size, or testing whether WebP is better for a specific image.",
    howItWorks:
      "Load an image, adjust quality, preview the WebP output, and download the converted file.",
    limitations:
      "WebP export depends on browser support. Some images may not shrink much, especially already optimized sources.",
    useCases: ["Creating web-friendly images.", "Reducing JPEG screenshots.", "Testing WebP output quality."],
    faqs: [
      { question: "Will every browser export WebP?", answer: "Modern browsers usually do, but the tool shows a warning if export is unavailable." },
      { question: "Does conversion upload the image?", answer: "No. Conversion happens locally." },
    ],
  },
  "png-to-jpg": {
    intro: "Convert PNG to JPG locally, with a background color for transparent parts that need a landing spot.",
    whatThisDoes:
      "PNG to JPG Converter draws a PNG onto a canvas background, applies quality settings, and exports a JPG file.",
    whenToUse:
      "Use it when a site only accepts JPG, when PNG files are too large, or when transparency is not needed.",
    howItWorks:
      "Load a PNG, choose background color and quality, preview the JPG, and download it.",
    limitations:
      "JPG does not support transparency, so transparent pixels must become a background color.",
    useCases: ["Converting transparent PNGs for uploads.", "Reducing photo-like PNG size.", "Preparing JPG-only form uploads."],
    faqs: [
      { question: "What happens to transparency?", answer: "Transparent areas are filled with your selected background color." },
      { question: "Is conversion local?", answer: "Yes. The PNG is converted in your browser." },
    ],
  },
  "jpg-to-png": {
    intro: "Convert JPG to PNG locally when a workflow asks for PNG even if the file gets chunkier.",
    whatThisDoes:
      "JPG to PNG Converter re-encodes JPG or JPEG images as PNG using browser canvas APIs.",
    whenToUse:
      "Use it for upload requirements, screenshots, docs workflows, or apps that specifically need PNG input.",
    howItWorks:
      "Load a JPG, preview the PNG output, compare sizes, and download the converted file.",
    limitations:
      "PNG can be much larger than JPG, and converting does not restore quality lost in the original JPEG.",
    useCases: ["Meeting PNG-only upload rules.", "Converting small graphics.", "Preparing screenshots for docs."],
    faqs: [
      { question: "Why did the PNG get bigger?", answer: "PNG is lossless and can be larger than JPG, especially for photos." },
      { question: "Does it improve image quality?", answer: "No. It changes format, but cannot recover detail lost by JPEG compression." },
    ],
  },
  "remove-image-metadata": {
    intro: "Strip most common metadata by re-encoding the image locally before sharing.",
    whatThisDoes:
      "Remove Image Metadata redraws an image through browser canvas and exports a new file, which removes most embedded metadata.",
    whenToUse:
      "Use it before sharing images when you want to reduce common EXIF or metadata baggage without uploading the file.",
    howItWorks:
      "Load an image, the browser re-encodes pixels into a fresh file, and you download the cleaned version.",
    limitations:
      "This removes most common metadata but is not a forensic privacy guarantee. Some metadata-like information can exist outside standard EXIF.",
    useCases: ["Sharing photos with less metadata.", "Cleaning images before upload.", "Reducing accidental device/location hints."],
    faqs: [
      { question: "Is this perfect metadata removal?", answer: "No. It is a practical browser re-encode, not a forensic security tool." },
      { question: "Is the image uploaded?", answer: "No. Re-encoding happens locally in your browser." },
    ],
  },
  "online-timer": {
    intro: "Set a timer, keep the tab open, and let the browser handle the countdown without needing an account.",
    whatThisDoes:
      "Online Timer provides custom durations, presets, start, pause, reset, progress, a completion sound, and locally saved preferred duration.",
    whenToUse:
      "Use it for focused work, breaks, cooking checks, rehearsal blocks, workouts, study sessions, and tiny deadlines.",
    howItWorks:
      "Choose a preset or custom duration, start the timer, and keep the tab open. The timer runs in your browser.",
    limitations:
      "Browser timers may pause or drift if the device sleeps, the browser throttles background tabs, or audio is blocked.",
    useCases: ["Running focus sessions.", "Timing breaks.", "Managing short tasks without a dedicated app."],
    faqs: [
      { question: "Will it work if my laptop sleeps?", answer: "No timer can reliably run while the device is asleep. Keep the device awake for important timers." },
      { question: "What is saved locally?", answer: "Only the preferred duration is saved, not labels or personal task details." },
    ],
  },
  stopwatch: {
    intro: "Start, pause, lap, and copy timings with a simple stopwatch that stays out of the way.",
    whatThisDoes:
      "Stopwatch tracks elapsed time, supports laps, optional milliseconds, copyable lap summaries, and clear/reset controls.",
    whenToUse:
      "Use it for quick timing, practice runs, exercise sets, debugging sessions, rehearsal checks, and anything that needs laps.",
    howItWorks:
      "Start the stopwatch, add laps when needed, pause or reset, and copy the lap list if you need to save it somewhere else.",
    limitations:
      "Timing depends on browser scheduling and device state. It is practical for everyday use, not certified measurement.",
    useCases: ["Timing repeated tasks.", "Recording lap splits.", "Measuring short practice sessions."],
    faqs: [
      { question: "Are laps saved automatically?", answer: "No. Laps stay in the current page session unless you copy them." },
      { question: "Can I hide milliseconds?", answer: "Yes. Use the display toggle for a calmer stopwatch face." },
    ],
  },
} satisfies Record<string, ToolContent>;
