# Tic-Tac-Toe Game

An interactive tic-tac-toe game with unlimited grid size, built with React 18, TypeScript, and Material-UI.

## Features

### 🎮 Game Features
- **Unlimited Grid**: Board expands dynamically as you play
- **5-in-a-Row Win Detection**: Connect 5 symbols in any direction to win
- **Turn-based Gameplay**: Alternating X and O moves
- **AI Opponent**: Play against a computer opponent with adjustable difficulty
- **Real-time Win Detection**: Automatic winner detection after each move

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface built with Material-UI
- **Animations**: Smooth move animations and win celebrations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Consistent theming throughout the app

### 📊 Statistics & History
- **Match History**: Complete game history with dates and results
- **Player Statistics**: Win/loss/draw statistics for all players
- **Match Replay**: Rewind and replay completed matches move-by-move
- **Local Storage**: All data persists locally in the browser

### 🛠️ Technical Features
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency enforcement
- **Component Architecture**: Well-organized, reusable components
- **Custom Hooks**: Game state management with React hooks
- **Local Storage API**: Client-side data persistence

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **Styling**: Material-UI + CSS-in-JS
- **Data Storage**: Browser LocalStorage
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tic-tac-toe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Game Rules

1. **Objective**: Get 5 of your symbols (X or O) in a row - horizontally, vertically, or diagonally
2. **Turns**: Players alternate placing their symbols on empty grid cells
3. **Grid**: The board expands automatically as you play, with no size limits
4. **Win Condition**: First player to connect 5 symbols wins
5. **AI Mode**: Choose to play against a computer opponent

## Project Structure

```
src/
├── components/
│   ├── pages/          # Page components (Login, Game, History)
│   ├── game/           # Game-specific components (Board, Replay)
│   └── common/         # Shared components
├── hooks/              # Custom React hooks
├── services/           # API and storage services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and algorithms
└── App.tsx             # Main application component
```

## Key Components

- **LoginPage**: Player name input and game setup
- **GamePage**: Main game interface with board and controls
- **HistoryPage**: Match history and statistics display
- **GameBoard**: Interactive game board with unlimited scrolling
- **MatchReplay**: Move-by-move match replay functionality

## Algorithms

- **Win Detection**: Efficient 5-in-a-row detection in all directions
- **AI Logic**: Minimax-based AI with difficulty levels
- **Board Management**: Dynamic board bounds calculation and rendering

## Future Enhancements

- Online multiplayer mode
- Additional AI difficulty levels
- Customizable win conditions
- Tournament mode
- Sound effects and more animations
- Cloud save functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
