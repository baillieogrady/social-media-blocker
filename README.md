# social-media-blocker

A local Chrome extension that blocks social media sites, disables links to those sites, and hides their results on Google. LinkedIn stays accessible.

## Install

1. Unzip `social-media-blocker.zip` into a folder you will keep.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** at the top right.
4. Click **Load unpacked** and choose the `social-media-blocker` folder containing `manifest.json`.
5. Refresh existing tabs so link filtering takes effect. Pin social-media-blocker from Chrome’s extensions menu if you want its status panel nearby.

## What it does

- Blocks navigation to 71 listed domains and their subdomains, including addresses typed directly, redirects, bookmarks, and links opened in new tabs.
- Blocks requests and embeds served from listed domains.
- Crosses out social links and prevents normal clicks, middle clicks, and keyboard activation.
- Removes matching Google result cards where recognized; otherwise hides the matching link. Watches results loaded after the page opens.
- Leaves LinkedIn and its short links accessible.

Click the extension icon to see the 28 network groups. The complete domain list is in `sites.json`.

## Coverage and limitations

This uses a domain list, not automatic social-network detection. New platforms, regional domains not listed, independently hosted Mastodon/Lemmy instances, mirrors, proxies, and content reposted on other websites can escape the list. Mastodon coverage is a selection of major instances. Google changes its page layout, so some result snippets or cards may remain visible; blocked destinations still cannot load. Google filtering affects the displayed page after it arrives, not Google's index, autocomplete, or server-side results. A brief flash before filtering is possible.

Chrome internal pages and the Chrome Web Store do not allow content scripts. Incognito requires enabling this extension there. Disabling or removing the extension stops protection. This is a personal focus tool, not a tamper-proof restriction. Already loaded social pages need refreshing after installation.

## Add a domain

Edit `sites.json`, adding a bare domain such as `example.social` to a group. With Node.js installed, run `node build.mjs` from this folder. Then click **Reload** for block social media at `chrome://extensions` and refresh open tabs. Subdomains are included automatically. The builder rejects LinkedIn domains.

## Privacy and permissions

No account, analytics, remote code, browsing-history storage, or external service. All processing happens in Chrome. The extension requests the ability to block requests, plus content-script access to HTTP and HTTPS pages so it can identify social links and remove Google results. It does not transmit page contents.

## Quick check after installation

- Open `https://www.instagram.com`: Chrome should show its blocked-request error.
- Open `https://old.reddit.com`: it should also be blocked.
- Open YouTube: it should be blocked. Open LinkedIn: it should load.
- Search Google for `site:instagram.com`: matching results should disappear.
- On a page containing a Reddit link, try clicking and opening in a new tab: navigation should be blocked.

## Implementation

Manifest V3 static declarative network rules perform blocking. Content scripts filter links and Google cards. `sites.json` is the source for generated `sites.js` and `rules.json`; no dependencies are needed to run the extension.

Chrome documentation: https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest
