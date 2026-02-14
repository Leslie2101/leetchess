# Notes

Progress so far
- Load puzzles from Lichess database when server is starting 
- fetch puzzles with id, get all puzzles with search/filter (rating, theme) + pagination
- create/resume an attempt to solve a puzzle
- fetch all attempts (default sort by recent change time)
- integrate: send move to backend for validation
- handle promotion UI (11/2)
- add login/logout with OAuth2 Google (13/2)
- AI consultant (?)
- scheduled removal of anonymous attempts (?)

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



## Extra libraries:
- chessboard.js for chessboard interface
- chess.js for frontend side chess engine
  Data Source & Disclaimer


# Data source & Disclaimer
This project utilises chess puzzle data from the publicly available [Lichess database](https://database.lichess.org/#puzzles)

This application is a personal, non-commercial project and is not affiliated with Lichess in any way. Lichess retains full credit for the original puzzle dataset.