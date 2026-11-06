<div align="center">

# 🧭 IndieCompass

### Find your next favorite game. Follow your curiosity.

A sleek desktop companion for exploring Steam.<br>
**Combine genres. Discover new worlds. Keep your favorites close.**

<p>
  <img src="https://img.shields.io/badge/version-2.1.0-c6f76a?style=for-the-badge&amp;labelColor=17222e" alt="Version 2.1.0">
  <img src="https://img.shields.io/badge/Node.js-24%2B-8cc84b?style=for-the-badge&amp;logo=nodedotjs&amp;logoColor=white&amp;labelColor=17222e" alt="Node.js 24 or newer">
  <img src="https://img.shields.io/badge/JavaScript-ES_Modules-f7df1e?style=for-the-badge&amp;logo=javascript&amp;logoColor=f7df1e&amp;labelColor=17222e" alt="JavaScript ES modules">
</p>
<p>
  <img src="https://img.shields.io/badge/platform-Windows-a9b8ca?style=flat-square&amp;labelColor=17222e" alt="Windows launcher">
  <img src="https://img.shields.io/badge/interface-Russian-c6f76a?style=flat-square&amp;labelColor=17222e" alt="Russian interface">
  <img src="https://img.shields.io/badge/license-MIT-c6f76a?style=flat-square&amp;labelColor=17222e" alt="MIT license">
  <img src="https://img.shields.io/badge/hosting-not_required-a9b8ca?style=flat-square&amp;labelColor=17222e" alt="No hosting required">
</p>

