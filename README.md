# Pandemic Legacy Season 1 Card counter

Hosted at <https://pandemic-legacy-helper.vercel.app/>

## Setup

Skipping over a lot of details that should be available online:

1. Set up a project on Firebase. Create a Realtime DB and create credentials.
2. Deploy to Vercel and set the following environment variables (on Vercel):

```env
REACT_APP_FIREBASE_MEASUREMENT_ID="..."
REACT_APP_FIREBASE_APP_ID="..."
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="..."
REACT_APP_FIREBASE_API_KEY="..."
```

Then, to run locally,

```bash
npm install
npm install -g vercel
# Do the `git clone`
# Set up Vercel project
vercel link
vercel env pull
# npm start does not work, Use:
npm run dev 
```

## Testing

I am not writing tests. See `test.md`
