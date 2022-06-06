import random
from math import cos
from time import sleep
from ext.timer import timer
from tkinter import *
from PIL import ImageTk, Image
from assets.collor_pallete import *

class bingotransition:
    
    def __init__(it, root) -> None:

        #MAIN CONTAINER FRAME
        it.bingoTransitionFrame = Frame(root)

        #BACKGROUND
        it.bgCanvas = Canvas(it.bingoTransitionFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
        it.bg = ImageTk.PhotoImage(Image.open("assets/transition_bingo_bg.png"))
        it.bgCanvas.create_image(0, 0, anchor=NW, image=it.bg)

    def display(it, s, root) -> None:

        #RE-INITIALIZE
        s.clear(True)
        it.__init__(root)

        #MAIN CONTAINER FRAME
        it.bingoTransitionFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)

        #BACKGROUND
        it.bgCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)


class bingo:


    def __init__(it, root, teamA, teamB, teamC) -> None:
        
        #CONSTANT VARIABLES
        try:
            if it.noInit:
                pass
        except:
            it.noInit = True
            it.randomized = False
            it.turn = 0
            it.gridState = [0 for i in range(36)]

        #MAIN CONTAINER FRAME
        it.bingoFrame = Frame(root)

        #BACKGROUND
        it.bgCanvas = Canvas(it.bingoFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
        it.bg = ImageTk.PhotoImage(Image.open("assets/scoreboard_bg.png"))
        it.bgCanvas.create_image(0, 0, anchor=NW, image=it.bg)

        #TITLE
        it.bingoTitle = Label(it.bingoFrame, text="BABAK BINGO", bg=TC2022_bg_color, fg=TC2022_yellow[normal], font=("Gotham", 32, "bold"))

        #TIMER
        it.timer = timer(it.bingoFrame, 18, "MS", hour="00", minute="100", second="00")

        #CONTAINER GRID
        it.gridFrame = Frame(it.bingoFrame, bg=TC2022_color1[dark], height=540, width=540)

        #SQUARE GRID
        it.gridSquare = []
        it.gridLabel = []
        for i in range(6):
            for j in range(6):
                it.gridSquare.append(Frame(it.gridFrame, bg=TC2022_color1[dark]))
                it.gridLabel.append(Label(it.gridFrame[i*6+j], text=str(i*6+j+1), font=("Play Pretend", 24), bg=it.gridColor(i*6+j), fg=TC2022_white[normal]))

        #SCOREBOARD
        it.scoreFrameA = Frame(it.bingoFrame, height=155, width=280, bg=TC2022_color2[dark])
        it.scoreFrameB = Frame(it.bingoFrame, height=155, width=280, bg=TC2022_color2[dark])
        it.scoreFrameC = Frame(it.bingoFrame, height=155, width=280, bg=TC2022_color2[dark])
        it.teamAScore = Label(it.scoreFrameA, text=str(teamA.score), font=("Play Pretend", 28), fg=TC2022_color1[dark], bg=TC2022_white[normal])
        it.teamBScore = Label(it.scoreFrameB, text=str(teamB.score), font=("Play Pretend", 28), fg=TC2022_color1[dark], bg=TC2022_white[normal])
        it.teamCScore = Label(it.scoreFrameC, text=str(teamC.score), font=("Play Pretend", 28), fg=TC2022_color1[dark], bg=TC2022_white[normal])
        it.teamALabel = Label(it.scoreFrameA, text="TIM A", font=("Gotham", 20, "bold"), bg=TC2022_color2[dark], fg=TC2022_white[normal])
        it.teamBLabel = Label(it.scoreFrameB, text="TIM B", font=("Gotham", 20, "bold"), bg=TC2022_color2[dark], fg=TC2022_white[normal])
        it.teamCLabel = Label(it.scoreFrameC, text="TIM C", font=("Gotham", 20, "bold"), bg=TC2022_color2[dark], fg=TC2022_white[normal])
        it.teamAName = Label(it.scoreFrameA, text=teamA.name, font=("Gotham", 16, "bold"), bg=TC2022_color2[dark], fg=TC2022_yellow[normal])
        it.teamBName = Label(it.scoreFrameB, text=teamB.name, font=("Gotham", 16, "bold"), bg=TC2022_color2[dark], fg=TC2022_yellow[normal])
        it.teamCName = Label(it.scoreFrameC, text=teamC.name, font=("Gotham", 16, "bold"), bg=TC2022_color2[dark], fg=TC2022_yellow[normal])
        if it.randomized:
            it.displayTurn(it.turn)
        
        #TURN POINTER
        it.turnPointer = Frame(it.bingoFrame, height=155, width=60, bg=TC2022_blue[dark])
        it.turnLabel = Label(it.turnPointer, text=" << ", font=("Gotham", 20, "bold"), fg=TC2022_white[normal], bg=TC2022_blue[dark])

    

    def display(it, s, root, teamA, teamB, teamC) -> None:

        #RE-INITIALIZE
        s.clear(True)
        it.__init__(it, root, teamA, teamB, teamC)

        #MAIN CONTAINER FRAME
        it.bingoFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)

        #BACKGROUND
        it.bgCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)

        #TITLE
        it.bingoTitle.place(relx=0.97, rely=0.04, anchor=NE)

        #TIMER
        it.timer.place(relx=0.842, rely=0.12, anchor=N)
    
        #CONTAINER GRID
        it.gridFrame.place(relx=0.04, rely=0.55, anchor=W)

        #SQUARE GRID
        for i in range(6):
            for j in range(6):
                it.gridSquare[i*6+j].place(relx=j/6, rely=i/6, relheight=1/6, relwidth=1/6, anchor=NW)
                it.gridLabel[i*6+j].place(relx=0.5, rely=0.5, relheight=0.9, relwidth=0.9, anchor=CENTER)
        for i in teamA.bingoCorrectList:
            it.gridLabel[i].configure(text="A", fg=TC2022_yellow[normal])
        for i in teamB.bingoCorrectList:
            it.gridLabel[i].configure(text="B", fg=TC2022_yellow[normal])
        for i in teamC.bingoCorrectList:
            it.gridLabel[i].configure(text="C", fg=TC2022_yellow[normal])

        #SCOREBOARD
        it.scoreFrameA.place(relx=0.475, rely=0.21)
        it.scoreFrameB.place(relx=0.475, rely=0.21)
        it.scoreFrameC.place(relx=0.475, rely=0.21)
        it.teamAScore.place(relx=0.5, rely=0.55, relheight=0.35, relwidth=0.9, anchor=N)
        it.teamBScore.place(relx=0.5, rely=0.55, relheight=0.35, relwidth=0.9, anchor=N)
        it.teamCScore.place(relx=0.5, rely=0.55, relheight=0.35, relwidth=0.9, anchor=N)
        it.teamALabel.place(relx=0.5, rely=0.05, anchor=N)
        it.teamBLabel.place(relx=0.5, rely=0.05, anchor=N)
        it.teamCLabel.place(relx=0.5, rely=0.05, anchor=N)
        it.teamAName.place(relx=0.5, rely=0.29, anchor=N)
        it.teamBName.place(relx=0.5, rely=0.29, anchor=N)
        it.teamCName.place(relx=0.5, rely=0.29, anchor=N)

        #TURN POINTER
        it.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
        it.turnPointer.place(relx=0.6935, rely=0.21)


    def gridColor(it, i):
        if it.gridState[i] == 0:
            return TC2022_color3[dark]
        elif it.gridState[i] == 1:
            return TC2022_yellow[normal]
        elif it.gridState[i] == 2:
            return TC2022_red[normal]
        elif it.gridState[i] == 3:
            return TC2022_blue[normal]


    def randomizeTurn(it):
        it.randomized = True
        it.turn = random.randint(0, 2)
        for i in range(30):
            it.displayTurn(i%3)
            sleep(0.6*cos(i*3.14159/58))
            if ((i%3 == it.turn) and (29-i <= 3)):
                break



    def displayTurn(it, i):
        if i == 0:
            it.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
            it.turnPointer.place(relx=0.6935, rely=0.21)
            it.scoreFrameA.configure(bg=TC2022_blue[dark])
            it.scoreFrameB.configure(bg=TC2022_color2[dark])
            it.scoreFrameC.configure(bg=TC2022_color2[dark])
            it.teamALabel.configure(bg=TC2022_blue[dark])
            it.teamBLabel.configure(bg=TC2022_color2[dark])
            it.teamCLabel.configure(bg=TC2022_color2[dark])
            it.teamAName.configure(bg=TC2022_blue[dark])
            it.teamBName.configure(bg=TC2022_color2[dark])
            it.teamCName.configure(bg=TC2022_color2[dark])
        elif i == 1:
            it.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
            it.turnPointer.place(relx=0.6935, rely=0.445)
            it.scoreFrameA.configure(bg=TC2022_color2[dark])
            it.scoreFrameB.configure(bg=TC2022_blue[dark])
            it.scoreFrameC.configure(bg=TC2022_color2[dark])
            it.teamALabel.configure(bg=TC2022_color2[dark])
            it.teamBLabel.configure(bg=TC2022_blue[dark])
            it.teamCLabel.configure(bg=TC2022_color2[dark])
            it.teamAName.configure(bg=TC2022_color2[dark])
            it.teamBName.configure(bg=TC2022_blue[dark])
            it.teamCName.configure(bg=TC2022_color2[dark])
        elif i == 2:
            it.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
            it.turnPointer.place(relx=0.6935, rely=0.68)
            it.scoreFrameA.configure(bg=TC2022_color2[dark])
            it.scoreFrameB.configure(bg=TC2022_color2[dark])
            it.scoreFrameC.configure(bg=TC2022_blue[dark])
            it.teamALabel.configure(bg=TC2022_color2[dark])
            it.teamBLabel.configure(bg=TC2022_color2[dark])
            it.teamCLabel.configure(bg=TC2022_blue[dark])
            it.teamAName.configure(bg=TC2022_color2[dark])
            it.teamBName.configure(bg=TC2022_color2[dark])
            it.teamCName.configure(bg=TC2022_blue[dark])