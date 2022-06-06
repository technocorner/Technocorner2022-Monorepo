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
                        self.countStatus = False
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



class gambleTransition:

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
        self.bg = ImageTk.PhotoImage(Image.open("assets/transition_gamble_bg.png"))
        self.bgCanvas.create_image(0, 0, anchor=NW, image=self.bg)
        self.bgCanvas.place(
            relheight = 1,
            relwidth = 1,
            relx = 0,
            rely = 0,
            anchor = NW
        )



class gamble:

    def __init__(self, root, teamA, teamB, teamC) -> None:
        
        #CONSTANT VARIABLES
        try:
            if self.noInit:
                pass
        except:
            self.startRead()
            teamA.addScore(50)
            teamB.addScore(50)
            teamC.addScore(50)
            self.noInit = True
            self.problemNo = 1
            self.problemTheme = [
                "Teori Bilangan", "Dinamika", "Kasus Logika",
                "Momentum dan Impuls", "Geometri", "Aljabar",
                "Kombinatorika", "Listrik-Magnet", "Teori Bilangan",
                "Strategic Counting", "Gravitasi", "Aritmetika Modulo"
            ]
            self.showingTheme = True
            self.showingProblem = False
            self.checkUpdate = False
            self.teamAturn = False
            self.teamBturn = False
            self.teamCturn = False

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

        #TITLE
        self.bingoTitle = Label(
            self.mainFrame,
            text = "BABAK GAMBLE",
            font = ("Gotham", 32, "bold"),
            bg = TC2022_bg_color,
            fg = TC2022_yellow[normal],
        )
        self.bingoTitle.place(
            relx = 0.97,
            rely = 0.04,
            anchor = NE
        )

        #PROBLEM THEME FRAME
        self.themeFrame = Frame(
            self.mainFrame,
            bg = TC2022_color1[dark]
        )
        self.themeFrame.place(
            relheight = 0.5,
            relwidth = 1,
            relx = 0,
            rely = 0.42,
            anchor = W
        )
        self.themeLabel1 = Label(
            self.themeFrame,
            text = "SOAL KE-" + str(self.problemNo),
            font = ("Play Pretend", 56),
            bg = TC2022_color1[dark],
            fg = TC2022_white[normal]
        )
        self.themeLabel1.place(
            relx = 0.5,
            rely = 0.08,
            anchor = N
        )
        self.themeLabel2 = Label(
            self.themeFrame,
            text = "dengan tema :",
            font = ("Gotham", 24),
            bg = TC2022_color1[dark],
            fg = TC2022_yellow[normal]
        )
        self.themeLabel2.place(
            relx = 0.5,
            rely = 0.33,
            anchor = N
        )
        self.problemThemeFrame = Frame(
            self.themeFrame,
            bg = TC2022_white[light]
        )
        self.problemThemeFrame.place(
            relheight = 0.3,
            relwidth = 0.7,
            relx = 0.5,
            rely = 0.55,
            anchor = N
        )

        #SCOREBOARD
        self.scoreFrame = [Frame(
            self.mainFrame,
            height = 160,
            width = 270,
            bg = TC2022_color2[dark]
        ) for i in range(3)]
        self.scoreFrame[0].place(
            relx = 0.035,
            rely = 0.945,
            anchor = SW
        )
        self.scoreFrame[1].place(
            relx = 0.26,
            rely = 0.945,
            anchor = SW
        )
        self.scoreFrame[2].place(
            relx = 0.485,
            rely = 0.945,
            anchor = SW
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



    def themeReveal(self) -> None:

        #REVEAL THE THEME
        self.theme = Label(
            self.problemThemeFrame,
            text = self.problemTheme[self.problemNo - 1],
            font = ("Gotham", 50),
            bg = TC2022_white[light],
            fg = TC2022_bg_color
        )
        self.theme.place(
            relx = 0.5,
            rely = 0.5,
            anchor = CENTER
        )

        #SHOW 10 SECONDS TIMER
        self.themeTimer = timer(
            self.mainFrame,
            48,
            "MS",
            hour = '00',
            minute = '00',
            second = '10'
        )
        self.themeTimer.timerLabel.place(
            relx = 0.845,
            rely = 0.83,
            anchor = CENTER
        )
        self.themeTimer.start()



    def next(self, root, teamA, teamB, teamC, args=2, score=0) -> None:
        
        if self.showingTheme and not self.showingProblem:

            #STOP READING BELL INPUT
            self.stopRead()

            #PROBLEM FRAME
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

            #PLACE THE PROBLEM
            self.problemCanvas = Canvas(
                self.problemFrame,
                bg = TC2022_bg_color,
                bd = 0,
                highlightthickness = 0
            )
            self.problem = ImageTk.PhotoImage(Image.open("problems/gamble" + str(self.problemNo) + ".png"))
            self.problemCanvas.create_image(0, 0, anchor = NW, image = self.problem)
            self.problemCanvas.place(
                relheight = 0.7,
                relwidth = 0.85,
                relx = 0.5,
                rely = 0.05,
                anchor = N
            )

            #STOP THE TIMER
            self.themeTimer.stop()
            self.showingTheme = False
            self.showingProblem = True
        
        elif not self.showingTheme and self.showingProblem:
            
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

            #IF THE TIME IS OVER, ADD ANOTHER 1 MINUTE TO SAVE THE POINT
            self.extraTimer = timer(
                self.problemFrame,
                32,
                "MS",
                hour = '00',
                minute = '01',
                second = '00'
            )

            #START TIMER
            self.showingProblem = False
            self.problemTimer.start()

        else:
            
            #SCORE
            if args == 0:
                if self.teamAturn:
                    teamA.subScore(score)
                elif self.teamBturn:
                    teamB.subScore(score)
                elif self.teamCturn:
                    teamC.subScore(score)

            elif args == 1:
                if self.teamAturn:
                    teamA.addScore(score)
                elif self.teamBturn:
                    teamB.addScore(score)
                elif self.teamCturn:
                    teamC.addScore(score)

            elif args == 2:
                pass

            #ADD PROBLEM NUMBER AND DESTROY MAINFRAME
            self.problemNo += 1
            self.resetTurn()
            self.startRead()
            try:
                self.problemTimer.stop()
                self.extraTimer.stop()
            except:
                pass
            self.mainFrame.destroy()

            #INITIALIZE AGAIN
            self.__init__(root, teamA, teamB, teamC)
            self.showingTheme = True


    def bellTurn(self) -> None:
        while True:

            if self.checkUpdate:
                pass
            else:
                break

        if self.teamAturn:
            self.scoreFrame[0].configure(bg = TC2022_red[dark])
            self.teamLabel[0].configure(bg = TC2022_red[dark])
            self.teamName[0].configure(bg = TC2022_red[dark])

        elif self.teamBturn:
            self.scoreFrame[0].configure(bg = TC2022_red[dark])
            self.teamLabel[0].configure(bg = TC2022_red[dark])
            self.teamName[0].configure(bg = TC2022_red[dark])

        elif self.teamCturn:
            self.scoreFrame[0].configure(bg = TC2022_red[dark])
            self.teamLabel[0].configure(bg = TC2022_red[dark])
            self.teamName[0].configure(bg = TC2022_red[dark])
            
        return None

    
    def startRead(self) -> None:
        self.thread = threading.Thread(target = self.bellTurn)
        self.checkUpdate = True
        self.thread.start()
    def stopRead(self) -> None:
        self.checkUpdate = False
        self.thread.join()


    def resetTurn(self) -> None:
        if self.teamAturn:
            self.scoreFrame[0].configure(bg = TC2022_color2[dark])
            self.teamLabel[0].configure(bg = TC2022_color2[dark])
            self.teamName[0].configure(bg = TC2022_color2[dark])
            self.teamAturn = False

        elif self.teamBturn:
            self.scoreFrame[0].configure(bg = TC2022_color2[dark])
            self.teamLabel[0].configure(bg = TC2022_color2[dark])
            self.teamName[0].configure(bg = TC2022_color2[dark])
            self.teamBturn = False

        elif self.teamCturn:
            self.scoreFrame[0].configure(bg = TC2022_color2[dark])
            self.teamLabel[0].configure(bg = TC2022_color2[dark])
            self.teamName[0].configure(bg = TC2022_color2[dark])
            self.teamCturn = False