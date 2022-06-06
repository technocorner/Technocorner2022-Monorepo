from tkinter import *
from unittest.mock import NonCallableMagicMock
from assets.collor_pallete import *



class bingoTransition:

    def __init__(self, root, main, teamA, teamB, teamC) -> None:
        
        #MAIN CONTAINER FRAME
        self.mainFrame = Frame(root, bg=TC2022_bg_color)
        self.mainFrame.place(
            relheight = 0.94,
            relwidth = 1,
            relx = 0, 
            rely = 0.06,
            anchor = NW
        )



class bingo:

    def __init__(self, root, main, teamA, teamB, teamC) -> None:

        #VARIABLES
        try:
            if self.noInit:
                pass
        except:
            self.noInit = True
            self.timerState = False
            #self.randomized = False

        #MAIN CONTAINER FRAME
        self.mainFrame = Frame(
            root,
            bg = TC2022_bg_color
        )
        self.mainFrame.place(
            relheight = 0.94,
            relwidth = 1,
            relx = 0, 
            rely = 0.06,
            anchor = NW
        )

        #GRID CONTAINER FRAME
        self.gridFrame = Frame(
            self.mainFrame,
            height = 420,
            width = 420,
            bg = TC2022_color3[dark]
        )
        self.gridFrame.place(
            relx = 0.5,
            rely = 0.35,
            anchor = CENTER
        )

        #GRID PER SQUARE
        self.gridSquare = []
        self.gridButton = []
        for i in range(6):
            for j in range(6):
                self.gridSquare.append(
                    Frame(
                        self.gridFrame,
                        bg = TC2022_color1[dark]
                    )
                )
                self.gridButton.append(
                    Button(
                        self.gridSquare[i*6 + j],
                        text = main.display[2].bingoGrid.whoSolved(i*6 + j),
                        font = ("Play Pretend", 20),
                        bg = main.display[2].bingoGrid.gridColor(i*6 + j),
                        fg = main.display[2].bingoGrid.isAnswered(i*6 + j, True),
                        command = lambda i=i, j=j:[
                            main.display[2].makeSureDisplay(i*6 + j),
                            self.buttonDo(0, root, main, teamA, teamB, teamC, args1 = i*6 + j)
                        ],
                        state = main.display[2].bingoGrid.isAnswered(i*6 + j, False)
                    )
                )
                self.gridSquare[i*6 + j].place(
                    relheight = 1/6,
                    relwidth = 1/6,
                    relx = j/6,
                    rely = i/6,
                    anchor = NW
                )
                self.gridButton[i*6 + j].place(
                    relheight = 0.9,
                    relwidth = 0.9,
                    relx = 0.5,
                    rely = 0.5,
                    anchor = CENTER
                )

        #START TIMER BUTTON
        if not self.timerState:
            self.timerButton = Button(
                self.mainFrame,
                text = "start timer",
                font = ("Gotham", 14),
                bg = TC2022_color1[normal],
                fg = "white",
                command = lambda:[
                    main.display[2].timer.start(),
                    self.buttonDo(1, root, main, teamA, teamB, teamC)
                ] 
            )
        else:
            self.timerButton = Button(
                self.mainFrame,
                text = "stop timer",
                font = ("Gotham", 14),
                bg = TC2022_red[normal],
                fg = "white",
                command = lambda:[ 
                    main.display[2].timer.stop(),
                    self.buttonDo(1, root, main, teamA, teamB, teamC)
                ]
            )
        self.timerButton.place(
            relx = 0.065,
            rely = 0.68,
            anchor = NW
        )

        #ADD BINGO BUTTON
        self.bingoButton = []
        temp = ["A", "B", "C"]
        team = [teamA, teamB, teamC]
        for i in range(3):
            self.bingoButton.append(
                Button(
                    self.mainFrame,
                    text = "BINGO " + temp[i],
                    font = ("Gotham", 12),
                    bg = TC2022_yellow[dark],
                    fg = "black",
                    command = lambda team=team[i], i=i:[
                        team.addScore(30),
                        main.display[2].teamScore[i].configure(text = str(team.score))
                    ]
                )
            )
            self.bingoButton[i].place(
                relx = 0.34 + 0.2*i,
                rely = 0.684,
                anchor = NW
            )


    #DEFINE WHAT ELSE THE BUTTONS DO
    def buttonDo(self, buttonCode, root, main, teamA, teamB, teamC, args1=0, args2=False) -> None:
        
        if buttonCode == 0: #GRID BUTTON

            #DISABLE ALL THE BUTTON
            for i in range(36):
                self.gridButton[i].configure(state = DISABLED)

            #APPEAR THE YES/NO BUTTON
            self.temp = [args1, args2]
            self.NButton = Button(
                self.mainFrame,
                text = "N",
                font = ("Play Pretend", 20),
                height = 2,
                width = 5,
                bg = TC2022_red[normal],
                fg = "black",
                command = lambda:[
                    main.display[2].problemFrame.destroy(),
                    self.buttonDo(2, root, main, teamA, teamB, teamC, args2 = False),
                    self.YButton.destroy(),
                    self.NButton.destroy()
                ]
            )
            self.YButton = Button(
                self.mainFrame,
                text = "Y",
                font = ("Play Pretend", 20),
                height = 2,
                width = 5,
                bg = TC2022_color3[light],
                fg = "black",
                command = lambda:[
                    main.display[2].problemDisplay(args1),
                    self.buttonDo(2, root, main, teamA, teamB, teamC, args1 = self.temp[0], args2 = True),
                    self.NButton.destroy(),
                    self.YButton.destroy()
                ]
            )
            self.NButton.place(
                relx = 1/3,
                rely = 0.85,
                anchor = CENTER
            )
            self.YButton.place(
                relx = 2/3,
                rely = 0.85,
                anchor = CENTER
            )
        
        elif buttonCode == 1: #TIMER BUTTON
            self.timerState = not self.timerState
            if self.timerState:
                self.timerButton.configure(
                    text = "stop timer",
                    bg = TC2022_red[normal],
                    command = lambda:[
                        main.display[2].timer.stop(),
                        self.buttonDo(1, root, main, teamA, teamB, teamC)
                    ]
                )
            else:
                self.timerButton.configure(
                    text = "start timer",
                    bg = TC2022_color1[normal],
                    command = lambda:[
                        main.display[2].timer.start(),
                        self.buttonDo(1, root, main, teamA, teamB, teamC)
                    ]
                )

        elif buttonCode == 2: #TRUE OR FALSE BUTTON
            if args2:
                self.falseButton = Button(
                    self.mainFrame,
                    text = "X",
                    font = ("Gotham", 20, "bold"),
                    height = 2,
                    width = 5,
                    bg = TC2022_red[normal],
                    fg = "black",
                    command = lambda:[
                        main.display[2].bingoGrid.addTry(args1, teamA, teamB, teamC),
                        main.display[2].problemTimer.stop(),
                        main.display[2].problemFrame.destroy(),
                        self.update(main, teamA, teamB, teamC),
                        self.trueButton.destroy(),
                        self.falseButton.destroy()
                    ]
                )
                self.trueButton = Button(
                    self.mainFrame,
                    text = "O",
                    font = ("Gotham", 20, "bold"),
                    height = 2,
                    width = 5,
                    bg = TC2022_color3[light],
                    fg = "black",
                    command = lambda:[
                        main.display[2].bingoGrid.trueAnswer(args1, teamA, teamB, teamC),
                        main.display[2].problemTimer.stop(),
                        main.display[2].problemFrame.destroy(),
                        self.update(main, teamA, teamB, teamC),
                        self.falseButton.destroy(),
                        self.trueButton.destroy()
                    ]
                )
                self.falseButton.place(
                relx = 1/3,
                rely = 0.85,
                anchor = CENTER
                )
                self.trueButton.place(
                    relx = 2/3,
                    rely = 0.85,
                    anchor = CENTER
                )
            else:
                for i in range(36):
                    self.gridButton[i].configure(state = main.display[2].bingoGrid.isAnswered(i, False))


    #BINGO EFFECTS
    def bingoFx(self, main, arg=0) -> None:
        if arg == 0:
            pass


    #UPDATING THE GRID
    def update(self, main, teamA, teamB, teamC) -> None:
        for i in range(36):
            self.gridButton[i].configure(
                text = main.display[2].bingoGrid.whoSolved(i),
                bg = main.display[2].bingoGrid.gridColor(i),
                state = main.display[2].bingoGrid.isAnswered(i, False)
            )
            main.display[2].gridLabel[i].configure(
                text = main.display[2].bingoGrid.whoSolved(i),
                bg = main.display[2].bingoGrid.gridColor(i),
                fg = main.display[2].bingoGrid.isAnswered(i, True)
            )
            if i < 3:
                if i == 0:
                    team = teamA
                elif i == 1:
                    team = teamB
                elif i == 2:
                    team = teamC
                main.display[2].teamScore[i].configure(
                    text = str(team.score)
                )
        main.display[2].showTurn(main.display[2].bingoGrid.currentTurn)

