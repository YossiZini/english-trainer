# English Tutorial Frontend

React-based frontend for the English Tutorial App.

## Prerequisites

- Node.js 18+ LTS
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Update the API URL if needed:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the App

### Development Mode
```bash
npm start
```

The app will open at http://localhost:3000

### Production Build
```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

### Run Tests
```bash
npm test
```

## Project Structure

```
/frontend
├── /public                # Static assets
├── /src
│   ├── /components        # React components
│   │   ├── /common        # Reusable components (Button, Card, etc.)
│   │   ├── /auth          # Authentication components
│   │   ├── /dashboard     # Dashboard components
│   │   ├── /topics        # Topics index components
│   │   ├── /learn         # Learning page components
│   │   ├── /exercise      # Exercise components
│   │   ├── /results       # Results page components
│   │   └── /progress      # Progress page components
│   ├── /context           # React Context for state management
│   ├── /hooks             # Custom React hooks
│   ├── /services          # API services
│   │   └── api.js         # Axios instance & interceptors
│   ├── /utils             # Utility functions
│   ├── /styles            # Global styles
│   │   ├── variables.css  # CSS variables
│   │   └── global.css     # Global styles
│   ├── App.js             # Main app component with routing
│   ├── App.css            # App styles
│   ├── index.js           # Entry point
│   └── index.css          # Base styles
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Available Routes

| Route | Description | Phase |
|-------|-------------|-------|
| `/` | Landing/Login page | Phase 2 |
| `/dashboard` | User dashboard | Phase 6 |
| `/topics` | Topics index | Phase 3 |
| `/learn/:topicId/:subtopicId` | Learning page | Phase 3 |
| `/exercise/:topicId/:subtopicId` | Exercise page | Phase 4 |
| `/results/:topicId/:subtopicId` | Results page | Phase 4 |
| `/progress` | Progress tracking | Phase 6 |

## Development Phases

### Phase 1: ✅ Complete
- Project setup
- Basic routing structure
- Directory organization
- API service configuration

### Phase 2: Authentication (Coming Next)
- Login & Register pages
- AuthContext for user state
- Protected routes
- Token management

### Phase 3: Lesson System
- Topics index page
- Learning pages with theory
- Lesson navigation

### Phase 4: Exercise System
- Exercise components (multiple choice, fill-in-blank)
- Results page
- Score tracking

### Phase 5: Mistake Tracking
- Review mistakes feature
- Retry mistakes mode
- Mistake history

### Phase 6: Progress & Dashboard
- Dashboard with statistics
- Progress charts
- Achievement display

## Technologies

- **React 18+** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **CSS Modules** - Component styling

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |
| `npm run eject` | Eject from Create React App (irreversible!) |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |
| REACT_APP_ENV | Environment | development |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Educational use only.
