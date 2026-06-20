# Cricket Tournament Management Platform

A production-grade cricket tournament scoring and statistics platform built with React, TypeScript, Firebase, and Firestore.

## Project Status

✅ **Frontend Application**: Fully scaffolded and ready for development  
✅ **Backend Structure**: Cloud Functions configured (TypeScript, Node.js 20)  
✅ **Database Schema**: Firestore indexes and security rules defined  
✅ **Authentication**: Firebase Auth with custom role-based access control  
✅ **PWA Support**: Service workers and offline persistence configured  

## Quick Start

### Prerequisites

- **Node.js 20+** (for both frontend and backend)
- **npm** or **yarn**
- **Firebase CLI** (for local emulation and deployment)

```bash
npm install -g firebase-tools
firebase --version  # Confirm installation
```

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/tandonayaan-glitch/Scoring-.git
cd Scoring-
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project credentials:
- Get these from [Firebase Console](https://console.firebase.google.com)
- Project Settings → Your apps → Web app config

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_USE_EMULATORS=true
```

### 3. Run Local Development

**Terminal 1 — Vite Dev Server:**
```bash
npm run dev
```
Opens at `http://localhost:5173`

**Terminal 2 — Firebase Emulators:**
```bash
firebase emulators:start
```

This starts:
- **Auth Emulator**: `localhost:9099`
- **Firestore Emulator**: `localhost:8080`
- **Functions Emulator**: `localhost:5001`
- **Hosting Emulator**: `localhost:5000`
- **Emulator UI**: `localhost:4000`

### 4. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Emulator UI | http://localhost:4000 |

## Project Structure

```
Scoring-/
├── src/                          # Frontend React app
│   ├── app/                      # App root, routing, providers
│   ├── modules/                  # Domain-driven modules
│   │   ├── auth/                 # Authentication (domain, app, infra)
│   │   ├── awards/               # Awards system
│   │   ├── chat/                 # Tournament chat
│   │   ├── exports/              # CSV exports
│   │   ├── statistics/           # Player statistics
│   │   └── tournaments/          # Tournament management
│   ├── infrastructure/           # Firebase & external services
│   ├── shared/                   # Reusable components & hooks
│   ├── pages/                    # Route-level pages
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Tailwind styles
├── functions/                    # Cloud Functions (Node.js 20)
│   ├── src/
│   │   ├── triggers/             # Firestore triggers
│   │   ├── shared/               # Shared utilities
│   │   └── index.ts              # Function exports
│   └── tsconfig.json
├── index.html                    # HTML template
├── vite.config.ts                # Vite bundler config
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config (frontend)
├── firebase.json                 # Firebase emulator config
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Firestore indexes
└── package.json                  # Dependencies & scripts
```

## Key Features

### Authentication
- Username + password authentication via Firebase Auth
- Custom synthetic emails for privacy (`username@cricketapp.local`)
- Role-based access control: VIEWER, SCORER, ADMIN
- Session persistence with IndexedDB

### Tournament Management
- Create and manage tournaments
- Team and player management
- Match scheduling and status tracking
- Real-time scorecard updates

### Scoring System
- Delivery-by-delivery scoring
- Automatic innings tracking
- Dismissal recording
- Live leaderboards

### Statistics & Analytics
- Per-player batting & bowling statistics
- Tournament-level aggregations
- Global career statistics
- Customizable leaderboards

### Awards System
- Man of the Match (auto-derived from match performance)
- Tournament awards: Best Batsman, Best Bowler, Most Sixes, etc.
- Award notifications

### Additional Features
- Real-time chat per tournament
- Audit logging of all administrative actions
- CSV exports (scorecard, standings, player stats)
- Offline support with IndexedDB persistence
- PWA with service worker caching

## Development Workflow

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Building for Production
```bash
npm run build
```

Outputs to `dist/` directory, optimized for Firebase Hosting.

## Architecture

### Domain-Driven Design
Each module follows clean architecture:
- **Domain**: Core entities, value objects, and pure logic
- **Application**: Use cases orchestrating domain logic
- **Infrastructure**: Firebase implementations & external integrations
- **Presentation**: React components & stores (Zustand)

### State Management
- **Zustand** for lightweight, reactive state stores
- One store per domain module
- Use cases injected as dependencies

### Database Schema
See `firestore.indexes.json` for all collections and field indexes:

**Core Collections:**
- `users` — Authentication & profile data
- `tournaments` — Tournament metadata & rules
- `teams` — Teams participating in tournaments
- `players` — Player roster per team
- `matches` — Match records with status
- `fixtures` — Fixture scheduling

**Derived Collections:**
- `playerStats` — Per-tournament and global statistics
- `standings` — Tournament standings with NRR
- `awards` — Match and tournament awards
- `notifications` — User notifications
- `auditLogs` — Admin action tracking

## Firebase Setup

### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Follow setup wizard
4. Enable:
   - **Authentication**: Email/Password
   - **Firestore**: Create database in test mode (for local dev)
   - **Cloud Functions**: Deploy with Node.js 20

### Deploy to Production

```bash
firebase deploy
```

This deploys:
- Firestore rules & indexes
- Cloud Functions
- Hosting (from `dist/` directory)

## Troubleshooting

### "Missing environment variable" Error
Ensure `.env.local` exists with all required Firebase credentials:
```bash
cp .env.example .env.local
# Then fill in actual values from Firebase Console
```

### Emulator Not Starting
Check ports are not in use:
```bash
lsof -i :9099   # Auth
lsof -i :8080   # Firestore
lsof -i :5001   # Functions
```

Kill conflicting processes or configure different ports in `firebase.json`.

### "User profile not found" After Register
Cloud Function `onUserCreate` may be delayed. The client retries after 1.5s. Check:
1. Functions emulator is running
2. Firestore emulator is running
3. Check Cloud Functions logs in Emulator UI (localhost:4000)

### Offline Mode Not Working
IndexedDB persistence may be blocked by browser policy:
- Check browser console for warnings
- Ensure not in private/incognito mode
- Safari requires explicit user permission

## Performance Tips

1. **Code Splitting**: Pages are lazy-loaded via Vite
2. **Offline Support**: IndexedDB caches queries automatically
3. **PWA Caching**: Service worker caches static assets + API responses
4. **Firestore Indexes**: All queries use indexes — see `firestore.indexes.json`

## Security Considerations

⚠️ **Development Mode**: Firebase Emulator runs with open permissions for local development.

**Production Firestore Rules** (`firestore.rules`):
- Users can only read/write their own documents
- Scorers can only write matches they're assigned to
- Admins have full access
- Audit logs are write-only (append-only)

## Contributing

1. Follow domain-driven design principles
2. Keep modules independent and testable
3. Use TypeScript strict mode
4. Add Firestore indexes for new collection queries
5. Update Firestore security rules for new access patterns

## License

Proprietary — Cricket Platform

## Support

For issues, feature requests, or documentation updates, please open an issue on GitHub.
