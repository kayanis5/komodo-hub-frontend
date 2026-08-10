# Komodo Hub Frontend

An original responsive React and TypeScript interface created for the 5005CMD Komodo Hub case study. The public site presents conservation programmes, endangered species and reviewed library items. Student, teacher and administrator accounts demonstrate role-based access without exposing real personal data.

The demonstration contains 19 working role views. Students can update activity progress, submit privacy-aware sightings, build a creative canvas, submit work, send messages and personalise a private profile. Teachers can manage classes, assess submissions, moderate sightings, generate progress summaries and communicate internally. Administrators can manage organisations and staff access, generate joining codes, control publication, inspect anonymised business indicators and use the role-limited inbox.

## Run Locally

1. Install Node.js 20 or newer.
2. Run the backend project at `http://localhost:4000`.
3. Copy `.env.example` to `.env`.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open `http://localhost:5173`.

If `VITE_API_BASE_URL` is omitted, the website still runs as a self-contained visual prototype. When the value is set, sign-in is verified by the separate backend API.

## Acceptance Walkthrough

Test every left-hand item for all three roles. Representative actions should update immediately: activity progress, sighting submission, canvas items, draft submission, profile preferences, review decisions, organisation status, staff suspension, joining codes, visibility settings, reports and messages. Sign out after each role before testing the next account.

## Demonstration Accounts

| Role | Username | Password |
| --- | --- | --- |
| Student | `student` | `student5005` |
| Teacher | `teacher` | `teacher5005` |
| Administrator | `admin` | `admin5005` |

## Production Build

Run `npm run build`. The static output is created in `dist/`.

## Project Details

- Support: knjjjshhj@gmail.com

## Image Credits

- Komodo dragon: Charles J. Sharp, CC BY-SA 4.0, Wikimedia Commons.
- Javan rhinoceros: T. Dixon / Zoological Society of London, public domain, Wikimedia Commons.
- Bali myna: JJ Harrison, CC BY-SA 3.0, Wikimedia Commons.
- Sumatran tiger: Theo Kruse / Burgers' Zoo, CC BY-SA 4.0, Wikimedia Commons.
