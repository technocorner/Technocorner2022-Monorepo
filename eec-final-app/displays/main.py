from tkinter import *
from assets.collor_pallete import *
from displays.maindisplays.scoreboard import *
from displays.maindisplays.bingo import*
from displays.maindisplays.gamble import*


class mainDisplay:


    def __init__(self, teamA, teamB, teamC) -> None:
        
        #CURRENT DISPLAY
        self.currentDisplay = -1

        #WINDOWS SETUP
        self.root = Tk()
        self.root.geometry('1280x720')
        self.root.resizable(False, False)
        self.root.title(string="Grandfinal EEC Technocorner 2022")
        self.root.iconbitmap("assets/tc_logo.ico")
        self.root.configure(background=TC2022_bg_color)

        #DISPLAYS
        self.display = [
            scoreboard(self.root, teamA, teamB, teamC),
            bingoTransition(self.root, teamA, teamB, teamC),
            bingo(self.root, teamA, teamB, teamC),
            gambleTransition(self.root, teamA, teamB, teamC),
            gamble(self.root, teamA, teamB, teamC)
        ]
        for x in self.display:
            x.mainFrame.destroy()


    def refresh(self, x, teamA, teamB, teamC) -> None:
        #REFRESHING THE DISPLAY
        for i in range(5):
            if i != x:
                try:
                    self.display[i].mainFrame.destroy()
                except:
                    pass
            else:
                self.display[i].__init__(self.root, teamA, teamB, teamC)
                self.currentDisplay = x


    def launch(self) -> None:
        self.root.mainloop()