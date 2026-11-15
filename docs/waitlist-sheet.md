# Saving waitlist emails to a Google Sheet

The waitlist form on heartpilot.org sends each email to a Google Sheet through a small
Google Apps Script web app that you own. Until the web app URL is added to the page,
the form falls back to opening the visitor's email app (so nothing is lost).

## Set it up (about 3 minutes)

1. Create a new Google Sheet, for example "HeartPilot waitlist".
2. Menu **Extensions > Apps Script**. Delete the sample code and paste this:

```js
const SHEET_NAME = 'Waitlist';

function doPost(e) {
  const email = String((e.parameter && e.parameter.email) || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return ContentService.createTextOutput('invalid');
  }
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(['Time', 'Email', 'Language', 'Page']);
  const existing = sh.getLastRow() > 1
    ? sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues().flat()
    : [];
  if (existing.indexOf(email) === -1) {
    sh.appendRow([new Date(), email, e.parameter.lang || '', e.parameter.page || '']);
  }
  return ContentService.createTextOutput('ok');
}
```

3. **Deploy > New deployment > Web app**. Execute as: **Me**. Who has access: **Anyone**.
   Authorise when asked, then copy the **Web app URL** (it ends in `/exec`).
4. Give that URL to whoever maintains the site (or edit `index.html` yourself): put it
   in `data-endpoint=""` on `<form id="join-form">`.
5. Test: open the site, press Join the waitlist, enter an address. A new row appears.

## Things to know

- The page cannot read the script's reply (browser rule for this kind of request), so it
  shows "You are on the list" once the request is sent. Check the sheet to be sure.
- Duplicates are ignored. A hidden field catches simple bots.
- Anyone who finds the web app URL can post to it. If you see junk rows, redeploy to
  get a new URL.
- Emails are personal data and now sit in Google Sheets. Add that to the Privacy Policy
  and keep the sheet private (share it only with people who need it).