[Quick start](#-quick-start) · [Features](#-features) · [Filters](#-find-exactly-what-you-feel-like-playing) · [FAQ](#-faq--troubleshooting) · [Development](#-development)

</div>

---

## ✨ A little less searching. A lot more discovering.

Looking for an **indie horror game**? A **simulator to get lost in**? Something atmospheric you have never heard of?

**IndieCompass** brings Steam discovery into a focused, dark interface with flexible filters, rich game pages, and a personal collection of favorites. Instead of browsing a small built-in list, you search the Steam storefront and load more results as you explore.

> [!NOTE]
> The current app interface is **in Russian**. This README is written in English to make the project easier to explore and contribute to.

<table>
<tr>
<td width="33%" valign="top">

### 🎯 Find your kind of game

Combine genres and narrow down release dates, platforms, languages, reviews, and player modes.

</td>
<td width="33%" valign="top">

### 🔍 Look before you leap

Read descriptions, explore screenshots, and check minimum and recommended system requirements.

</td>
<td width="33%" valign="top">

### ♡ Keep the good finds

Save favorites, hide games you are not interested in, and keep preferences on your own device.

</td>
</tr>
</table>

## 🚀 Quick start

### What you need

| Requirement | Details |
| --- | --- |
| **Node.js** | Version **24 or newer**; Node.js 24 LTS is recommended |
| **Browser** | A recent Microsoft Edge or Google Chrome for the Windows app-window launcher |
| **Internet** | Required for new Steam searches, details, and images |
| **Steam account / API key** | **Not required** |
| **Hosting / paid service** | **Not required** |

### Windows — ready in three steps

**1. Install Node.js**

Download it from [nodejs.org](https://nodejs.org/). After installation, open a terminal and check:

```powershell
node --version
```

**2. Download and extract IndieCompass**

On this repository, click **Code → Download ZIP** and extract the archive into a folder you can write to.

**3. Start the app**

Double-click:

```text
start.bat
```

The interface opens in a separate Edge or Chrome window. Leave the launcher console open while using the app. When finished, close that console or press **Ctrl+C** to stop the local process.

> [!TIP]
> **You do not need to run `npm install` for the standard launch mode.** It uses Node.js built-ins and your installed browser.

<details>
<summary><strong>Prefer a terminal? Open the project folder and run this.</strong></summary>

```powershell
node launcher.mjs
```

Or, if npm is available:

```powershell
npm start
```

If the browser does not open automatically, copy the local URL printed in the console into a recent browser. The port is selected automatically, so use the address from the current launch.

On macOS and Linux, the launcher prints the address for manual opening. The automatic browser-window helper is Windows-specific.

</details>

> [!IMPORTANT]
> Start through `start.bat` or `launcher.mjs`. Opening `public/index.html` directly will not start the backend needed for Steam requests.

## 🎮 Features

- **Steam search** — look up games by name and load results in pages.
- **Multiple genres** — combine tags such as **Indie + Horror** or **Indie + Simulation**.
- **Release-date range** — select a start date, end date, or both.
- **Useful filters** — choose language, platform, player mode, price category, and positive-review percentage.
- **Sorting** — relevance, newest releases, Steam reviews, price, or name.
- **Rich game details** — descriptions, banners, screenshots, developers, publishers, languages, and release information.
- **System requirements** — minimum and recommended requirements for Windows, macOS, and Linux when provided by the developer.
- **Favorites** — save games you want to come back to.
- **Hidden games** — remove uninteresting results and restore them later.
- **Local preferences and cache** — keep your choices on your device and reuse previously loaded responses when Steam is temporarily unavailable.
- **Custom interface** — dark dropdowns, multi-select menus, SVG icons, keyboard controls, and responsive layouts.

## 🎛 Find exactly what you feel like playing

### Combine genres

Open **«Жанры / теги Steam»**, select the tags you want, click **«Готово»**, and then **«Найти игры»**.

Selected genres use **AND matching**:

| Selection | What it means |
| --- | --- |
| **Indie + Horror** | Games matching both the Indie and Horror tags |
| **Indie + Simulation** | Games matching both the Indie and Simulation tags |
| **Indie + Adventure + Survival** | Games matching all three selected tags |
| **All games / «Все игры»** | No genre restriction; the other filters still apply |

The app starts with **Indie** selected. Your next selection is saved automatically when you apply the filters. Older single-genre preferences are supported.

### Filter reference

| Filter | Options / behavior |
| --- | --- |
| **Search** | Search by game name; press Enter to apply |
| **Genres / tags** | Indie, Horror, Simulation, Adventure, Action, Puzzle, Survival; select several |
| **Atmosphere** | Any, Relaxing, or Atmospheric — based on Steam tags |
| **Release date** | **«С»** = From; **«По»** = To. Both boundary dates are included |
| **Price category** | Any, Free, Paid, or On sale |
| **Player reviews** | Any, or at least 70%, 80%, or 90% positive |
| **Player mode** | Any, Single-player, Co-op, or Multiplayer |
| **Platform** | Any, Windows, macOS, or Linux / SteamOS |
| **Russian language** | Show games listed by Steam as supporting Russian |
| **Store region** | Russia, Kazakhstan, United States, Germany, or Turkey |
| **Sort order** | Relevance, Newest, Steam reviews, Lowest price, or Name |

Changing the store region changes the storefront query, including prices and regional availability. Linux / SteamOS filtering reflects Steam's platform metadata; it is not a Steam Deck verification badge.

> [!TIP]
> The quick-pick buttons jump straight to indie horror, indie simulators, relaxing indie games, or general indie discovery. They replace the other filters while keeping your selected store region.

### Useful buttons in the Russian interface

| Button | Action |
| --- | --- |
| **«Найти игры»** | Apply the current filters |
| **«Сбросить»** | Reset filters while keeping the selected store region |
| **♡ / ♥** | Add a game to favorites or remove it |
| **«Избранное»** | Open your saved collection |
| **«Не интересно»** | Hide a game from discovery results |
| **«Вернуть скрытые»** | Restore hidden games without clearing your other preferences |
| **«Показать ещё»** | Load more results |
| **«Продолжить поиск»** | Continue scanning pages when no matching games have appeared yet |
| **«Открыть в Steam»** | Open the official game page in your browser |

## 🖼 Explore a game

Click a game's cover or title to open its detail page.

| Section | What you will find |
| --- | --- |
| **About the game** | A description from Steam, requested in Russian when available |
| **Screenshots** | A scrollable gallery; click a screenshot to enlarge it |
| **System requirements** | Minimum and recommended specifications, with a platform selector |
| **Game information** | Release date, genres, developer, publisher, and supported languages |
| **Store link** | The official Steam page for availability and purchase details |

If Steam does not provide a description, image, or requirement block, the interface shows an explicit fallback. Hardware requirements come from developers; IndieCompass does not scan your PC or guarantee that a game will run.

## ⌨️ Keyboard controls

| Key | Inside a custom dropdown |
| --- | --- |
| **↑ / ↓** | Open the list or move between options |
| **Home / End** | Jump to the first or last option |
| **Enter / Space** | Select an option; toggle a genre in a multi-select list |
| **Type letters** | Jump to an option by its first letters |
| **Escape** | Close the menu and return focus to its button |
| **Tab** | Close the menu and continue to the next control |

You can also close a menu by clicking outside it. In the screenshot viewer, **Escape** closes the enlarged image.

## 🔒 Your preferences stay on your device

The standard Windows launcher stores data under:

```text
%APPDATA%\IndieCompassWeb\
├── preferences.json    Favorites, hidden game IDs, and applied filters
└── cache\              Previously loaded Steam responses
```

- Preference writes are atomic.
- Search responses are considered fresh for **15 minutes**; game details for **24 hours**.
- If a live request fails and a cached response exists, the app can show it with an **outdated-data warning**.
- Old cache entries and excess files are pruned at startup.
- Images use the browser's caching behavior; the app does not maintain a separate image archive.

There is no IndieCompass account system or project-hosted telemetry. Steam receives search requests and your IP address; its CDN receives image requests. The backend listens only on `127.0.0.1`, so no public hosting is needed.

<details>
<summary><strong>Choose a custom data folder</strong></summary>

Set `COMPASS_DATA_DIR` before starting the app. For example, in PowerShell:

```powershell
$env:COMPASS_DATA_DIR = Join-Path $env:LOCALAPPDATA 'IndieCompassData'
node launcher.mjs
```

The optional Electron shell uses Electron's own `userData` directory instead of this launcher setting.

</details>

## 🌐 About the Steam catalog

IndieCompass searches the storefront **on demand**, in pages. It does not preload a complete Steam database or keep a small fixed game list.

The integration uses these public, **undocumented storefront endpoints**:

```text
store.steampowered.com/search/results/
store.steampowered.com/api/appdetails
```

Their format and availability can change. There is no guarantee that every Steam title will appear: regional restrictions, delisted games, and anonymous storefront visibility can affect results.

### A note about result counts

Steam applies the main query filters. The app checks exact dates and review thresholds as pages load. When an upper date bound is selected, it first tries to locate the relevant release-ordered page. If exact ordered dates are unavailable, it falls back to sequential scanning and explains this in the interface.

A search batch can examine up to four result pages when these local checks are needed; locating an older date range may require additional requests. **«Продолжить поиск»** continues scanning.

- The **Steam total** is the size of the main storefront query.
- The **displayed count** is the number of matching cards loaded so far.
- Exact-date filtering excludes games without an exact date.
- A review threshold excludes games without a reported positive-review percentage.

> [!NOTE]
> The percentage on a card is the share of positive Steam player reviews. It is not an IndieCompass score. The app does not invent session-length estimates, completion times, prices, or hardware recommendations.

## 🛠 FAQ & troubleshooting

<details>
<summary><strong>“Node is not recognized” or the app asks me to install Node.js</strong></summary>

Install Node.js 24 or newer from [nodejs.org](https://nodejs.org/). Open a new terminal after installation and run `node --version`. If necessary, restart your terminal or sign out and back in so the updated PATH is available. Then run `start.bat` again.

</details>

<details>
<summary><strong>The app starts, but no browser window opens</strong></summary>

The automatic launcher looks for Edge and Chrome in common installation locations. If it cannot find your browser, open the local address printed in the console in a recent browser. Keep the console open while using the app.

</details>

<details>
<summary><strong>Why do I get no results after selecting several filters?</strong></summary>

Selected genres are combined with AND, and the other filters narrow the search further. Try fewer tags, remove the review threshold, widen the release period, or check the store region. If the app offers «Продолжить поиск», more pages remain to be checked. Also check whether you previously hid the game.

</details>

<details>
<summary><strong>Steam is unavailable, rate-limited, or shows a network error</strong></summary>

Check your internet connection, wait a little, and retry. Steam can temporarily limit requests. A different region may affect catalog availability, but it does not fix every network problem. If no cached response exists, a new search cannot work offline.

</details>

<details>
<summary><strong>Prices, screenshots, or system requirements are missing</strong></summary>

Some data may not be available for a game, platform, or region. Steam's media servers may also be temporarily unreachable. Check the official Steam page using «Открыть в Steam»; the app displays a fallback instead of making up missing data.

</details>

<details>
<summary><strong>Why is the interface in Russian? Can I use it in English?</strong></summary>

The current UI is Russian. An English UI is not included in this version. Game titles keep their original names, and the tables above explain the main controls. Localization contributions are welcome.

</details>

<details>
<summary><strong>How do I reset everything?</strong></summary>

For a normal filter reset, use «Сбросить». To restore hidden games, use «Вернуть скрытые».

For a complete preferences reset, close the app and rename `preferences.json` in the data folder to `preferences.backup.json`. The next launch starts with fresh preferences; the renamed file keeps a recoverable backup. Cached storefront responses are separate from preferences.

</details>

<details>
<summary><strong>Do I need Python, a Steam API key, or a running Steam client?</strong></summary>

No. The standard launch mode uses Node.js and a browser. It does not require Python, a Steam API key, an AI service, or the Steam desktop client. Browsing a Steam purchase page or buying a game happens outside IndieCompass.

</details>

## 🧑‍💻 Development

### Run and test

The normal app mode and offline core tests use Node.js built-ins:

```sh
# Start the local app
node launcher.mjs

# Run core and HTTP tests without calling Steam
node --test test/core.test.mjs
```

The current suite contains **11 core/HTTP tests**, covering parsing, combined genre filters, date boundaries, pagination, hidden games, cache fallback, storage, and HTTP routes.

Browser checks are available in:

```text
test/ui-check.mjs
test/dropdowns-check.mjs
```

They require Playwright and installed Chrome, use controlled test responses, and save screenshots to the operating system's temporary directory. They do not prove live Steam availability.

### Optional Electron package

To run the Electron shell and create a portable Windows build:

```sh
npm install
npm run desktop
npm run dist
```

Build output goes to `dist/`. A successfully packaged app can be distributed without requiring the recipient to install Node.js or a separate browser.

> [!IMPORTANT]
> These are build instructions, not a claim that a verified executable is attached. Electron packaging has not been verified in the development environment. Keep the generated dependency lockfile for repeatable installs and include the applicable Electron, Chromium, and Node.js license notices when distributing binaries.

### Project structure

```text
IndieCompass/
├── public/
│   ├── index.html          Main interface
│   ├── style.css           Dark theme and responsive layouts
│   ├── app.js              UI behavior and state
│   ├── selects.js          Custom dropdowns and multi-select
│   └── icons.js            SVG icons
├── lib/
│   ├── steam.mjs           Steam requests, parsing, and filters
│   └── storage.mjs         Preferences and response cache
├── test/                   Core and browser regression checks
├── server.mjs              Local loopback HTTP backend
├── launcher.mjs            Browser app-window launcher
├── desktop.cjs             Optional Electron shell
├── start.bat               Windows launcher
├── package.json            Commands and packaging configuration
└── LICENSE                 MIT license
```

### Validation status

| Area | Status |
| --- | --- |
| Core and HTTP logic | 11 tests passed locally on Node.js 24.20.0 |
| Browser interaction | Checked with controlled fixtures in Chrome |
| Responsive layouts | Checked at 1440, 850, and 600 px widths |
| Multi-select and keyboard behavior | Covered by browser regression checks |
| Live Steam integration | Not independently confirmed in the restricted development environment |
| Electron executable | Packaging not verified; no verified binary promised by this README |

## 🤝 Contributing

Bug reports, focused fixes, accessibility improvements, and localization are welcome.

When reporting a problem, include your operating system, Node.js version, store region, selected filters, and steps to reproduce. Screenshots are helpful; remove private information before posting them. For UI changes, check keyboard navigation and narrow layouts. For logic changes, run the core tests and add a relevant regression check.

## 📄 License & credits

IndieCompass source code is licensed under the **[MIT License](LICENSE)**.

Game names, descriptions, artwork, banners, and screenshots belong to their respective owners. Steam is a trademark of Valve Corporation. IndieCompass is **not affiliated with or endorsed by Valve**.

---

<div align="center">

**🧭 Follow your curiosity. Find something worth playing.**

[Back to top](#-indiecompass)

</div>
