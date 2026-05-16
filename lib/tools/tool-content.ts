export type ToolContentFaq = {
  question: string;
  answer: string;
};

export type ToolContent = {
  intro: string;
  whatThisDoes: string;
  whenToUse: string;
  howItWorks: string;
  useCases: string[];
  faqs: ToolContentFaq[];
};

export const toolContent = {
  "text-cleaner": {
    intro:
      "Paste messy text from a PDF, email, document, or app export and clean it up without a production.",
    whatThisDoes:
      "Text Cleaner trims stray spacing, removes empty lines, normalizes awkward line breaks, and helps turn copied text into something you can actually use.",
    whenToUse:
      "Use it when text looks fine in one place but pastes with weird gaps, doubled spaces, blank rows, tabs, or invisible junk somewhere else.",
    howItWorks:
      "Choose the cleanup options you want, review the cleaned output, then copy the result. Everything runs locally in your browser.",
    useCases: [
      "Clean text copied out of PDFs, emails, or CMS editors.",
      "Remove blank lines and extra spacing before sending a note.",
      "Prepare pasted text for spreadsheets, tickets, docs, or forms.",
    ],
    faqs: [
      {
        question: "Does Text Cleaner upload my text?",
        answer: "No. The cleanup happens in your browser, so your text does not need to leave your device.",
      },
      {
        question: "Can I choose what gets cleaned?",
        answer: "Yes. Use the available options so you can fix spacing, lines, or duplicates without changing parts you want to keep.",
      },
    ],
  },
  "word-counter": {
    intro:
      "Count words quickly when a draft, post, essay, listing, or application has to fit a limit.",
    whatThisDoes:
      "Word Counter measures words, characters, sentences, paragraphs, lines, and estimated reading time from pasted text.",
    whenToUse:
      "Use it before publishing, submitting, or sending text where length matters more than you expected five minutes ago.",
    howItWorks:
      "Paste your text and the counts update immediately. Reading and speaking estimates are calculated from the current text length.",
    useCases: [
      "Check essay, article, and application word counts.",
      "Estimate whether a script or page is too long.",
      "Compare character counts with and without spaces.",
    ],
    faqs: [
      {
        question: "What counts as a word?",
        answer: "A word is counted from readable text separated by whitespace and punctuation, which fits normal writing checks.",
      },
      {
        question: "Is reading time exact?",
        answer: "No. It is a practical estimate based on reading speed, useful for planning rather than timing every reader.",
      },
    ],
  },
  "character-counter": {
    intro:
      "Check character length before a bio, title, message, ad, or meta description gets cut off.",
    whatThisDoes:
      "Character Counter counts characters with and without spaces, plus related writing metrics like words, lines, and paragraphs.",
    whenToUse:
      "Use it when a platform gives you a strict limit and you need to know how close your text is before pasting it in.",
    howItWorks:
      "Paste or type text and the totals update as you edit. Compare the result against common limits or your own target.",
    useCases: [
      "Keep social posts, bios, and descriptions under limits.",
      "Check SMS, title, and metadata length.",
      "Trim labels or snippets until they fit a tight field.",
    ],
    faqs: [
      {
        question: "Does it count spaces?",
        answer: "Yes. You can see counts with spaces and without spaces, because different platforms use different rules.",
      },
      {
        question: "Can I use it for SEO snippets?",
        answer: "Yes. It is useful for keeping titles and meta descriptions in a reasonable length range.",
      },
    ],
  },
  "case-converter": {
    intro:
      "Convert text case without retyping headings, labels, filenames, code-ish names, or messy pasted titles.",
    whatThisDoes:
      "Case Converter changes text between formats like uppercase, lowercase, sentence case, title case, camelCase, PascalCase, snake_case, kebab-case, and slug case.",
    whenToUse:
      "Use it when the words are right but the capitalization or separator style is wrong for the place they need to go.",
    howItWorks:
      "Paste the original text, pick a case format, and copy the converted result while keeping your input intact.",
    useCases: [
      "Turn rough titles into clean heading case.",
      "Create URL slugs from page names.",
      "Convert labels into identifiers for config, code, or spreadsheets.",
    ],
    faqs: [
      {
        question: "Will it change the original input?",
        answer: "No. The converted text is shown separately so you can compare before copying.",
      },
      {
        question: "What is the difference between kebab case and slug case?",
        answer: "Both use hyphens, but slug case is usually lowercased and cleaned for URLs.",
      },
    ],
  },
  "remove-duplicate-lines": {
    intro:
      "Remove repeated lines from a pasted list while keeping the useful items easy to review.",
    whatThisDoes:
      "Remove Duplicate Lines finds repeated rows in plain text and keeps one copy, with cleanup options for common list noise.",
    whenToUse:
      "Use it after copying names, emails, tags, keywords, IDs, or notes from places that love repeating themselves.",
    howItWorks:
      "Paste a list, choose how strict matching should be, and copy the deduplicated result.",
    useCases: [
      "Deduplicate email addresses, names, or IDs.",
      "Clean repeated keyword and tag exports.",
      "Remove copied list repeats before sorting or sharing.",
    ],
    faqs: [
      {
        question: "Does line order stay the same?",
        answer: "The usual cleanup keeps the first copy of each line and preserves the original order.",
      },
      {
        question: "Can blank lines be removed too?",
        answer: "Yes. Blank-line cleanup belongs naturally with deduping and helps keep the final list compact.",
      },
    ],
  },
  "sort-lines": {
    intro:
      "Sort a pasted list without opening a spreadsheet for a job that should take a few seconds.",
    whatThisDoes:
      "Sort Lines organizes plain-text rows alphabetically, reverses order when needed, and helps make quick lists easier to scan.",
    whenToUse:
      "Use it for names, labels, keywords, URLs, notes, or any one-item-per-line text that needs a predictable order.",
    howItWorks:
      "Paste lines, choose the sort direction or style, then copy the reordered list.",
    useCases: [
      "Alphabetize names, tags, labels, or short notes.",
      "Sort lists before comparing two versions.",
      "Put copied rows into a cleaner order before sharing.",
    ],
    faqs: [
      {
        question: "Will it change the text inside each line?",
        answer: "No. Sorting changes the line order, not the wording of the lines themselves.",
      },
      {
        question: "Should I deduplicate before or after sorting?",
        answer: "Either can work. Deduplicate first if you want fewer lines to review, sort first if you want repeats grouped together.",
      },
    ],
  },
  "line-counter": {
    intro:
      "Count lines in pasted text when rows, records, bullets, or entries matter more than word count.",
    whatThisDoes:
      "Line Counter reports total lines, non-empty lines, blank lines, and related list-friendly counts.",
    whenToUse:
      "Use it for quick audits of lists, logs, CSV snippets, copied rows, prompts, scripts, or batch input.",
    howItWorks:
      "Paste text and the line totals update instantly, separating blank and filled lines so the count is useful.",
    useCases: [
      "Count rows before importing or pasting data.",
      "Check how many bullet items are in a list.",
      "Spot accidental blank lines in copied text.",
    ],
    faqs: [
      {
        question: "Are blank lines counted?",
        answer: "Yes. Blank lines are counted separately so you can tell the difference between total lines and real entries.",
      },
      {
        question: "Is this different from Word Counter?",
        answer: "Yes. Word Counter is about writing length; Line Counter is focused on rows and list structure.",
      },
    ],
  },
  "list-cleaner": {
    intro:
      "Turn copied bullets, numbered lists, and inconsistent rows into a tidy plain-text list.",
    whatThisDoes:
      "List Cleaner removes list clutter such as bullets, numbering, extra spacing, empty lines, and duplicate items.",
    whenToUse:
      "Use it when a list copied from a doc, page, chat, or spreadsheet looks uneven after pasting.",
    howItWorks:
      "Paste the list, select the cleanup rules you want, then copy the normalized result.",
    useCases: [
      "Clean copied checklist items before sending them.",
      "Strip bullets or numbering from pasted outlines.",
      "Normalize rough lists before sorting or importing.",
    ],
    faqs: [
      {
        question: "Can it keep the item text but remove bullets?",
        answer: "Yes. The goal is to remove the marker noise while keeping the useful wording.",
      },
      {
        question: "Will it work with numbered lists?",
        answer: "Yes. Numbering cleanup is useful when you need plain lines instead of formatted list items.",
      },
    ],
  },
  "reading-time-calculator": {
    intro:
      "Estimate how long text will take to read, skim, or speak before it reaches the audience.",
    whatThisDoes:
      "Reading Time Calculator turns word count into practical timing estimates for articles, scripts, pages, and messages.",
    whenToUse:
      "Use it when you need a quick sense of whether something feels like a one-minute note, a five-minute read, or a longer sit-down.",
    howItWorks:
      "Paste text and the calculator estimates time from word count and reading speed assumptions.",
    useCases: [
      "Add a reading-time estimate to a blog post.",
      "Time a script before recording or presenting.",
      "Compare short and long versions of the same draft.",
    ],
    faqs: [
      {
        question: "Why does reading speed matter?",
        answer: "People read at different speeds, so estimates are based on a words-per-minute rate rather than a fixed timer.",
      },
      {
        question: "Can I use it for speaking time?",
        answer: "Yes. Speaking estimates are useful for scripts, talks, videos, and voiceovers.",
      },
    ],
  },
  "json-formatter": {
    intro:
      "Format JSON so it is readable before you inspect, share, debug, or paste it somewhere stricter.",
    whatThisDoes:
      "JSON Formatter pretty-prints valid JSON, helps expose structure, and makes compact API responses easier to understand.",
    whenToUse:
      "Use it when a blob of JSON is technically correct but too dense to scan without hurting your patience.",
    howItWorks:
      "Paste JSON, format it with consistent indentation, then copy the readable version for review or debugging.",
    useCases: [
      "Pretty-print API responses and config snippets.",
      "Inspect nested objects and arrays more comfortably.",
      "Clean compact JSON before sharing it in docs or tickets.",
    ],
    faqs: [
      {
        question: "Does formatting change the data?",
        answer: "No. Formatting changes whitespace and indentation, not the JSON values.",
      },
      {
        question: "Can it fix broken JSON?",
        answer: "It can point you toward invalid syntax, but badly broken JSON still needs a deliberate edit.",
      },
    ],
  },
  "xml-formatter": {
    intro:
      "Make XML easier to read when tags, attributes, and nested nodes arrive as one long wall.",
    whatThisDoes:
      "XML Formatter indents XML into a clearer structure so you can review feeds, config, markup, or service responses.",
    whenToUse:
      "Use it when XML is valid enough to parse but too cramped to understand at a glance.",
    howItWorks:
      "Paste XML, format it with consistent nesting, and copy the cleaned version for review or handoff.",
    useCases: [
      "Format XML API responses or SOAP payloads.",
      "Inspect sitemap, feed, and config files.",
      "Make nested markup easier to compare in a review.",
    ],
    faqs: [
      {
        question: "Will XML Formatter remove tags?",
        answer: "No. Formatting should preserve tags and content while making the structure easier to read.",
      },
      {
        question: "Does it validate every XML rule?",
        answer: "It is meant for quick formatting and basic parsing feedback, not as a full schema validator.",
      },
    ],
  },
  "markdown-viewer": {
    intro:
      "Preview Markdown before it lands in a README, issue, note, changelog, or static page.",
    whatThisDoes:
      "Markdown Viewer renders Markdown into a readable preview so headings, lists, links, code blocks, and tables are easier to check.",
    whenToUse:
      "Use it when Markdown is easy to write but you still want to see how it will read before sharing it.",
    howItWorks:
      "Paste Markdown on one side and review the rendered preview, then adjust the source until it looks right.",
    useCases: [
      "Preview README updates and documentation notes.",
      "Check links, lists, code blocks, and tables.",
      "Draft changelog or issue text before publishing.",
    ],
    faqs: [
      {
        question: "Does the preview save my Markdown?",
        answer: "No. The preview is for local drafting and review in the browser.",
      },
      {
        question: "Will every website render Markdown identically?",
        answer: "Not always. Markdown flavors vary, but a preview catches most structure and readability issues.",
      },
    ],
  },
  "url-cleaner": {
    intro:
      "Clean long copied links by removing common tracking parameters while keeping the useful destination intact.",
    whatThisDoes:
      "URL Cleaner removes noisy query parameters such as UTM tags, fbclid, gclid, msclkid, ref, and ref_src from pasted URLs.",
    whenToUse:
      "Use it before sharing product pages, articles, search results, or campaign links that arrived with a little too much baggage.",
    howItWorks:
      "Paste a URL, choose whether to keep the fragment, review removed parameters, and copy the cleaned link. The parsing happens locally.",
    useCases: [
      "Remove tracking clutter before pasting links in chats or docs.",
      "Make long article and product URLs easier to read.",
      "Check which parameters were removed before sharing a link.",
    ],
    faqs: [
      {
        question: "Will URL Cleaner shorten my link?",
        answer: "No. It keeps the original destination and removes known tracking parameters rather than creating a new short URL.",
      },
      {
        question: "Can cleaning a URL break it?",
        answer: "Usually tracking parameters are safe to remove, but unusual sites may rely on query parameters. Review the cleaned URL before important use.",
      },
    ],
  },
  "utm-remover": {
    intro:
      "Remove UTM campaign tags from URLs when you want the link without the marketing breadcrumbs.",
    whatThisDoes:
      "UTM Remover focuses on utm_source, utm_medium, utm_campaign, utm_term, and utm_content, with an option to remove other known trackers too.",
    whenToUse:
      "Use it when a link is useful but the campaign labels are not needed in a message, note, document, or personal bookmark.",
    howItWorks:
      "Paste the URL, choose UTM-only cleanup or broader tracker cleanup, then copy the cleaned URL from the browser-generated result.",
    useCases: [
      "Clean newsletter links before saving them.",
      "Remove campaign parameters from article or product URLs.",
      "Compare a raw URL with its cleaned version before sharing.",
    ],
    faqs: [
      {
        question: "What does UTM mean?",
        answer: "UTM parameters are campaign tracking labels commonly added to URLs for analytics attribution.",
      },
      {
        question: "Does this send the URL anywhere?",
        answer: "No. The URL is parsed and cleaned in your browser, and analytics events do not include the URL text.",
      },
    ],
  },
  "slug-generator": {
    intro:
      "Turn headings, titles, page names, and ideas into tidy URL slugs without hand-deleting every awkward symbol.",
    whatThisDoes:
      "Slug Generator converts text into a URL-friendly slug with options for lowercase output, stop-word removal, separators, length, and symbols.",
    whenToUse:
      "Use it while naming blog posts, docs pages, product pages, anchors, filenames, or anything that should be readable in a URL.",
    howItWorks:
      "Paste a title, adjust slug options, and copy the generated output. Accents and punctuation are cleaned locally in the browser.",
    useCases: [
      "Create readable blog or docs page slugs.",
      "Convert product names into clean URL paths.",
      "Make consistent filenames or anchors from titles.",
    ],
    faqs: [
      {
        question: "Should slugs use hyphens or underscores?",
        answer: "Hyphens are common for public URLs, while underscores can be useful for internal names or systems that expect them.",
      },
      {
        question: "Can I keep stop words?",
        answer: "Yes. Stop-word removal is optional because sometimes small words make a slug clearer.",
      },
    ],
  },
  "base64-encoder-decoder": {
    intro:
      "Encode text to Base64 or decode Base64 back to readable text without opening a random mystery site.",
    whatThisDoes:
      "Base64 Encoder/Decoder converts UTF-8 text to Base64 and decodes valid Base64 input back into text.",
    whenToUse:
      "Use it for quick checks around tokens, payload snippets, small config values, or documentation examples that need Base64 conversion.",
    howItWorks:
      "Choose encode or decode, paste the text, and copy the output. Invalid Base64 gets a friendly error instead of a silent shrug.",
    useCases: [
      "Decode small Base64 snippets while debugging.",
      "Encode example text for documentation or test data.",
      "Check whether a pasted Base64 value is valid text.",
    ],
    faqs: [
      {
        question: "Is Base64 encryption?",
        answer: "No. Base64 is encoding, not security. Anyone can decode it if they have the text.",
      },
      {
        question: "Can this handle Unicode text?",
        answer: "Yes. The tool encodes and decodes UTF-8 text, so normal Unicode characters are supported.",
      },
    ],
  },
  "url-encoder-decoder": {
    intro:
      "Encode URL components or decode percent-encoded text when a query string starts looking like keyboard confetti.",
    whatThisDoes:
      "URL Encoder/Decoder converts text using URL-safe escaping and can work with individual components or full URLs.",
    whenToUse:
      "Use it while preparing query parameters, decoding copied links, debugging redirects, or checking API examples.",
    howItWorks:
      "Choose encode or decode, select component or full URL mode, then copy the transformed text from the live result.",
    useCases: [
      "Encode query parameter values before building a URL.",
      "Decode percent-encoded strings from logs or links.",
      "Check whether a full URL has valid escaping.",
    ],
    faqs: [
      {
        question: "When should I use component mode?",
        answer: "Use component mode for query values or path pieces. It escapes more characters than full URL mode.",
      },
      {
        question: "Why can decoding fail?",
        answer: "A malformed percent escape, such as a lonely percent sign, is not valid URL encoding and needs to be fixed first.",
      },
    ],
  },
  "json-validator": {
    intro:
      "Validate JSON and get a readable error before one missing comma steals the next ten minutes.",
    whatThisDoes:
      "JSON Validator checks whether pasted JSON parses correctly and can format valid JSON for easier review.",
    whenToUse:
      "Use it when a config file, API response, payload, or copied snippet needs a quick sanity check before you use it elsewhere.",
    howItWorks:
      "Paste JSON, review the valid or invalid status, and use the line or position hint when the browser parser can provide one.",
    useCases: [
      "Check JSON snippets before putting them into config.",
      "Find parse errors in copied API payloads.",
      "Format valid JSON after checking that it parses.",
    ],
    faqs: [
      {
        question: "Can it repair invalid JSON automatically?",
        answer: "No. It validates and points to the issue where possible, but deliberate edits are safer than guessing repairs.",
      },
      {
        question: "Does JSON validation upload my payload?",
        answer: "No. Validation uses the browser's JSON parser, and analytics events never include the JSON text.",
      },
    ],
  },
  "json-minifier": {
    intro:
      "Minify JSON into a compact string while validating it first, because broken compact JSON is just sadness with fewer spaces.",
    whatThisDoes:
      "JSON Minifier parses valid JSON and removes unnecessary whitespace so the output is compact and copy-ready.",
    whenToUse:
      "Use it when JSON needs to fit into an environment variable, test fixture, request body, config field, or tiny documentation snippet.",
    howItWorks:
      "Paste JSON, let the browser validate and minify it, then compare before-and-after sizes and copy the compact result.",
    useCases: [
      "Compact formatted JSON for config fields.",
      "Prepare request payload examples.",
      "Remove whitespace before storing small JSON snippets.",
    ],
    faqs: [
      {
        question: "Does minifying change values?",
        answer: "No. Valid JSON is parsed and stringified without extra whitespace, so values remain the same.",
      },
      {
        question: "What happens if the JSON is invalid?",
        answer: "The tool shows an error and does not produce a minified output until the JSON parses correctly.",
      },
    ],
  },
  "markdown-editor": {
    intro:
      "Write Markdown and preview it side by side before a README, note, issue, or changelog goes out wearing mismatched socks.",
    whatThisDoes:
      "Markdown Editor Preview gives you a local split-pane editor with rendered headings, lists, links, tables, blockquotes, and code blocks.",
    whenToUse:
      "Use it while drafting Markdown that needs both editing and visual review, especially docs, notes, release text, and issue descriptions.",
    howItWorks:
      "Type or paste Markdown, review the live preview, and copy either the Markdown source or rendered HTML when it is ready.",
    useCases: [
      "Draft README sections and changelog notes.",
      "Preview Markdown tables before publishing.",
      "Copy rendered HTML for simple docs or CMS fields.",
    ],
    faqs: [
      {
        question: "Is this different from Markdown Viewer?",
        answer: "Yes. Markdown Viewer is mostly for checking pasted Markdown, while this page is tuned for editing and previewing together.",
      },
      {
        question: "Does it support every Markdown flavor?",
        answer: "No. It supports practical basics and tables, but platform-specific Markdown features may render differently elsewhere.",
      },
    ],
  },
} satisfies Record<string, ToolContent>;

