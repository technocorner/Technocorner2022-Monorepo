from tkinter import *
from assets.collor_pallete import *


class scoreboard:

    def __init__(self, root, main, teamA, teamB, teamC) -> None:

        #MAIN CONTAINER FRAME
        self.mainFrame = Frame(root)
        self.mainFrame.place(
            relheight = 0.94,
            relwidth = 1,
            relx = 0,
            rely = 0.06,
            anchor = NW
        )

        #PER TEAM FRAME
        self.teamFrame = [Frame(self.mainFrame, bg = TC2022_bg_color) for i in range(3)]
        for i in range(3):
            self.teamFrame[i].place(
                relheight = 1/3,
                relwidth = 1,
                relx = 0,
                rely = i/3,
                anchor = NW
            )

        #PER TEAM ENTRY
        self.teamLabel1 = []
        self.teamNameEntry = []
        self.teamLabel2 = []
        self.teamScoreEntry = []
        self.teamUpdate = []
        for i in range(3):
            if i == 0: 
                temp = 'A'
                team = teamA
            elif i == 1: 
                temp = 'B'
                team = teamB
            elif i == 2: 
                temp = 'C'
                team = teamC

            self.teamLabel1.append(Label(self.teamFrame[i]))
            self.teamLabel1[i].configure(
                text = "Nama Tim " + temp + " :",
                font = ("Gotham", 12, "bold"),
                bg = TC2022_bg_color,
                fg = TC2022_white[normal]
            )

            self.teamNameEntry.append(Entry(self.teamFrame[i]))
            self.teamNameEntry[i].configure(
                bg = TC2022_color2[normal],
                fg = TC2022_white[normal],
                justify = LEFT,
                font = ("Gotham", 14, "bold")
            )
            self.teamNameEntry[i].insert(0, team.name)
            
            self.teamLabel2.append(Label(self.teamFrame[i]))
            self.teamLabel2[i].configure(
                text = "Skor Tim " + temp + " :",
                font = ("Gotham", 12, "bold"),
                bg = TC2022_bg_color,
                fg = TC2022_white[normal]
            )

            self.teamScoreEntry.append(Entry(self.teamFrame[i]))
            self.teamScoreEntry[i].configure(
                bg = TC2022_color2[normal],
                fg = TC2022_white[normal],
                justify = LEFT,
                font = ("Gotham", 14, "bold")
            )
            self.teamScoreEntry[i].insert(0, str(team.score))

            self.teamUpdate.append(Button(self.teamFrame[i]))
            self.teamUpdate[i].configure(
                text = "Update Data",
                font = ("Gotham", 12, "bold"),
                bg = TC2022_color1[normal],
                fg = TC2022_white[normal],
                command = lambda i=i, team=team:[
                    team.updateTeamData(
                        self.teamNameEntry[i].get(),
                        int(self.teamScoreEntry[i].get())
                    ),
                    main.refresh(0, teamA, teamB, teamC)
                ]
            )

            self.teamLabel1[i].place(
                relx = 0.1, 
                rely = 0.05
            )

            self.teamNameEntry[i].place(
                relheight = 0.18,
                relwidth = 0.8,
                relx = 0.1,
                rely = 0.18
            )

            self.teamLabel2[i].place(
                relx = 0.1,
                rely = 0.4
            )

            self.teamScoreEntry[i].place(
                relheight = 0.18,
                relwidth = 0.8,
                relx = 0.1,
                rely = 0.53
            )

            self.teamUpdate[i].place(
                relheight = 0.15,
                relwidth = 0.8,
                relx = 0.1,
                rely = 0.78
            )