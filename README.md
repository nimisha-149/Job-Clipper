# Job Clipper – Project 10

A Chrome Extension (Manifest V3) that saves job listings and organises applications.

## Features
- Save role, company, page URL and deadline from the current tab.
- Attempts to prefill details from page title, headings and metadata; all fields remain editable.
- Manually add jobs when a website does not expose detectable details.
- Four-column board: Saved, Applied, Interview and Result.
- Drag cards between stages.
- Search jobs and export the board as CSV.
- Deadline reminder notification one day before the deadline (when the browser is running and notifications are allowed).
- Data is stored locally with `chrome.storage.local`; nothing is sent to a server.

## Install in Chrome
1. Extract the ZIP file.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted `Job_Clipper_Project10` folder.
6. Open a job listing, click the Job Clipper extension icon, edit any detected details and choose **Save this job**.
7. Click **Open application board** to manage applications.

## Notes and limitations
- Job-page layouts vary. Automatic extraction is best-effort; manually correct role, company and deadline when needed.
- The extension uses a generic extractor and should be tested on three different job sites; it is not guaranteed to parse every site automatically.
- Deadline notifications depend on Chrome being allowed to run and notifications being enabled.
- Data stays in this Chrome profile and does not sync to another device.