export const categoryContent = {
  tools: {
    intro:
      "A small set of practical browser tools for fixing text, checking length, cleaning lists, and tidying structured snippets.",
    whatThisDoes:
      "The tools collection gathers focused utilities that do one job quickly without requiring an account or a heavy workflow.",
    whenToUse:
      "Use it when you need a quick cleanup, count, conversion, preview, or formatting pass and do not want to open a larger app.",
    howItWorks:
      "Pick a tool, paste the content you are working with, adjust the options, and copy the result when it looks right.",
    useCases: [
      "Fix copied text before sending or publishing it.",
      "Check writing limits and timing estimates.",
      "Format developer snippets and preview Markdown drafts.",
    ],
    faqs: [
      {
        question: "Do these tools require an account?",
        answer: "No. They are built for quick browser use without a sign-in flow.",
      },
      {
        question: "Are the tools connected to each other?",
        answer: "They are separate on purpose, but related tools are grouped so you can move from cleanup to counting or formatting easily.",
      },
    ],
  },
  text: {
    intro:
      "Text tools for cleaning, counting, converting, sorting, and reshaping everyday writing.",
    whatThisDoes:
      "The text category covers common paste-and-fix tasks: remove clutter, count length, convert case, deduplicate rows, and tidy lists.",
    whenToUse:
      "Use these tools when text is almost ready but needs one small repair before it goes into a doc, form, message, CMS, or spreadsheet.",
    howItWorks:
      "Choose the text task, paste your content, set any options, then copy the cleaned or measured result.",
    useCases: [
      "Clean copied notes, emails, and PDF text.",
      "Check word, character, and line limits.",
      "Prepare lists before sorting, importing, or sharing.",
    ],
    faqs: [
      {
        question: "Can I combine text tools?",
        answer: "Yes. For example, clean text first, then count it, convert case, or deduplicate lines.",
      },
      {
        question: "Are these tools only for writers?",
        answer: "No. They are useful for support, operations, marketing, engineering, school work, and general admin chores.",
      },
    ],
  },
  developer: {
    intro:
      "Developer tools for quick formatting and inspection jobs that should not require opening an IDE.",
    whatThisDoes:
      "The developer category focuses on readable structured data, cleaner snippets, and lightweight checks for everyday technical work.",
    whenToUse:
      "Use it when a response, config, payload, or copied snippet needs quick formatting before you debug or share it.",
    howItWorks:
      "Paste the snippet into the relevant tool, format or inspect it locally, and copy the cleaned version back to your workflow.",
    useCases: [
      "Pretty-print JSON and XML responses.",
      "Inspect config or payload structure quickly.",
      "Prepare snippets for tickets, docs, or code review comments.",
    ],
    faqs: [
      {
        question: "Are these full developer environments?",
        answer: "No. They are small utilities for quick formatting and inspection between real development tasks.",
      },
      {
        question: "Can I use them with sensitive snippets?",
        answer: "They are designed for local browser workflows, but you should still avoid pasting secrets unless you understand the page behavior.",
      },
    ],
  },
  markdown: {
    intro:
      "Markdown tools for drafting, previewing, and checking plain-text documents before they go public.",
    whatThisDoes:
      "The markdown category helps you review Markdown structure, catch awkward formatting, and make docs easier to read.",
    whenToUse:
      "Use it before publishing README updates, notes, changelogs, issue templates, docs pages, or project writeups.",
    howItWorks:
      "Paste Markdown, preview the rendered result, then edit until headings, lists, links, code blocks, and tables look right.",
    useCases: [
      "Preview README and docs changes.",
      "Check Markdown tables, lists, and links.",
      "Draft release notes or issue text before posting.",
    ],
    faqs: [
      {
        question: "Is Markdown rendering the same everywhere?",
        answer: "No. Different platforms add their own flavor, but previewing still catches most common readability problems.",
      },
      {
        question: "Can Markdown tools help non-developers?",
        answer: "Yes. Markdown is common in notes, docs, CMS fields, and collaboration tools, not just code repositories.",
      },
    ],
  },
  link: {
    intro:
      "Link tools for cleaning and checking URLs before you paste them into chats, docs, emails, or posts.",
    whatThisDoes:
      "The link category is for quick URL chores like removing noisy tracking parameters and making copied links easier to share.",
    whenToUse:
      "Use it when a link is longer, messier, or more revealing than it needs to be.",
    howItWorks:
      "Paste a URL, review what the tool changes, and copy the cleaned link when the destination still looks right.",
    useCases: [
      "Remove common tracking clutter from shared links.",
      "Clean product, article, and campaign URLs.",
      "Make links easier to read in notes or messages.",
    ],
    faqs: [
      {
        question: "Will link tools shorten URLs?",
        answer: "They focus on cleaning the original URL, not creating a new short-link service.",
      },
      {
        question: "Could cleaning a link break it?",
        answer: "Most tracking parameters are safe to remove, but always review the final URL if the link has unusual parameters.",
      },
    ],
  },
  image: {
    intro:
      "Image tools for small visual cleanup and conversion jobs that do not need a full design app.",
    whatThisDoes:
      "The image category is for focused browser utilities that help prepare images for sharing, uploading, or everyday web use.",
    whenToUse:
      "Use it when an image needs a quick adjustment and opening a heavy editor would slow the whole task down.",
    howItWorks:
      "Choose the image task, load the file in your browser, adjust the options, and export the result when it is ready.",
    useCases: [
      "Prepare images for uploads with strict requirements.",
      "Make quick adjustments before sharing a file.",
      "Handle simple image chores without a full editor.",
    ],
    faqs: [
      {
        question: "Are image tools meant to replace design software?",
        answer: "No. They are for small, practical fixes, not complex editing or design work.",
      },
      {
        question: "Will image tools be useful on mobile?",
        answer: "Yes, where the browser allows it. The goal is quick adjustments from the device you already have open.",
      },
    ],
  },
  time: {
    intro:
      "Time tools for quick estimates, conversions, and planning checks when timing is the main question.",
    whatThisDoes:
      "The time category groups small calculators for understanding duration, reading time, scheduling details, and related everyday timing tasks.",
    whenToUse:
      "Use it when you need a fast answer about how long something takes or how time should be shown.",
    howItWorks:
      "Pick the timing task, enter the relevant text or values, and review the calculated result immediately.",
    useCases: [
      "Estimate reading or speaking duration.",
      "Plan content length around available time.",
      "Do small time calculations without a spreadsheet.",
    ],
    faqs: [
      {
        question: "Are time estimates exact?",
        answer: "Usually no. They are practical planning numbers, especially when human reading or speaking speed is involved.",
      },
      {
        question: "Why include reading time in time tools?",
        answer: "Reading time is a duration problem, so it fits naturally beside other quick planning calculators.",
      },
    ],
  },
} satisfies Record<string, ToolContent>;

export type ToolContentSlug = keyof typeof toolContent;
export type CategoryContentSlug = keyof typeof categoryContent;
