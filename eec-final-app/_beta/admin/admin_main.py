from tkinter import *
from assets.collor_pallete import *
from admin import admin_scoreboard, admin_bingo, admin_gamble

class switchbutton:

    def __init__(it, s, root, mainRoot, mainScoreBoard, mainBingoTransition, mainBingo, teamA, teamB, teamC) -> None:

        #DISPLAYS
        it.scoreBoardDisplay = admin_scoreboard.scoreboardcontrol(s, root, mainRoot, mainScoreBoard, teamA, teamB, teamC)
        it.bingoTransitionDisplay = admin_bingo.bingotransitioncontrol(root)

        #SWITCH DISPLAY FRAME BUTTON
        it.switchDisplayFrame = Frame(root, bg=TC2022_bg_color)
        it.switchDisplayFrame.place(relheight=0.06, relwidth=1, relx=0, rely=0, anchor=NW)

        #SCOREBOARD BUTTON
        it.scoreBoardButton = Button(it.switchDisplayFrame, text="Score", command=lambda:[s.clear(False), it.scoreBoardDisplay.display(s, root, mainRoot, mainScoreBoard, teamA, teamB, teamC), mainScoreBoard.display(s, mainRoot, teamA, teamB, teamC)], bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        it.scoreBoardButton.configure(font=("Gotham", 11, "bold"))
        it.scoreBoardButton.place(relheight=1, relwidth=0.2, relx=0, rely=0, anchor=NW)

        #BINGO TRANSITION BUTTON
        it.bingoTransitionButton = Button(it.switchDisplayFrame, text="Bingo-T", command=lambda:[s.clear(False), it.bingoTransitionDisplay.display(root), mainBingoTransition.display(s, mainRoot)], bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        it.bingoTransitionButton.configure(font=("Gotham", 11, "bold"))
        it.bingoTransitionButton.place(relheight=1, relwidth=0.2, relx=0.2, rely=0, anchor=NW)

        #BINGO BUTTON
        it.bingoButton = Button(it.switchDisplayFrame, text="Bingo", command=lambda:[s.clear(False)], bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        it.bingoButton.configure(font=("Gotham", 11, "bold"))
        it.bingoButton.place(relheight=1, relwidth=0.2, relx=0.4, rely=0, anchor=NW)

        #GAMBLE TRANSITION BUTTON
        it.gambleTransitionButton = Button(it.switchDisplayFrame, text="Gamble-T", command=lambda:[s.clear(False)],  bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        it.gambleTransitionButton.configure(font=("Gotham", 11, "bold"))
        it.gambleTransitionButton.place(relheight=1, relwidth=0.2, relx=0.6, rely=0, anchor=NW)
        
        #GAMBLE BUTTON
        it.gambleButton = Button(it.switchDisplayFrame, text="Gamble", command=lambda:[s.clear(False)], bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        it.gambleButton.configure(font=("Gotham", 11, "bold"))
        it.gambleButton.place(relheight=1, relwidth=0.2, relx=0.8, rely=0, anchor=NW)