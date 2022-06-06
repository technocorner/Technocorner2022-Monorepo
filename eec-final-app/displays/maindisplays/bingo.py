from tkinter import *
from assets.collor_pallete import *
from PIL import ImageTk, Image
from time import sleep
import threading



class timer:

    def __init__(self, root, fontsize, mode, hour='00', minute='00', second='00') -> None:   
        self.size = fontsize
        self.hour = hour
        self.minute = minute
        self.second = second
        self.countStatus = False
        if mode == "HMS":
            #NOT USED YET
            pass
        elif mode == "MS":
            self.timerLabel = Label(
                root, 
                text = self.minute + " : " + self.second, 
                bg = TC2022_color1[dark], 
                fg = TC2022_white[normal], 
                font = ("Gotham", self.size))
        elif mode == "S":
            #NOT USED YET
            pass

    def count(self) -> None:
        while True:
            sleep(1)
            if self.countStatus:
                if(int(self.second) == 0):
                    if(int(self.minute) == 0):
                        break
                    elif(int(self.minute) <= 10):
                        self.minute = '0' + str(int(self.minute)-1)
                    else:
                        self.minute = str(int(self.minute)-1)
                    self.second = "59"
                elif(int(self.second) <= 10):
                    self.second = '0' + str(int(self.second)-1)
                else:
                    self.second = str(int(self.second)-1)
                self.timerLabel.configure(text = self.minute + " : " + self.second)
            else:
                break
        return None

    def start(self) -> None:
        self.countStatus = True
        self.thread = threading.Thread(target = self.count)
        self.thread.start()

    def stop(self) -> None:
        self.countStatus = False
        self.thread.join()



class bingoTransition:

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
        self.bg = ImageTk.PhotoImage(Image.open("assets/transition_bingo_bg.png"))
        self.bgCanvas.create_image(0, 0, anchor=NW, image=self.bg)
        self.bgCanvas.place(
            relheight = 1,
            relwidth = 1,
            relx = 0,
            rely = 0,
            anchor = NW
        )



class bingoGrid:

    def __init__(self) -> None:
        self.currentTurn = 0
        self.problemState = [0 for i in range(36)]
        self.solvedBy = ["0" for i in range(36)]

    def gridColor(self, x) -> None:
        if self.problemState[x] == 0:       #NOT TRIED AT ALL
            return TC2022_color3[dark]
        elif self.problemState[x] == 1:     #TRIED ONCE
            return TC2022_yellow[normal]
        elif self.problemState[x] == 2:     #NOT ALLOWED TO TRY ANYMORE
            return TC2022_red[normal]
        elif self.problemState[x] == 3:     #ANSWERED CORRECTLY
            return TC2022_blue[normal]

    def addTry(self, x, teamA, teamB, teamC) -> None:
        if self.problemState[x] < 2:
            self.problemState[x] += 1
            if self.problemState[x] == 2:
                if self.currentTurn == 0:
                    teamA.score -= 10
                elif self.currentTurn == 1:
                    teamB.score -= 10
                elif self.currentTurn == 2:
                    teamC.score -= 10
        self.currentTurn = (self.currentTurn + 1)%3

    def trueAnswer(self, x, teamA, teamB, teamC) -> None:
        self.problemState[x] = 3
        if self.currentTurn == 0: 
            self.solvedBy[x] = "A"
            teamA.score += 10
            teamA.bingoData.append(x)
        elif self.currentTurn == 1: 
            self.solvedBy[x] = "B"
            teamB.score += 10
            teamB.bingoData.append(x)
        elif self.currentTurn == 2: 
            self.solvedBy[x] = "C"
            teamC.score += 10
            teamC.bingoData.append(x)
        self.currentTurn = (self.currentTurn + 1)%3

    def isAnswered(self, x, mode) -> None:
        if mode:
            if self.problemState[x] == 3:
                return TC2022_yellow[normal]
            else:
                return TC2022_white[normal]
        else:
            if self.problemState[x] == 3 or self.problemState[x] == 2:
                return DISABLED
            else:
                return NORMAL

    def whoSolved(self, x) -> None:
        if self.solvedBy[x] == "0":
            return str(x + 1)
        else:
            return self.solvedBy[x]

    """ def bingoCheck(self, x, teamA, teamB, teamC) -> None:
        row = int(int(x/6)*6)
        col = x%6
        diag = 0
        cntCorrect = 0
        itRow = 0
        itCol = 0
        itDiag = 0
        isBingo = [False, False, False, False]
        if self.currentTurn == 0:
            team = teamA
            temp = "A"
        elif self.currentTurn == 1:
            team = teamB
            temp = "B"
        elif self.currentTurn == 2:
            team = teamC
            temp = "C"

        #CHECK HORIZONTALLY
        for i in range(6):
            itRow = row + i
            if self.solvedBy[itRow] == temp:
                cntCorrect += 1
            else:
                if cntCorrect == 0:
                    continue
                else:
                    break
        if cntCorrect >= 5:
            isBingo[0] = True
        cntCorrect = 0

        #CHECK VERTICALLY
        for i in range(6):
            itCol = col + i*6
            if self.solvedBy[itCol] == temp:
                cntCorrect += 1
            else:
                if cntCorrect == 0:
                    continue
                else:
                    break
        if cntCorrect >= 5:
            isBingo[1] = True
        cntCorrect = 0

        #CHECK MAIN-DIAGONALLY
        if max(int(row/6), col) == col:
            diag = col - int(row/6)
        else:
            diag = (int(row/6) - col)*6
        for i in range(6):
            itDiag = diag + i*7
            if itDiag > 35:
                break
            if self.solvedBy[itDiag] == temp:
                cntCorrect += 1
            else:
                if cntCorrect == 0:
                    continue
                else:
                    break
        if cntCorrect >= 5:
            isBingo[2] = True
        cntCorrect = 0

        #CHECK OTHER-DIAGONALLY
        if max(int(row/6), (5-col)) == (5-col):
            diag = (5-col) - int(row/6)
        else:
            diag = (int(row/6) - (5-col))*6 + 5
        for i in range(6):
            itDiag = diag + i*5
            if itDiag > 35:
                break """




