# ♟️ LeetChess
LeetChess is a full-stack web-based chess platform that allows users to authenticate with Google accounts. Inspired by Leetcode but for chess, users can attempt puzzle problems and improve their chess game. 
This project utilises chess puzzle data from the publicly available [Lichess database](https://database.lichess.org/#puzzles)

This application is a personal, non-commercial project and is not affiliated with Lichess in any way. Lichess retains full credit for the original puzzle dataset.

## 🚀 Live Demo

https://github.com/user-attachments/assets/31db80c3-3d5f-4cfc-a405-8d1f3240bca2

🌐 https://leetchess.net 


## 🛠 Tech Stack

- Springboot
- Java 17
- React (Typescript) + Vite

## 🖥️ Local Deployment Guide

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm
- Git


### Steps:
1. Clone the repo
```bash
git clone https://github.com/leslie2101/leetchess.git
cd leetchess
```
   
2. Backend setup

- Fill in `.env` file for the database configurations, Google Client for OAuth2 and a [Gemini API key](https://aistudio.google.com/app/api-keys). 
```.env
DATASOURCE_URL=jdbc:mysql://localhost:3306/chess_platform
DATASOURCE_USER=
DATASOURCE_PASSWORD=
FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_API_KEY=
``` 

- Run backend:
```bash
cd backend
mvn spring-boot:run
```

Backend will now run at http://localhost:8082.

4. Frontend set up

- Open a new terminal
```bash
cd frontend
npm install
```

- Create a .env file inside the frontend directory:
```.env
VITE_API_BASE_URL=http://localhost:8082
```

- Run frontend
```bash
npm run dev
```

Now the website will run at http://localhost:5173

 

### Adds-on/Plugins:
- [react-chessboard](https://react-chessboard.vercel.app/) and [chess.js](https://jhlywa.github.io/chess.js/) are utilised to keep track of board state and visualisation in the frontend.
- [Wolfram chess engine](https://github.com/wolfraam/chess-game) is used to compute current board state to provide context for AI consultant. 



## Issues
- [ ] Google OAuth works locally but not in custom domain
- [ ] The platform only support 10000 puzzles for now. Full lichess puzzle list with optimisation on loading big data should be supported in the future. 

## Progress TODO
- [x] Load puzzles from Lichess database when server is starting 
- [x] fetch puzzles with id, get all puzzles with search/filter (rating, theme) + pagination
- [x] create/resume an attempt to solve a puzzle
- [x] fetch all attempts (default sort by recent change time)
- [x] integrate: send move to backend for validation
- [x] handle promotion UI (11/2)
- [x] add login/logout with OAuth2 Google (13/2)
- [x] AI consultant (18/3)
- [x] AWS for server, database (20/02)
- [ ] scheduled removal of anonymous attempts (?)
- [ ] resolve OAuth2 for AWS connect (?) integrate AWS cognito
- [ ] redis for caching requests (?)
- [ ] role-based authorisation for admin creating puzzles

## Learning Progress Documentation
[Learning document](LEARN.md): this tracks what I have learned while building this application, including techniques for response time optimisation and other techniques. 


