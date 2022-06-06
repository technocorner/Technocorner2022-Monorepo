from tkinter import *
from assets.collor_pallete import *
from displays.controldisplays.scoreboard import *
from displays.controldisplays.bingo import *
from displays.controldisplays.gamble import *


class controlDisplay:


    def __init__(self, main, teamA, teamB, teamC) -> None:

        #CURRENT DISPLAY
        self.currentDisplay = -1

        #WINDOWS SETUP
        self.root = Tk()
        self.root.geometry('480x720')
        self.root.resizable(False, False)
        self.root.title(string="Control Log")
        self.root.iconbitmap("assets/tc_logo.ico")
        self.root.configure(background=TC2022_bg_color)

        #SWITCH DISPLAY BUTTON FRAME
        self.switchDisplayFrame = Frame(self.root)
        self.switchDisplayFrame.place(
            relheight = 0.06,
            relwidth = 1,
            relx = 0,
            rely = 0,
            anchor = NW
        )

        #DISPLAYS
        self.display = [
            scoreboard(self.root, main, teamA, teamB, teamC),
            bingoTransition(self.root, main, teamA, teamB, teamC),
            bingo(self.root, main, teamA, teamB, teamC),
            gambleTransition(self.root, main, teamA, teamB, teamC),
            gamble(self.root, main, teamA, teamB, teamC)
        ]
        for x in self.display:
            x.mainFrame.destroy()

        #BUTTONS LIST
        self.switchButton = [Button(self.switchDisplayFrame) for i in range(5)]
        
        #0. scoreboard button
        self.switchButton[0].configure(
            text = "Main",
            bg = TC2022_color2[light],
            fg = TC2022_white[light],
            activebackground = TC2022_blue[dark],
            activeforeground = "black",
            relief = GROOVE,
            bd = 1,
            font = ("Gotham", 11, "bold"),
            command = lambda:[
                self.colorSwitch(0),
                self.refresh(0, main, teamA, teamB, teamC),
                main.refresh(0, teamA, teamB, teamC)
            ]
        )
        self.switchButton[0].place(
            relheight = 1,
            relwidth = 0.2,
            relx = 0,
            rely = 0,
            anchor = NW
        )

        #1. bingo transition button
        self.switchButton[1].configure(
            text = "Bingo-T",
            bg = TC2022_color2[light],
            fg = TC2022_white[light],
            activebackground = TC2022_blue[dark],
            activeforeground = "black",
            relief = GROOVE,
            bd = 1,
            font = ("Gotham", 11, "bold"),
            command = lambda:[
                self.colorSwitch(1),
                self.refresh(1, main, teamA, teamB, teamC),
                main.refresh(1, teamA, teamB, teamC)
            ]
        )
        self.switchButton[1].place(
            relheight = 1,
            relwidth = 0.2,
            relx = 0.2,
            rely = 0,
            anchor = NW
        )

        #2. bingo button
        self.switchButton[2].configure(
            text = "Bingo",
            bg = TC2022_color2[light],
            fg = TC2022_white[light],
            activebackground = TC2022_blue[dark],
            activeforeground = "black",
            relief = GROOVE,
            bd = 1,
            font = ("Gotham", 11, "bold"),
            command = lambda:[
                self.colorSwitch(2),
                self.refresh(2, main, teamA, teamB, teamC),
                main.refresh(2, teamA, teamB, teamC)
            ]
        )
        self.switchButton[2].place(
            relheight = 1,
            relwidth = 0.2,
            relx = 0.4,
            rely = 0,
            anchor = NW
        )

        #3. gamble transition button
        self.switchButton[3].configure(
            text = "Gamble-T",
            bg = TC2022_color2[light],
            fg = TC2022_white[light],
            activebackground = TC2022_blue[dark],
            activeforeground = "black",
            relief = GROOVE,
            bd = 1,
            font = ("Gotham", 11, "bold"),
            command = lambda:[
                self.colorSwitch(3),
                self.refresh(3, main, teamA, teamB, teamC),
                main.refresh(3, teamA, teamB, teamC)
            ]
        )
        self.switchButton[3].place(
            relheight = 1,
            relwidth = 0.2,
            relx = 0.6,
            rely = 0,
            anchor = NW
        )

        #4. gamble button
        self.switchButton[4].configure(
            text = "Gamble",
            bg = TC2022_color2[light],
            fg = TC2022_white[light],
            activebackground = TC2022_blue[dark],
            activeforeground = "black",
            relief = GROOVE,
            bd = 1,
            font = ("Gotham", 11, "bold"),
            command = lambda:[
                self.colorSwitch(4),
                self.refresh(4, main, teamA, teamB, teamC),
                main.refresh(4, teamA, teamB, teamC)
            ]
        )
        self.switchButton[4].place(
            relheight = 1,
            relwidth = 0.2,
            relx = 0.8,
            rely = 0,
            anchor = NW
        )


    def colorSwitch(self, x) -> None:

        for i in range(5):
            if x == self.currentDisplay:
                break
            elif i != x:
                self.switchButton[i].configure(
                    bg = TC2022_color2[light],
                    fg = TC2022_white[light],
                    activebackground = TC2022_blue[dark]
                )
            else:
                self.switchButton[i].configure(
                    bg = TC2022_blue[dark],
                    fg = TC2022_yellow[normal],
                    activebackground = TC2022_color2[light]
                )


    def refresh(self, x, main, teamA, teamB, teamC) -> None:
        #REFRESHING THE DISPLAY
        for i in range(5):
            if x == self.currentDisplay:
                break
            elif i != x:
                self.display[i].mainFrame.destroy()
            else:
                self.display[i].__init__(self.root, main, teamA, teamB, teamC)
                self.currentDisplay = x


    def launch(self) -> None:
        self.root.mainloop()