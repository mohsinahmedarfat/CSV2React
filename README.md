# Generate multiple small React apps from a CSV

**One-line:** This can reads `websites.csv` and for each row generates a small, individual Create-React-App project under `/build/<domain>`. Each generated app uses the CSV data (phone, address, etc.) and a random Hero word (`Quick | Fast | Speedy`) in its Hero section.



## What this is for
- Automates creating **multiple, separate React projects** (one per CSV row).
- Keeps each project **fully runnable** as a normal CRA app so you can:
  - `cd build/<domain> && npm start` → run dev server (React dev server).
  - optionally run `npm run build` inside the app to produce a production build.
- Useful when you need many near-identical small apps/pages created programmatically from structured data (CSV).


## Contents (important files)
- `websites.csv` — the input CSV (domain, title, description, phone, address).
- `generate.js` — the generator script. Run `npm start` (or `node generate.js`) to generate apps.
- `package.json` — contains `"start": "node generate.js"` and the dependency `csv-parser`.
- `build/` — created by the script; contains generated React apps:
  ```
  /build
    /foodexpress.com
    /techhubbd.com
    /bookbazaar.com
  ```


## Prerequisites
- Node.js (v14+ recommended) and npm installed.
- Internet access (the script runs `npx create-react-app` which downloads packages).
- A terminal on your OS (Windows / macOS / Linux).

## CSV format (example)
`websites.csv` should look like this (first row = header):

```csv
domain,title,description,phone,address
foodexpress.com,Food Express,Delicious meals delivered fast,01712345678,"House 12, Road 5, Banani, Dhaka"
techhubbd.com,Tech Hub BD,Your trusted tech partner,01898765432,"Level 4, Block B, Dhanmondi, Dhaka"
bookbazaar.com,Book Bazaar,Buy and sell books online,01911223344,"Shop 22, New Market, Chittagong"
```
- domain will be used as the generated folder name under `/build`.
- Add new rows to create new apps.


## How it works

- `generate.js` reads `websites.csv`.
- For each row it:
  - Picks a random Hero word from `["Quick","Fast","Speedy"]`.
  - Create React apps by it's domain name into `/build/<domain>`.
  - Overwrites `/build/<domain>/src/App.js` with a small component that uses CSV `phone`, `address` and the random Hero word.
- After the script finishes, `/build/<domain>` is a **complete CRA project**. You can `cd` into it and run its normal scripts.

> **Note:** The script overwrites `src/App.js` each run, so if you update `phone`/`address` in the CSV and re-run `npm start`, the `App.js` will be updated for existing folders.  
> If you want a fresh CRA project (reinstall dependencies), delete the directory and re-run.

## Quick start — step by step

1. Unzip / get repo and open terminal
   ```bash
   cd path/to/task-project
   ```
2. Install generator dependencies
   ```
   npm install
   ```
   This installs `csv-parser` used by `generate.js`.
3. Run the generator
   ```bash
   npm start
   # or
   node generate.js
   ```
   - The script will read `websites.csv` and create `/build/<domain>` folders.
   - You will see console logs like:
      ```
      🚀 Creating React app for: foodexpress.com
      ✅ App ready at /build/foodexpress.com (Hero: Fast)
      ```
   - If a folder already exists, the script will not recreate it (but it will overwrite `src/App.js` with the new content).
4. Run an individual generated app (dev)
   ```bash
   cd build/foodexpress.com
   npm start
   ```
   This launches the regular CRA dev server (hot reload, localhost). If you get an error about missing deps, run `npm install` inside that folder once.

5. Build an individual generated app (production)
   ```bash
   cd build/foodexpress.com
   npm run build
   ```
   This creates `/build` inside that project's folder (this is CRA's build), not to be confused with the top-level `/build` that holds generated apps.


## Add a new website (how to create another app)

1. Open `websites.csv`
2. Add a new line with the new domain,... data
3. Run:
   ```
   npm start
   ```
4. The script will create `/build/<newdomain>` (if not present) and populate `src/App.js`. If the domain folder already exists, it will keep the folder and update `App.js`.


## Force recreate an app from scratch
If you want Create-React-App to re-run and reinstall dependencies (fresh install):
1. Delete the folder:
   ```bash
   rm -rf build/foodexpress.com
   ```
2. Re-run generator:
   ```
   npm start
   ```


## Customize Hero words or App template
- Open generate.js and edit:
  ```bash
  const heroWords = ["Quick", "Fast", "Speedy"];
  ```
  Add, remove or change words as needed.
- To change the full app template (App.js content), edit the `appCode` string inside `generate.js`. Keep it simple — the script overwrites `src/App.js`.