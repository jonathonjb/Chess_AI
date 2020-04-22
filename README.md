# Chess_AI

![Alt text](http://i.imgur.com/a/5roxVn9.gif)

I created a chess AI program which decides what move to make by using the minimax algorithm and the evaluation function. 

For this project, I used a 2D array to store all of the pieces info, and in the minimax algorithm, I created a deep copy of the 2D array for each move/child boards. 

I realize that using a 2D array to store the pieces and creating a new copy of the board for each possible move is very inefficient. For this project, it is able to check every moves for the next 3 turns in a reasonable amount of time. Any more than that would take the program too long though.
If I had to start on this project all over again, I'd use maps instead of 2D arrays to store the pieces info. 

BUGS / ERRORS
--------------
This project isn't competely done yet; there are still a few bugs which needs to be fixed.
