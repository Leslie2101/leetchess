# Learning Notes
This content is reserved for learning different techniques and considerations when building an application. 

## API design
My original API design process to let backend-frontend interact. This is heavily inspired by [Leetcode System Design](https://www.hellointerview.com/learn/system-design/problem-breakdowns/leetcode). 
```python
# create problem
POST admin/problems


# view a list of problem - pagination

GET /problems
     ?category={}
     &ratingLowerbound={}
     &ratingUpperbound={}
     &page={}
     &size={}
  -> Problems[]

# view a given problem - problem id is mandatory

GET /problems/:problemId -> Problem
response {FEN, remainingMoves}

# start to solve
POST /problems/:problemId/attempts (userId comes with JWT)
body: (Move) -> server create a submission id for this user
response: {status, newFEN, opponentAutoMove)

# for later move (userId comes with JWT)
POST /problems/:problemId/attempts/:attemptID/moves
body: {moveUCI}
response: {status, newFEN, opponentAutoMove }

# leaderboard ?
GET /leaderboard/:competitionId?page={}&?size={}

# ai chat
POST /problems/:problemId/attempts/:attemptID/questions
body: {"question": question}
resposne: {"answer": blablabla}
```


## Authentication

- Google OAuth is supported for user to login via Google account.
- Both anonymous user and logged in users can play the puzzle. However only logged in users are able to view what problems they have already solved.


## Pagination 

- Using **offset-based pagination** for requesting a chunk of data instead of all puzzles at once, supporting filtering and sorting by `Id` or `Rating`.
- Future improvement: might switch to cursor-based pagination for better response time of later pages and for bigger puzzles. 

## Submission of Puzzle Move

The puzzle solver uses a hybrid frontend-backend approach for efficient and secure move handling:

- Frontend uses [react-chessboard](https://react-chessboard.vercel.app/) and [chess.js](https://jhlywa.github.io/chess.js/) for instant move animations and legal move checks. 
- The frontend will handle board visualisation and submit only moves to the backend; the backend validates correctness by checking the submitted move against the current attempt progress.
- This ensures fast UI, minimal backend load, and puzzle integrity.

## Search Puzzle 

- Puzzle searching by title is currently implemented by using LIKE keyword in SQL. In the future FullTextSearch might be utilised for more complicating puzzle titles.

## AI Consultant 

- Google Gemini API is used to with customised prompt to provide advices for users attempting the puzzle. The board state FEN is precomputed using [Wolfram chess engine](https://github.com/wolfraam/chess-game) by the server to provide the context of the current board, allowing AI giving a more contextual approach.
