from tkinter import *
from assets.collor_pallete import *
from PIL import ImageTk, Image


class scoreboard:

    def __init__(self, root, teamA, teamB, teamC) -> None:
        
        #MAIN CONTAINER FRAME
        self.mainFrame = Frame(root)
        self.mainFrame.place(
            relheight = 1,
            relwidth = 1,
            relx = 0,
            rely = 0,
            anchor = NW
        )

        #BACKGROUND
        self.bgCanvas = Canvas(
            self.mainFrame,
            bg = TC2022_bg_color,
            bd = 0,
            highlightthickness = 0
        )
        self.bg = ImageTk.PhotoImage(Image.open("assets/scoreboard_bg.png"))
        self.bgCanvas.create_image(0, 0, anchor=NW, image=self.bg)
        self.bgCanvas.place(
            relheight = 1,
            relwidth = 1,
            relx = 0, 
            rely = 0,
            anchor = NW
        )

        #PER TEAM FRAME
        self.teamFrame = [Frame(
            self.mainFrame,
            height = 250,
            width = 310,
            bg = TC2022_color2[light]
        ) for i in range(3)]
        self.teamFrame[0].place(
            relx=0.22,
            rely=0.5,
            anchor=CENTER
        )
        self.teamFrame[1].place(
            relx=0.5, 
            rely=0.5, 
            anchor=CENTER
        )
        self.teamFrame[2].place(
            relx=0.78, 
            rely=0.5, 
            anchor=CENTER
        )

        #PER TEAM LABEL
        self.teamLabel = []
        self.teamName = []
        self.teamScore = []

        for i in range(3):
            if i == 0:
                temp = 'A'
                team = teamA
            elif i == 1:
                temp = 'B'
                team = teamB
            else:
                temp = 'C'
                team = teamC

            self.teamLabel.append(Label(self.teamFrame[i]))
            self.teamLabel[i].configure(
                text = "TIM " + temp,
                font = ("Gotham", 24, "bold"),
                bg = TC2022_color2[light],
                fg = TC2022_white[light]
            )
            self.teamLabel[i].place(
                relx = 0.5,
                rely = 0.04,
                anchor = N
            )

            self.teamName.append(Label(self.teamFrame[i]))
            self.teamName[i].configure(
                text = team.name,
                font = ("Gotham", 18, "bold"),
                bg = TC2022_color2[light],
                fg = TC2022_yellow[normal]
            )
            self.teamName[i].place(
                relx = 0.5,
                rely = 0.21,
                anchor = N
            )

            self.teamScore.append(Label(self.teamFrame[i]))
            self.teamScore[i].configure(
                text = str(team.score),
                font = ("Play Pretend", 60),
                bg = TC2022_white[normal],
                fg = TC2022_color1[dark]
            )
            self.teamScore[i].place(
                relheight = 0.45,
                relwidth = 0.82,
                relx = 0.5,
                rely = 0.44,
                anchor = N
            )


