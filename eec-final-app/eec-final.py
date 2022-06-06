from tkinter import *
from displays.control import *
from displays.main import *
from team.team import *

#TEAMS LIST
teamA = team("right hand rule", 0)
teamB = team("Kuuhaku", 0)
teamC = team("3am", 0)

#TWO WINDOWS
main = mainDisplay(teamA, teamB, teamC)
control = controlDisplay(main, teamA, teamB, teamC)
main.launch()
control.launch()