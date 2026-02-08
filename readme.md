# Notes

Progress so far
- Load puzzles from Lichess database when server is starting 
- fetch puzzles with id, get all puzzles with search/filter (rating, theme) + pagination
- create/resume an attempt to solve a puzzle
- fetch all attempts (default sort by recent change time)



## Pagination consideration
For now, I chose offset-based pagination over cursor-based since I allowed filtering and sortBy Id or Rating to load my puzzles list.
The dataset is also not changing frequently to really consder cursor-based. 
While it may affect time response for later page access, most requests would just fall on the first/second page on this case.  Later pages are rarely accessed to get benefited from cursor-based and not yet worth the complicated implementation.

## Extra libraries:
- chessboard.js for chessboard