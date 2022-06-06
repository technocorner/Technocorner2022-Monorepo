from tkinter import *
from assets.collor_pallete import *

class scoreboardcontrol:
    
    def __init__(it, s, root, mainRoot, mainScoreBoard, teamA, teamB, teamC) -> None:

        #MAIN CONTAINER FRAME
        it.scoreBoardFrame = Frame(root)

        #PER TEAM FRAME
        it.teamAFrame = Frame(it.scoreBoardFrame, bg=TC2022_bg_color)
        it.teamBFrame = Frame(it.scoreBoardFrame, bg=TC2022_bg_color)
        it.teamCFrame = Frame(it.scoreBoardFrame, bg=TC2022_bg_color)

        #TEAM A ENTRY FORM
        it.teamALabel1 = Label(it.teamAFrame, text="Nama Tim A :", bg=TC2022_bg_color, fg=TC2022_white[normal])
        it.teamALabel1.configure(font=("Gotham", 12, "bold"))
        it.teamANameEntry = Entry(it.teamAFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        it.teamANameEntry.configure(font=("Gotham", 14, "bold"))
        it.teamALabel2 = Label(it.teamAFrame, text="Skor Tim A:", bg=TC2022_bg_color, fg=TC2022_white[normal])
        it.teamALabel2.configure(font=("Gotham", 12, "bold"))
        it.teamAScoreEntry = Entry(it.teamAFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        it.teamAScoreEntry.configure(font=("Gotham", 14, "bold"))
        it.teamAUpdate = Button(it.teamAFrame, text="Update data", command=lambda:[teamA.setName(it.teamANameEntry.get()), teamA.setScore(int(it.teamAScoreEntry.get())), mainScoreBoard.display(s, mainRoot, teamA, teamB, teamC)])
        it.teamAUpdate.configure(font=("Gotham", 12, "bold"), bg=TC2022_color1[normal], fg=TC2022_white[normal])

        #TEAM B ENTRY FORM
        it.teamBLabel1 = Label(it.teamBFrame, text="Nama Tim B :", bg=TC2022_bg_color, fg=TC2022_white[normal])
        it.teamBLabel1.configure(font=("Gotham", 12, "bold"))
        it.teamBNameEntry = Entry(it.teamBFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        it.teamBNameEntry.configure(font=("Gotham", 14, "bold"))
        it.teamBLabel2 = Label(it.teamBFrame, text="Skor Tim B:", bg=TC2022_bg_color, fg=TC2022_white[normal])
        it.teamBLabel2.configure(font=("Gotham", 12, "bold"))
        it.teamBScoreEntry = Entry(it.teamBFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        it.teamBScoreEntry.configure(font=("Gotham", 14, "bold"))
        it.teamBUpdate = Button(it.teamBFrame, text="Update data", command=lambda:[teamB.setName(it.teamBNameEntry.get()), teamB.setScore(int(it.teamBScoreEntry.get())), mainScoreBoard.display(s, mainRoot, teamA, teamB, teamC)])
        it.teamBUpdate.configure(font=("Gotham", 12, "bold"), bg=TC2022_color1[normal], fg=TC2022_white[normal])

        #TEAM C ENTRY FORM
        it.teamCLabel1 = Label(it.teamCFrame, text="Nama Tim C :", bg=TC2022_bg_color, fg=TC2022_white[normal])
        it.teamCLabel1.configure(font=("Gotham", 12, "bold"))
        it.teamCNameEntry = Entry(it.teamCFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        it.teamCNameEntry.configure(font=("Gotham", 14, "bold"))
        it.teamCLabel2 = Label(it.teamCFrame, text="Skor Tim C:", bg=TC2022_bg_color, fg=TC2022_white[normal])
        it.teamCLabel2.configure(font=("Gotham", 12, "bold"))
        it.teamCScoreEntry = Entry(it.teamCFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        it.teamCScoreEntry.configure(font=("Gotham", 14, "bold"))
        it.teamCUpdate = Button(it.teamCFrame, text="Update data", command=lambda:[teamC.setName(it.teamCNameEntry.get()), teamC.setScore(int(it.teamCScoreEntry.get())), mainScoreBoard.display(s, mainRoot, teamA, teamB, teamC)])
        it.teamCUpdate.configure(font=("Gotham", 12, "bold"), bg=TC2022_color1[normal], fg=TC2022_white[normal])

    def display(it, s, root, mainRoot, mainScoreBoard, teamA, teamB, teamC) -> None:

        #RE-INITIALIZE
        it.__init__(s, root, mainRoot, mainScoreBoard, teamA, teamB, teamC)

        #MAIN CONTAINER FRAME
        it.scoreBoardFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)

        #PER TEAM FRAME
        it.teamAFrame.place(relheight=1/3, relwidth=1, relx=0, rely=0, anchor=NW)
        it.teamBFrame.place(relheight=1/3, relwidth=1, relx=0, rely=1/3, anchor=NW)
        it.teamCFrame.place(relheight=1/3, relwidth=1, relx=0, rely=2/3, anchor=NW)

        #TEAM A ENTRY FORM
        it.teamALabel1.place(relx=0.1, rely=0.05)
        it.teamALabel2.place(relx=0.1, rely=0.4)
        it.teamANameEntry.place(relx=0.1, rely=0.18, relheight=0.18, relwidth=0.8)
        it.teamAScoreEntry.place(relx=0.1, rely=0.53, relheight=0.18, relwidth=0.8)
        it.teamAUpdate.place(relx=0.1, rely=0.78, relheight=0.15, relwidth=0.8)

        #TEAM B ENTRY FORM
        it.teamBLabel1.place(relx=0.1, rely=0.05)
        it.teamBLabel2.place(relx=0.1, rely=0.4)
        it.teamBNameEntry.place(relx=0.1, rely=0.18, relheight=0.18, relwidth=0.8)
        it.teamBScoreEntry.place(relx=0.1, rely=0.53, relheight=0.18, relwidth=0.8)
        it.teamBUpdate.place(relx=0.1, rely=0.78, relheight=0.15, relwidth=0.8)
        
        #TEAM C ENTRY FORM
        it.teamCLabel1.place(relx=0.1, rely=0.05)
        it.teamCLabel2.place(relx=0.1, rely=0.4)
        it.teamCNameEntry.place(relx=0.1, rely=0.18, relheight=0.18, relwidth=0.8)
        it.teamCScoreEntry.place(relx=0.1, rely=0.53, relheight=0.18, relwidth=0.8)
        it.teamCUpdate.place(relx=0.1, rely=0.78, relheight=0.15, relwidth=0.8)