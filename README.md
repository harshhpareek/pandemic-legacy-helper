# Pandemic Legacy Season 1 Card counter

Hosted at <https://pandemic-legacy-helper.vercel.app/>

## Setup

Set up a project on Firebase, create a Realtime DB. Deploy this to Vercel and set the following environment variables (on Vercel):

```env
REACT_APP_FIREBASE_MEASUREMENT_ID="..."
REACT_APP_FIREBASE_APP_ID="..."
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="..."
REACT_APP_FIREBASE_API_KEY="..."
```

To run locally,

```bash
npm install
npm install -g vercel
vercel link
vercel env pull
npm run dev
```

## Testing

I am not writing tests. See `test.md`
