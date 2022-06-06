from tkinter import *
from assets.collor_pallete import *


class bingotransitioncontrol:
    def __init__(it, root) -> None:

        #MAIN CONTAINER FRAME
        it.bingoTransitionFrame = Frame(root, bg=TC2022_bg_color)

    def display(it, root) -> None:

        #RE-INITIALIZE
        it.__init__(root)

        #MAIN CONTAINER FRAME
        it.bingoTransitionFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)


class bingocontrol:
    def __init__(it, s, root, teamA, teamB, teamC) -> None:
        
        #CONSTANT VARIABLES
        try:
            if it.noInit:
                pass
        except:
            it.noInit = True
            it.timerState = False
            it.gridState = [0 for i in range(36)]

        #MAIN CONTAINER FRAME
        it.bingoFrame = Frame(root, bg=TC2022_bg_color)


    def display(it) -> None:
        #MAIN CONTAINER FRAME
        it.bingoFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)