class bingo:

    def __init__(self, root, teamA, teamB, teamC) -> None:

        #VARIABLES
        try:
            if self.noInit:
                pass
        except:
            self.noInit = True
            #self.randomized = False
            self.bingoGrid = bingoGrid()

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
            bg=TC2022_bg_color, 
            bd=0, 
            highlightthickness=0
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

        #TITLE
        self.bingoTitle = Label(
            self.mainFrame,
            text = "BABAK BINGO",
            font = ("Gotham", 32, "bold"),
            bg = TC2022_bg_color,
            fg = TC2022_yellow[normal],
        )
        self.bingoTitle.place(
            relx = 0.97,
            rely = 0.04,
            anchor = NE
        )

        #CONTAINER GRID
        self.gridFrame = Frame(
            self.mainFrame,
            bg = TC2022_color1[dark],
            height = 540,
            width = 540
        )
        self.gridFrame.place(
            relx = 0.04,
            rely = 0.55,
            anchor = W
        )

        #BINGO GRID
        self.gridSquare = []
        self.gridLabel = []
        for i in range(6):
            for j in range(6):
                self.gridSquare.append(
                    Frame(
                        self.gridFrame, 
                        bg=TC2022_color1[dark]
                    )
                )
                self.gridLabel.append(
                    Label(
                        self.gridSquare[i*6 + j],
                        text = self.bingoGrid.whoSolved(i*6 + j),
                        font = ("Play Pretend", 24),
                        bg = self.bingoGrid.gridColor(i*6 + j),
                        fg = self.bingoGrid.isAnswered(i*6 + j, True)
                    )
                )
                self.gridSquare[i*6 + j].place(
                    relheight = 1/6,
                    relwidth = 1/6,
                    relx = j/6,
                    rely = i/6,
                    anchor = NW
                )
                self.gridLabel[i*6 + j].place(
                    relheight = 0.9,
                    relwidth = 0.9,
                    relx = 0.5,
                    rely = 0.5,
                    anchor = CENTER
                )

        #TEAM SCOREBOARD
        self.scoreFrame = [Frame(
            self.mainFrame,
            height = 155,
            width = 280,
            bg = TC2022_color2[dark]
        ) for i in range(3)]
        self.scoreFrame[0].place(
            relx = 0.475,
            rely = 0.21
        )
        self.scoreFrame[1].place(
            relx = 0.475,
            rely = 0.445
        )
        self.scoreFrame[2].place(
            relx = 0.475,
            rely = 0.68
        )
        self.teamScore = []
        self.teamLabel = []
        self.teamName = []
        for i in range(3):
            if i == 0:
                team = teamA
                temp = "A"
            elif i == 1: 
                team = teamB
                temp = "B"
            elif i == 2: 
                team = teamC
                temp = "C"
            self.teamScore.append(Label(
                self.scoreFrame[i],
                text = str(team.score),
                font = ("Play Pretend", 28),
                bg = TC2022_white[normal],
                fg = TC2022_color1[dark]
            ))
            self.teamScore[i].place(
                relheight = 0.35,
                relwidth = 0.9,
                relx = 0.5,
                rely = 0.55,
                anchor = N
            )
            self.teamLabel.append(Label(
                self.scoreFrame[i],
                text = "TIM " + temp,
                font = ("Gotham", 20, "bold"),
                bg = TC2022_color2[dark],
                fg = TC2022_white[normal]
            ))
            self.teamLabel[i].place(
                relx = 0.5,
                rely = 0.05,
                anchor = N
            )
            self.teamName.append(Label(
                self.scoreFrame[i],
                text = team.name,
                font = ("Gotham", 16, "bold"),
                bg = TC2022_color2[dark],
                fg = TC2022_yellow[normal]
            ))
            self.teamName[i].place(
                relx = 0.5,
                rely = 0.29,
                anchor = N
            )

        #SHOWING TURN POINTER
        self.showTurn(self.bingoGrid.currentTurn)

        #TIMER
        self.timer = timer(
            self.mainFrame, 
            40, 
            "MS", 
            hour = '00', 
            minute = '100', 
            second = '00'
        )
        self.timer.timerLabel.place(
            relx = 0.87,
            rely = 0.46,
            anchor = N
        )

    #SHOW WHAT TURN NOW
    def showTurn(self, x):
        try:
            self.turnPointerFrame.destroy()
        except:
            pass
        self.turnPointerFrame = Frame(
            self.mainFrame,
            height = 155,
            width = 60,
            bg = TC2022_blue[dark]
        )
        self.turnPointerLabel = Label(
            self.turnPointerFrame,
            text = " << ",
            font = ("Gotham", 20, "bold"),
            fg = TC2022_white[normal],
            bg = TC2022_blue[dark]
        )
        self.turnPointerFrame.place(
            relx = 0.6935,
            rely = 0.21 + x*0.235,
            anchor = NW
        )
        self.turnPointerLabel.place(
            relx = 0.5,
            rely = 0.5,
            anchor = CENTER
        )
        for i in range(3):
            if i == x:
                self.scoreFrame[i].configure(bg = TC2022_blue[dark])
                self.teamLabel[i].configure(bg = TC2022_blue[dark])
                self.teamName[i].configure(bg = TC2022_blue[dark])
            else:
                self.scoreFrame[i].configure(bg = TC2022_color2[dark])
                self.teamLabel[i].configure(bg = TC2022_color2[dark])
                self.teamName[i].configure(bg = TC2022_color2[dark])

    #MAKING SURE DISPLAY
    def makeSureDisplay(self, x) -> None:
        if self.bingoGrid.currentTurn == 0:
            temp = "A"
        if self.bingoGrid.currentTurn == 1:
            temp = "B"
        if self.bingoGrid.currentTurn == 2:
            temp = "C"
        self.problemFrame = Frame(
            self.mainFrame,
            bg = TC2022_bg_color
        )
        self.problemFrame.place(
            relheight = 1,
            relwidth = 1,
            relx = 0,
            rely = 0,
            anchor = NW
        )
        self.sureLabel1 = Label(
            self.problemFrame,
            text = "Kotak nomor " + str(x + 1),
            font = ("Play Pretend", 56),
            bg = TC2022_bg_color,
            fg = TC2022_white[normal]
        )
        self.sureLabel2 = Label(
            self.problemFrame,
            text = "Apakah tim " + temp + " sudah siap?" ,
            font = ("Gotham", 30, "bold"),
            bg = TC2022_bg_color,
            fg = TC2022_white[normal]
        )
        self.sureLabel1.place(
            relx=0.5, 
            rely=0.43, 
            anchor=CENTER
        )
        self.sureLabel2.place(
            relx=0.5, 
            rely=0.53, 
            anchor=CENTER
        )

    #PROBLEM DISPLAY
    def problemDisplay(self, x) -> None:
        #1561 x 723
        #DESTROYS THE SURE LABEL
        self.sureLabel1.destroy()
        self.sureLabel2.destroy()
        
        #TIMER
        self.problemTimer = timer(
            self.problemFrame,
            40,
            "MS",
            hour = '00',
            minute = '03',
            second = '00'
        )
        self.problemTimer.timerLabel.place(
            relx = 0.5,
            rely = 0.83,
            anchor = N
        )

        #PROBLEM DISPLAY
        self.problemCanvas = Canvas(
            self.problemFrame,
            bg = TC2022_bg_color,
            bd = 0,
            highlightthickness = 0
        )
        self.problem = ImageTk.PhotoImage(Image.open("problems/bingo" + str(int(x) + 1) + ".png"))
        self.problemCanvas.create_image(0, 0, anchor = NW, image = self.problem)
        self.problemCanvas.place(
            relheight = 0.7,
            relwidth = 0.85,
            relx = 0.5,
            rely = 0.05,
            anchor = N
        )

        #START TIMER
        self.problemTimer.start()