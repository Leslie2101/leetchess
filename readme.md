# Notes

Progress so far

- [x] Load puzzles from Lichess database when server is starting 
- [x] fetch puzzles with id, get all puzzles with search/filter (rating, theme) + pagination
- [x] create/resume an attempt to solve a puzzle
- [x] fetch all attempts (default sort by recent change time)
- [x] integrate: send move to backend for validation
- [x] handle promotion UI (11/2)
- [x] add login/logout with OAuth2 Google (13/2)
- [x] AI consultant (18/3)
- [x] AWS for server, database (20/02)
- [ ] AWS S3 for frontend (?)
- [ ] scheduled removal of anonymous attempts (?)
- [ ] resolve OAuth2 for AWS connect (?) integrate AWS cognito
- [ ] redis for caching requests (?)
- [ ] role-based authorisation for admin creating puzzles

## Consideration

### Pagination Consideration

- Using **offset-based pagination** for simplicity, supporting filtering and sorting by `Id` or `Rating`.
- Dataset is mostly static, so cursor-based pagination is not necessary.
- Offset pagination may be slower on later pages, but most users access only the first or second page.
- Deep page access is rare, so implementing cursor-based pagination isn’t justified at this stage.


### Move Validation (to be reviewed)

The puzzle solver uses a hybrid frontend-backend approach for efficient and secure move handling:

- Frontend uses `chess.js` and `chessboard.js` for instant move animations and legal move checks.
- Backend tracks the puzzle FEN, solution moves, and correct-move count.
- Users submit only moves; the backend validates correctness.
- This ensures fast UI, minimal backend load, and puzzle integrity.

### Search Puzzle 

Consider between LIKE and FullTextSearch for searching by title



## Extra libraries:
- chessboard.js for chessboard interface
- chess.js for frontend side chess engine
- [Wolfram chess engine](https://github.com/wolfraam/chess-game)


# Data source & Disclaimer
This project utilises chess puzzle data from the publicly available [Lichess database](https://database.lichess.org/#puzzles)

This application is a personal, non-commercial project and is not affiliated with Lichess in any way. Lichess retains full credit for the original puzzle dataset.