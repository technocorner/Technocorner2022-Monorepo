from tkinter import *
from displays import scoreboard, bingo, gamble
from admin import admin_main
from ext import team, history
from assets.collor_pallete import *

#GLOBAL VARIABLES
currentDisplay = "scoreboard"

#COMPETITION HISTORY
history = history.history("history")

#LIST OF TEAM
teamA = team.team()
teamB = team.team()
teamC = team.team()

#DISPLAY WINDOWS
#[1] MAIN DISPLAY
mainDisplay = Tk()
mainDisplay.geometry('1280x720')
mainDisplay.resizable(False, False)
mainDisplay.title(string="Grandfinal EEC Technocorner 2022")
mainDisplay.iconbitmap("assets/tc_logo.ico")
mainDisplay.configure(background=TC2022_bg_color)
mainWaitingLabel = Label(mainDisplay, bg=TC2022_bg_color, fg=TC2022_white[normal], text="WAITING FOR COMMITTEE...")
mainWaitingLabel.configure(font=("Gotham", 45, "bold"))
mainWaitingLabel.place(relx=0.5, rely=0.5, anchor=CENTER)

#[2] control display
controlDisplay = Tk()
controlDisplay.geometry('480x720')
controlDisplay.resizable(False, False)
controlDisplay.configure(background=TC2022_bg_color)
controlDisplay.title(string="Control Log") 
controlDisplay.iconbitmap("assets/tc_logo.ico")
controlWaitingLabel = Label(controlDisplay, bg=TC2022_bg_color, fg=TC2022_white[normal], text="CONSIDER TO SWITCH DISPLAY")
controlWaitingLabel.configure(font=("Gotham", 14, "bold"))
controlWaitingLabel.place(relx=0.5, rely=0.52, anchor=CENTER)

#[3] clear display
class clear:

    def __init__(it) -> None:
        pass

    def clear(it, s):

        #IN MAIN DISPLAY
        if s:
            try:
                scoreBoardDisplay.scoreBoardFrame.destroy()
            except:
                pass
            try:
                bingoTransitionDisplay.bingoTransitionFrame.destroy()
            except:
                pass

        #IN CONTROL DISPLAY
        else:
            try:
                mainWaitingLabel.destroy()
                controlWaitingLabel.destroy()
            except:
                pass
            try:
                switchButton.scoreBoardDisplay.scoreBoardFrame.destroy()
            except:
                pass
            try:
                switchButton.bingoTransitionDisplay.bingoTransitionFrame.destroy()
            except:
                pass
clean = clear()

#DISPLAYS IN MAIN
scoreBoardDisplay = scoreboard.scoreboard(mainDisplay, teamA, teamB, teamC)
bingoTransitionDisplay = bingo.bingotransition(mainDisplay)
bingoDisplay = bingo.bingo(mainDisplay, teamA, teamB, teamC)

#DISPLAYS IN CONTROL
switchButton = admin_main.switchbutton(clean, controlDisplay, mainDisplay, scoreBoardDisplay, bingoTransitionDisplay, bingoDisplay, teamA, teamB, teamC)

#MAIN LOOP
mainDisplay.mainloop()
controlDisplay.mainloop()