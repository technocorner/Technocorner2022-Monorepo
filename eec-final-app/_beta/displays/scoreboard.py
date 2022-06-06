from tkinter import *
from PIL import ImageTk, Image
from assets.collor_pallete import *

class scoreboard:

    def __init__(it, root, teamA, teamB, teamC) -> None:

        #MAIN CONTAINER FRAME
        it.scoreBoardFrame = Frame(root)

        #BACKGROUND
        it.bgCanvas = Canvas(it.scoreBoardFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
        it.bg = ImageTk.PhotoImage(Image.open("assets/scoreboard_bg.png"))
        it.bgCanvas.create_image(0, 0, anchor=NW, image=it.bg)

        #SCOREBOARD FRAME
        it.teamAFrame = Frame(it.scoreBoardFrame, height=250, width=310, bg=TC2022_color2[light])
        it.teamBFrame = Frame(it.scoreBoardFrame, height=250, width=310, bg=TC2022_color2[light])
        it.teamCFrame = Frame(it.scoreBoardFrame, height=250, width=310, bg=TC2022_color2[light])

        #TEAM LABEL
        it.teamALabel = Label(it.teamAFrame, text="TIM A", bg=TC2022_color2[light], fg=TC2022_white[light])
        it.teamBLabel = Label(it.teamBFrame, text="TIM B", bg=TC2022_color2[light], fg=TC2022_white[light])
        it.teamCLabel = Label(it.teamCFrame, text="TIM C", bg=TC2022_color2[light], fg=TC2022_white[light])
        it.teamALabel.configure(font=("Gotham", 24, "bold"))
        it.teamBLabel.configure(font=("Gotham", 24, "bold"))
        it.teamCLabel.configure(font=("Gotham", 24, "bold"))

        #TEAM NAME
        it.teamAName = Label(it.teamAFrame, text=teamA.name, bg=TC2022_color2[light], fg=TC2022_yellow[normal])
        it.teamBName = Label(it.teamBFrame, text=teamB.name, bg=TC2022_color2[light], fg=TC2022_yellow[normal])
        it.teamCName = Label(it.teamCFrame, text=teamC.name, bg=TC2022_color2[light], fg=TC2022_yellow[normal])
        it.teamAName.configure(font=("Gotham", 18, "bold"))
        it.teamBName.configure(font=("Gotham", 18, "bold"))
        it.teamCName.configure(font=("Gotham", 18, "bold"))

        #TEAM SCORE
        it.teamAScore = Label(it.teamAFrame, text=teamA.score, bg=TC2022_white[normal], fg=TC2022_color1[dark])
        it.teamBScore = Label(it.teamBFrame, text=teamB.score, bg=TC2022_white[normal], fg=TC2022_color1[dark])
        it.teamCScore = Label(it.teamCFrame, text=teamC.score, bg=TC2022_white[normal], fg=TC2022_color1[dark])
        it.teamAScore.configure(font=("Play Pretend", 60))
        it.teamBScore.configure(font=("Play Pretend", 60))
        it.teamCScore.configure(font=("Play Pretend", 60))

    def display(it, s, root, teamA, teamB, teamC) -> None:

        #RE-INITIALIZE
        s.clear(True)
        it.__init__(root, teamA, teamB, teamC)

        #MAIN CONTAINER FRAME
        it.scoreBoardFrame.place(relheight=1, relwidth=1, relx=0, rely=0)

        #BACKGROUND
        it.bgCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)

        #SCOREBOARD FRAME
        it.teamAFrame.place(relx=0.22, rely=0.5, anchor=CENTER)
        it.teamBFrame.place(relx=0.5, rely=0.5, anchor=CENTER)
        it.teamCFrame.place(relx=0.78, rely=0.5, anchor=CENTER)

        #TEAM LABEL
        it.teamALabel.place(relx=0.5, rely=0.04, anchor=N)
        it.teamBLabel.place(relx=0.5, rely=0.04, anchor=N)
        it.teamCLabel.place(relx=0.5, rely=0.04, anchor=N)

        #TEAM NAME
        it.teamAName.place(relx=0.5, rely=0.21, anchor=N)
        it.teamBName.place(relx=0.5, rely=0.21, anchor=N)
        it.teamCName.place(relx=0.5, rely=0.21, anchor=N)

        #TEAM SCORE
        it.teamAScore.place(relx=0.5, rely=0.44, relheight=0.45, relwidth=0.82, anchor=N)
        it.teamBScore.place(relx=0.5, rely=0.44, relheight=0.45, relwidth=0.82, anchor=N)
        it.teamCScore.place(relx=0.5, rely=0.44, relheight=0.45, relwidth=0.82, anchor=N)

    