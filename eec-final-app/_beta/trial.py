import threading
import time
from tkinter import *
from PIL import ImageTk, Image

#-------------------------[ CLASS TIM ]------------------------------
class tim:
    def __init__(self, teamname, point):
        self.teamName = teamname
        self.score = point
        self.bingoData = []
    def incScore(self, point):
        self.score += point
    def decScore(self, point):
        self.score -= point
    def updateTeamData(self, str, point):
        self.teamName = str
        self.score = point
teamA = tim("??? team", 0)
teamB = tim("??? team", 0)
teamC = tim("??? team", 0)

#----------------------------[ COLOR PALLETE TC2022 ]----------------------------
TC2022_bg_color = "#0d261f"
TC2022_color1 = ["#0c594b", "#0a493d", "#006854"]
TC2022_color2 = ["#0b8c75", "#006d58", "#009e80"]
TC2022_color3 = ["#04bfad", "#059b89", "#1ad3bd"]
TC2022_color4 = ["#05f2db", "#00d3b9", "#33ffe6"]
TC2022_blue = ["#118ab2", "#027493", "#07a6d1"]
TC2022_yellow = ["#ffd166", "#edb74c", "#f9cd87"]
TC2022_red = ["#ef476f", "#d13462", "#ff6c96"]
TC2022_white = ["#fcfcfc", "#d6d4d5", "#ffffff"]
normal = 0
dark = 1
light = 2

#------------------------------[ WINDOWS UNTUK DIDISPLAY ]----------------------------  
rootDisplay = Tk()
rootDisplay.geometry('1280x720')
rootDisplay.resizable(False, False)
rootDisplay.title(string="Grandfinal EEC Technocorner 2022")
rootDisplay.iconbitmap("assets/tc_logo.ico")
rootDisplay.configure(background=TC2022_bg_color)
waitingLabel = Label(rootDisplay, bg=TC2022_bg_color, fg=TC2022_white[normal], text="WAITING FOR COMMITTEE...")
waitingLabel.configure(font=("Gotham", 45, "bold"))
waitingLabel.place(relx=0.5, rely=0.5, anchor=CENTER)

#------------------------------[ WINDOWS UNTUK CONTROL ]------------------------------
#Windows untuk control
rootControl = Tk()
rootControl.geometry('480x720')
rootControl.resizable(False, False)
rootControl.configure(background=TC2022_bg_color)
rootControl.title(string="Control Log") 
rootControl.iconbitmap("assets/tc_logo.ico")
startLabel = Label(rootControl, bg=TC2022_bg_color, fg=TC2022_white[normal], text="CONSIDER TO SWITCH DISPLAY")
startLabel.configure(font=("Gotham", 14, "bold"))
startLabel.place(relx=0.5, rely=0.52, anchor=CENTER)

#-----------------------------[ CLASS BINGO ]---------------------------------
class grid:
    def __init__(self):
        self.problemState = [[0 for x in range(6)] for x in range(6)]
    def color(self, row, col):
        if self.problemState[row][col] == 0:
            return TC2022_color3[dark]
        elif self.problemState[row][col] == 1:
            return TC2022_yellow[normal]
        elif self.problemState[row][col] == 2:
            return TC2022_red[normal]
        elif self.problemState[row][col] == 3:
            return TC2022_blue[normal]
    def add(self, row, col, tim):
        self.problemState[row][col] += 1
        if self.problemState[row][col] == 2:
            tim.score -= 10
    def trueAnswer(self, row, col, tim):
        self.problemState[row][col] = 3
        tim.score += 10
        tim.bingoData.append(row*6+col)
    def restore(self, row, col, state):
        self.problemState[row][col] = state
bingoGrid = grid()

#------------------------[ CLASS TAMPILAN DISPLAY ]----------------------------
def destroyAll_1():
    try:
        main_display.mainScoreboardFrame.destroy()
    except:
        pass
    try:
        bingoTransition_display.bingoTransitionFrame.destroy()
    except:
        pass
    try:
        bingo_display.bingoFrame.destroy()
    except:
        pass
    try:
        gambleTransition_display.gambleTransitionFrame.destroy()
    except:
        pass

class mainDisplay:
    def __init__(self) -> None:    
        #container frame untuk menu papan utama
        destroyAll_1()
        self.mainScoreboardFrame = Frame(rootDisplay)
        self.mainScoreboardFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
    def display(self):
        #container frame untuk menu papan utama
        destroyAll_1()
        waitingLabel.destroy()
        self.mainScoreboardFrame = Frame(rootDisplay)
        self.mainScoreboardFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
        #background
        self.bgCanvas = Canvas(self.mainScoreboardFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
        self.bg = ImageTk.PhotoImage(Image.open("assets/scoreboard_bg.png"))
        self.bgCanvas.create_image(0, 0, anchor=NW, image=self.bg)
        self.bgCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)
        #papan skor
        self.teamAFrame = Frame(self.mainScoreboardFrame, height=250, width=310, bg=TC2022_color2[light])
        self.teamBFrame = Frame(self.mainScoreboardFrame, height=250, width=310, bg=TC2022_color2[light])
        self.teamCFrame = Frame(self.mainScoreboardFrame, height=250, width=310, bg=TC2022_color2[light])
        self.teamAFrame.place(relx=0.22, rely=0.5, anchor=CENTER)
        self.teamBFrame.place(relx=0.5, rely=0.5, anchor=CENTER)
        self.teamCFrame.place(relx=0.78, rely=0.5, anchor=CENTER)
        #tim A, B, C
        self.teamALabel = Label(self.teamAFrame, text="TIM A", bg=TC2022_color2[light], fg=TC2022_white[light])
        self.teamBLabel = Label(self.teamBFrame, text="TIM B", bg=TC2022_color2[light], fg=TC2022_white[light])
        self.teamCLabel = Label(self.teamCFrame, text="TIM C", bg=TC2022_color2[light], fg=TC2022_white[light])
        self.teamALabel.configure(font=("Gotham", 24, "bold"))
        self.teamBLabel.configure(font=("Gotham", 24, "bold"))
        self.teamCLabel.configure(font=("Gotham", 24, "bold"))
        self.teamALabel.place(relx=0.5, rely=0.04, anchor=N)
        self.teamBLabel.place(relx=0.5, rely=0.04, anchor=N)
        self.teamCLabel.place(relx=0.5, rely=0.04, anchor=N)
        #nama timS
        self.teamAName = Label(self.teamAFrame, text=teamA.teamName, bg=TC2022_color2[light], fg=TC2022_yellow[normal])
        self.teamBName = Label(self.teamBFrame, text=teamB.teamName, bg=TC2022_color2[light], fg=TC2022_yellow[normal])
        self.teamCName = Label(self.teamCFrame, text=teamC.teamName, bg=TC2022_color2[light], fg=TC2022_yellow[normal])
        self.teamAName.configure(font=("Gotham", 18, "bold"))
        self.teamBName.configure(font=("Gotham", 18, "bold"))
        self.teamCName.configure(font=("Gotham", 18, "bold"))
        self.teamAName.place(relx=0.5, rely=0.21, anchor=N)
        self.teamBName.place(relx=0.5, rely=0.21, anchor=N)
        self.teamCName.place(relx=0.5, rely=0.21, anchor=N)
        #skor
        self.teamAScore = Label(self.teamAFrame, text=teamA.score, bg=TC2022_white[normal], fg=TC2022_color1[dark])
        self.teamBScore = Label(self.teamBFrame, text=teamB.score, bg=TC2022_white[normal], fg=TC2022_color1[dark])
        self.teamCScore = Label(self.teamCFrame, text=teamC.score, bg=TC2022_white[normal], fg=TC2022_color1[dark])
        self.teamAScore.configure(font=("Play Pretend", 60))
        self.teamBScore.configure(font=("Play Pretend", 60))
        self.teamCScore.configure(font=("Play Pretend", 60))
        self.teamAScore.place(relx=0.5, rely=0.44, relheight=0.45, relwidth=0.82, anchor=N)
        self.teamBScore.place(relx=0.5, rely=0.44, relheight=0.45, relwidth=0.82, anchor=N)
        self.teamCScore.place(relx=0.5, rely=0.44, relheight=0.45, relwidth=0.82, anchor=N)

class bingoTransitionDisplay():
    def __init__(self) -> None:
        #container frame untuk menu transisi bingo
        destroyAll_1()
        self.bingoTransitionFrame = Frame(rootDisplay)
        self.bingoTransitionFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
    def display(self):
         #container frame untuk menu transisi bingo
        destroyAll_1()
        self.bingoTransitionFrame = Frame(rootDisplay)
        self.bingoTransitionFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
        #background
        self.bgCanvas = Canvas(self.bingoTransitionFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
        self.bg = ImageTk.PhotoImage(Image.open("assets/transition_bingo_bg.png"))
        self.bgCanvas.create_image(0, 0, anchor=NW, image=self.bg)
        self.bgCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)

class bingoDisplay():
    def __init__(self) -> None:
        #container
        destroyAll_1()
        self.bingoFrame = Frame(rootDisplay)
        self.bingoFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
        #variabel awal
        self.turnN = 0
        self.minute = "100"
        self.second = "00"
        self.timestate= False
    def display(self):
        #container utama
        destroyAll_1()
        self.bingoFrame = Frame(rootDisplay)
        self.bingoFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
        #background
        self.bgCanvas = Canvas(self.bingoFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
        self.bg = ImageTk.PhotoImage(Image.open("assets/scoreboard_bg.png"))
        self.bgCanvas.create_image(0, 0, anchor=NW, image=self.bg)
        self.bgCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)
        #title
        self.bingoTitle = Label(self.bingoFrame, text="BABAK BINGO", bg=TC2022_bg_color, fg=TC2022_yellow[normal], font=("Gotham", 32, "bold"))
        self.bingoTitle.place(relx=0.97, rely=0.04, anchor=NE)
        #container grid
        self.gridFrame = Frame(self.bingoFrame, bg=TC2022_color1[dark], height=540, width=540)
        self.gridFrame.place(relx=0.04, rely=0.55, anchor=W)
        #grid per square
        self.gridSquare = []
        self.gridLabel = []
        for i in range(6):
            for j in range(6):
                self.gridSquare.append(Frame(self.gridFrame, bg=TC2022_color1[dark]))
                self.gridLabel.append(Label(self.gridSquare[i*6+j], text=str(i*6+j+1), font=("Play Pretend", 24), bg=bingoGrid.color(i, j), fg=TC2022_white[normal]))
                self.gridSquare[i*6+j].place(relx=j/6, rely=i/6, relheight=1/6, relwidth=1/6, anchor=NW)
                self.gridLabel[i*6+j].place(relx=0.5, rely=0.5, relheight=0.9, relwidth=0.9, anchor=CENTER)
        for x in teamA.bingoData:
            self.gridLabel[x].configure(text="A", fg=TC2022_yellow[normal])
        for x in teamB.bingoData:
            self.gridLabel[x].configure(text="B", fg=TC2022_yellow[normal])
        for x in teamC.bingoData:
            self.gridLabel[x].configure(text="C", fg=TC2022_yellow[normal])
        #scoreboard team A, B, C
        self.scoreFrameA = Frame(self.bingoFrame, height=155, width=280, bg=TC2022_blue[dark])
        self.scoreFrameB = Frame(self.bingoFrame, height=155, width=280, bg=TC2022_color2[dark])
        self.scoreFrameC = Frame(self.bingoFrame, height=155, width=280, bg=TC2022_color2[dark])
        self.scoreFrameA.place(relx=0.475, rely=0.21)
        self.scoreFrameB.place(relx=0.475, rely=0.445)
        self.scoreFrameC.place(relx=0.475, rely=0.68)
        self.teamAScore = Label(self.scoreFrameA, text=str(teamA.score), font=("Play Pretend", 28), fg=TC2022_color1[dark], bg=TC2022_white[normal])
        self.teamBScore = Label(self.scoreFrameB, text=str(teamB.score), font=("Play Pretend", 28), fg=TC2022_color1[dark], bg=TC2022_white[normal])
        self.teamCScore = Label(self.scoreFrameC, text=str(teamC.score), font=("Play Pretend", 28), fg=TC2022_color1[dark], bg=TC2022_white[normal])
        self.teamAScore.place(relx=0.5, rely=0.55, relheight=0.35, relwidth=0.9, anchor=N)
        self.teamBScore.place(relx=0.5, rely=0.55, relheight=0.35, relwidth=0.9, anchor=N)
        self.teamCScore.place(relx=0.5, rely=0.55, relheight=0.35, relwidth=0.9, anchor=N)
        self.teamALabel = Label(self.scoreFrameA, text="TIM A", font=("Gotham", 20, "bold"), bg=TC2022_blue[dark], fg=TC2022_white[normal])
        self.teamBLabel = Label(self.scoreFrameB, text="TIM B", font=("Gotham", 20, "bold"), bg=TC2022_color2[dark], fg=TC2022_white[normal])
        self.teamCLabel = Label(self.scoreFrameC, text="TIM C", font=("Gotham", 20, "bold"), bg=TC2022_color2[dark], fg=TC2022_white[normal])
        self.teamALabel.place(relx=0.5, rely=0.05, anchor=N)
        self.teamBLabel.place(relx=0.5, rely=0.05, anchor=N)
        self.teamCLabel.place(relx=0.5, rely=0.05, anchor=N)
        self.teamAName = Label(self.scoreFrameA, text=teamA.teamName, font=("Gotham", 16, "bold"), bg=TC2022_blue[dark], fg=TC2022_yellow[normal])
        self.teamBName = Label(self.scoreFrameB, text=teamB.teamName, font=("Gotham", 16, "bold"), bg=TC2022_color2[dark], fg=TC2022_yellow[normal])
        self.teamCName = Label(self.scoreFrameC, text=teamC.teamName, font=("Gotham", 16, "bold"), bg=TC2022_color2[dark], fg=TC2022_yellow[normal])
        self.teamAName.place(relx=0.5, rely=0.29, anchor=N)
        self.teamBName.place(relx=0.5, rely=0.29, anchor=N)
        self.teamCName.place(relx=0.5, rely=0.29, anchor=N)
        #pointer giliran
        self.turnPointer = Frame(self.bingoFrame, height=155, width=60, bg=TC2022_blue[dark])
        self.turnLabel = Label(self.turnPointer, text=" << ", font=("Gotham", 20, "bold"), fg=TC2022_white[normal], bg=TC2022_blue[dark])
        self.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
        self.turnPointer.place(relx=0.6935, rely=0.21)
        #timer
        self.timerLabel = Label(self.bingoFrame, text=" Sisa waktu >>   "+self.minute+" : "+self.second+" ", bg=TC2022_color1[dark], fg=TC2022_white[normal], font=("Gotham", 18))
        self.timerLabel.place(relx=0.842, rely=0.12, anchor=N)
    def next(self):
        #ganti giliran
        self.turnN = (self.turnN+1)%3
        if self.turnN == 0:
            self.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
            self.turnPointer.place(relx=0.6935, rely=0.21)
            self.scoreFrameA.configure(bg=TC2022_blue[dark])
            self.teamALabel.configure(bg=TC2022_blue[dark])
            self.teamAName.configure(bg=TC2022_blue[dark])
            self.scoreFrameC.configure(bg=TC2022_color2[dark])
            self.teamCLabel.configure(bg=TC2022_color2[dark])
            self.teamCName.config(bg=TC2022_color2[dark])
        elif self.turnN == 1:
            self.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
            self.turnPointer.place(relx=0.6935, rely=0.445)
            self.scoreFrameB.configure(bg=TC2022_blue[dark])
            self.teamBLabel.configure(bg=TC2022_blue[dark])
            self.teamBName.configure(bg=TC2022_blue[dark])
            self.scoreFrameA.configure(bg=TC2022_color2[dark])
            self.teamALabel.configure(bg=TC2022_color2[dark])
            self.teamAName.config(bg=TC2022_color2[dark])
        elif self.turnN == 2:
            self.turnLabel.place(relx=0.5, rely=0.5, anchor=CENTER)
            self.turnPointer.place(relx=0.6935, rely=0.68)
            self.scoreFrameC.configure(bg=TC2022_blue[dark])
            self.teamCLabel.configure(bg=TC2022_blue[dark])
            self.teamCName.configure(bg=TC2022_blue[dark])
            self.scoreFrameB.configure(bg=TC2022_color2[dark])
            self.teamBLabel.configure(bg=TC2022_color2[dark])
            self.teamBName.config(bg=TC2022_color2[dark])
    def whatTurn(self) -> tim:
        if self.turnN == 0:
            return teamA
        if self.turnN == 1:
            return teamB
        if self.turnN == 2:
            return teamC
    def updateInfo(self, row, col):
        #update warna kotak
        self.gridLabel[row*6+col].configure(bg=bingoGrid.color(row, col))
        if bingoGrid.problemState[row][col] == 3:
            if self.turnN == 0:
                self.gridLabel[row*6+col].configure(text="A", fg=TC2022_yellow[normal])
            elif self.turnN == 1:
                self.gridLabel[row*6+col].configure(text="B", fg=TC2022_yellow[normal])
            elif self.turnN == 2:
                self.gridLabel[row*6+col].configure(text="C", fg=TC2022_yellow[normal])
    def updateScore(self):
        self.teamAScore.configure(text=str(teamA.score))
        self.teamBScore.configure(text=str(teamB.score))
        self.teamCScore.configure(text=str(teamC.score))
    def makeSureDisplay(self, row, col):
        #jaga-jaga kalo salah klik
        n = int(row*6) + int(col) + 1
        self.problemFrame = Frame(self.bingoFrame, bg=TC2022_bg_color)
        self.problemFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
        self.rusureLabel1 = Label(self.problemFrame, text="Kotak nomor "+str(n), font=("Play Pretend", 56), bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.rusureLabel2 = Label(self.problemFrame, text="Apakah sudah siap?", font=("Gotham", 30, "bold"), bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.rusureLabel1.place(relx=0.5, rely=0.43, anchor=CENTER)
        self.rusureLabel2.place(relx=0.5, rely=0.53, anchor=CENTER)
    def problemDisplay(self, row, col):
        #menampilkan soal
        n = row*6 + col + 1
        self.rusureLabel1.destroy()
        self.rusureLabel2.destroy()
        try:
            self.problemCanvas = Canvas(self.problemFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
            self.problem = ImageTk.PhotoImage(Image.open("problems/bingo_"+str(n)+".png"))
            self.problemCanvas.create_image(640, 0, anchor=N, image=self.problem)
            self.problemCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)
        except:
            pass
        #timer
        self.hasStarted = True
        self.problemMinute = '03'
        self.problemSecond = '00'
        self.problemTimer = Label(self.problemFrame, text=self.problemMinute+" : "+self.problemSecond, bg=TC2022_color1[dark], fg=TC2022_white[normal], font=("Gotham", 40))
        self.problemTimer.place(relx=0.5, rely=0.82, anchor=N)
    def problemDisplayClick(self):
        #timer 3 menit
        while(int(self.problemMinute)>0 or int(self.problemSecond)>0):
            time.sleep(1)
            if self.hasStarted:
                self.problemSecond = str(int(self.problemSecond)-1)
                if int(self.problemSecond) < 0:
                    self.problemSecond = "59"
                    self.problemMinute = '0' + str(int(self.problemMinute)-1)
                if (int(self.problemSecond)<10 and int(self.problemSecond)>=0):
                    self.problemSecond = "0" + self.problemSecond
                self.problemTimer.configure(text=self.problemMinute+" : "+self.problemSecond)
            else:
                break
    def problemDisplayThread(self):
        self.problemTime = threading.Thread(target=self.problemDisplayClick)
        self.problemTime.start()
    def problemDisplayThreadEnd(self):
        self.hasStarted = False
        self.problemTime.join()
        self.problemFrame.destroy()
    def hundredMinute(self):
        while(int(self.minute)>0 or int(self.second)>0):
            time.sleep(1)
            if self.timestate:
                self.second = str(int(self.second)-1)
                if (int(self.second)<10 and int(self.second)>=0):
                    self.second = "0" + self.second
                if int(self.second) < 0:
                    self.second = "59"
                    self.minute = str(int(self.minute)-1)
                if (int(self.minute)<10 and int(self.minute)>=0):
                    self.minute = "0" + self.minute
                self.timerLabel.configure(text="Sisa waktu >>   "+self.minute+" : "+self.second)
            else:
                break
    def threeMinute(self):
        pass
    def startTimer(self):
        self.timer = threading.Thread(target=self.hundredMinute)
        self.timestate = True
        self.timer.start()
    def stopTimer(self):
        self.timestate = False
        self.timer.join()
                
class gambleTransitionDisplay():
    def __init__(self) -> None:
        #container frame untuk menu transisi gamble
        destroyAll_1()
        self.gambleTransitionFrame = Frame(rootDisplay)
        self.gambleTransitionFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
    def display(self):
         #container frame untuk menu transisi gamble
        destroyAll_1()
        self.gambleTransitionFrame = Frame(rootDisplay)
        self.gambleTransitionFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
        #background
        self.bgCanvas = Canvas(self.gambleTransitionFrame, bg=TC2022_bg_color, bd=0, highlightthickness=0)
        self.bg = ImageTk.PhotoImage(Image.open("assets/transition_gamble_bg.png"))
        self.bgCanvas.create_image(0, 0, anchor=NW, image=self.bg)
        self.bgCanvas.place(relx=0, rely=0, relwidth=1, relheight=1, anchor=NW)

class gambleDisplay():
    def __init__(self) -> None:
        #container frame menu gamble
        destroyAll_1()
        self.gambleFrame = Frame(rootDisplay)
        self.gambleFrame.place(relheight=1, relwidth=1, relx=0, rely=0, anchor=NW)
    def display(self):
        pass

#----------------------[ OUTPUT TAMPILAN DISPLAY ]---------------------------
main_display = mainDisplay()
bingoTransition_display = bingoTransitionDisplay()
bingo_display = bingoDisplay()
gambleTransition_display = gambleTransitionDisplay()
destroyAll_1()

#-----------------------[ CLASS TAMPILAN CONTROL ]-----------------------------
def destroyAll_2():
    try:
        controlMain_display.mainFrame.destroy()
    except:
        pass
    try:
        controlBT_display.mainFrame.destroy()
    except:
        pass
    try:
        controlBingo_display.mainFrame.destroy()
    except:
        pass
    try:
        controlGT_display.mainFrame.destroy()
    except:
        pass

def m():
    #action main switch display button
    control_display.mainButton.configure(bg=TC2022_blue[dark], fg=TC2022_yellow[normal], activebackground=TC2022_color2[light])
    control_display.bingoTransitionButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.bingoButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.gambleTransitionButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])

def bt():
    #action bingo-t switch display button
    control_display.bingoTransitionButton.configure(bg=TC2022_blue[dark], fg=TC2022_yellow[normal], activebackground=TC2022_color2[light])
    control_display.mainButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.bingoButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.gambleTransitionButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])

def b():
    #action bingo switch display button
    control_display.bingoButton.configure(bg=TC2022_blue[dark], fg=TC2022_yellow[normal], activebackground=TC2022_color2[light])
    control_display.mainButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.bingoTransitionButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.gambleTransitionButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])

def gt():
    #action gamble-t switch display button
    control_display.gambleTransitionButton.configure(bg=TC2022_blue[dark], fg=TC2022_yellow[normal], activebackground=TC2022_color2[light])
    control_display.mainButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.bingoTransitionButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])
    control_display.bingoButton.configure(bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark])

class controlDisplay:
    def __init__(self) -> None:
        #menu tombol switch display
        self.switchDisplayFrame = Frame(rootControl, bg=TC2022_bg_color)
        self.switchDisplayFrame.place(relheight=0.06, relwidth=1, relx=0, rely=0, anchor=NW)
        #tombol Main
        self.mainButton = Button(self.switchDisplayFrame, text="Main", command=lambda:[main_display.display(), m(), controlMain_display.display(), controlMain_display.teamANameEntry.insert(0, teamA.teamName), controlMain_display.teamAScoreEntry.insert(0, str(teamA.score)), controlMain_display.teamBNameEntry.insert(0, teamB.teamName), controlMain_display.teamBScoreEntry.insert(0, str(teamB.score)), controlMain_display.teamCNameEntry.insert(0, teamC.teamName), controlMain_display.teamCScoreEntry.insert(0, str(teamC.score))], bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        self.mainButton.configure(font=("Gotham", 11, "bold"))
        self.mainButton.place(relheight=1, relwidth=0.2, relx=0, rely=0, anchor=NW)
        #tombol Bingo-T
        self.bingoTransitionButton = Button(self.switchDisplayFrame, text="Bingo-T", command=lambda:[bingoTransition_display.display(), bt(), controlBT_display.display()], bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        self.bingoTransitionButton.configure(font=("Gotham", 11, "bold"))
        self.bingoTransitionButton.place(relheight=1, relwidth=0.2, relx=0.2, rely=0, anchor=NW)
        #tombol Bingo
        self.bingoButton = Button(self.switchDisplayFrame, text="Bingo", command=lambda:[bingo_display.display(), b(), controlBingo_display.display()], bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        self.bingoButton.configure(font=("Gotham", 11, "bold"))
        self.bingoButton.place(relheight=1, relwidth=0.2, relx=0.4, rely=0, anchor=NW)
        #tombol Gamble-T
        self.gambleTransitionButton = Button(self.switchDisplayFrame, text="Gamble-T", command=lambda:[gambleTransition_display.display(), gt(), controlGT_display.display()],  bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        self.gambleTransitionButton.configure(font=("Gotham", 11, "bold"))
        self.gambleTransitionButton.place(relheight=1, relwidth=0.2, relx=0.6, rely=0, anchor=NW)
        #tombol Gamble
        self.gambleButton = Button(self.switchDisplayFrame, text="Gamble", bg=TC2022_color2[light], fg=TC2022_white[light], activebackground=TC2022_blue[dark], activeforeground="black", relief=GROOVE, bd=1)
        self.gambleButton.configure(font=("Gotham", 11, "bold"))
        self.gambleButton.place(relheight=1, relwidth=0.2, relx=0.8, rely=0, anchor=NW)

class controlMainDisplay:
    def __init__(self) -> None:
        #tampilan scoreboard utama
        destroyAll_2()
        #container
        self.mainFrame = Frame(rootControl)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)
    def display(self):
        destroyAll_2()
        startLabel.destroy()
        #container ABC
        self.mainFrame = Frame(rootControl)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)
        self.teamAFrame = Frame(self.mainFrame, bg=TC2022_bg_color)
        self.teamBFrame = Frame(self.mainFrame, bg=TC2022_bg_color)
        self.teamCFrame = Frame(self.mainFrame, bg=TC2022_bg_color)
        self.teamAFrame.place(relheight=0.33, relwidth=1, relx=0, rely=0, anchor=NW)
        self.teamBFrame.place(relheight=0.33, relwidth=1, relx=0, rely=0.33, anchor=NW)
        self.teamCFrame.place(relheight=0.34, relwidth=1, relx=0, rely=0.66, anchor=NW)
        #entry A
        self.teamALabel1 = Label(self.teamAFrame, text="Nama Tim A :", bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.teamALabel1.configure(font=("Gotham", 12, "bold"))
        self.teamANameEntry = Entry(self.teamAFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        self.teamANameEntry.configure(font=("Gotham", 14, "bold"))
        self.teamALabel2 = Label(self.teamAFrame, text="Skor Tim A:", bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.teamALabel2.configure(font=("Gotham", 12, "bold"))
        self.teamAScoreEntry = Entry(self.teamAFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        self.teamAScoreEntry.configure(font=("Gotham", 14, "bold"))
        self.teamAUpdate = Button(self.teamAFrame, text="Update data", command=lambda:[teamA.updateTeamData(self.teamANameEntry.get(), int(self.teamAScoreEntry.get())), main_display.display()])
        self.teamAUpdate.configure(font=("Gotham", 12, "bold"), bg=TC2022_color1[normal], fg=TC2022_white[normal])
        self.teamALabel1.place(relx=0.1, rely=0.05)
        self.teamALabel2.place(relx=0.1, rely=0.4)
        self.teamANameEntry.place(relx=0.1, rely=0.18, relheight=0.18, relwidth=0.8)
        self.teamAScoreEntry.place(relx=0.1, rely=0.53, relheight=0.18, relwidth=0.8)
        self.teamAUpdate.place(relx=0.1, rely=0.78, relheight=0.15, relwidth=0.8)
        #entryB
        self.teamBLabel1 = Label(self.teamBFrame, text="Nama Tim B :", bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.teamBLabel1.configure(font=("Gotham", 12, "bold"))
        self.teamBNameEntry = Entry(self.teamBFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        self.teamBNameEntry.configure(font=("Gotham", 14, "bold"))
        self.teamBLabel2 = Label(self.teamBFrame, text="Skor Tim B:", bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.teamBLabel2.configure(font=("Gotham", 12, "bold"))
        self.teamBScoreEntry = Entry(self.teamBFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        self.teamBScoreEntry.configure(font=("Gotham", 14, "bold"))
        self.teamBUpdate = Button(self.teamBFrame, text="Update data", command=lambda:[teamB.updateTeamData(self.teamBNameEntry.get(), int(self.teamBScoreEntry.get())), main_display.display()])
        self.teamBUpdate.configure(font=("Gotham", 12, "bold"), bg=TC2022_color1[normal], fg=TC2022_white[normal])
        self.teamBLabel1.place(relx=0.1, rely=0.05)
        self.teamBLabel2.place(relx=0.1, rely=0.4)
        self.teamBNameEntry.place(relx=0.1, rely=0.18, relheight=0.18, relwidth=0.8)
        self.teamBScoreEntry.place(relx=0.1, rely=0.53, relheight=0.18, relwidth=0.8)
        self.teamBUpdate.place(relx=0.1, rely=0.78, relheight=0.15, relwidth=0.8)
        #entryC
        self.teamCLabel1 = Label(self.teamCFrame, text="Nama Tim C :", bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.teamCLabel1.configure(font=("Gotham", 12, "bold"))
        self.teamCNameEntry = Entry(self.teamCFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        self.teamCNameEntry.configure(font=("Gotham", 14, "bold"))
        self.teamCLabel2 = Label(self.teamCFrame, text="Skor Tim A:", bg=TC2022_bg_color, fg=TC2022_white[normal])
        self.teamCLabel2.configure(font=("Gotham", 12, "bold"))
        self.teamCScoreEntry = Entry(self.teamCFrame, bg=TC2022_color2[normal], fg=TC2022_white[normal], justify=LEFT)
        self.teamCScoreEntry.configure(font=("Gotham", 14, "bold"))
        self.teamCUpdate = Button(self.teamCFrame, text="Update data", command=lambda:[teamC.updateTeamData(self.teamCNameEntry.get(), int(self.teamCScoreEntry.get())), main_display.display()])
        self.teamCUpdate.configure(font=("Gotham", 12, "bold"), bg=TC2022_color1[normal], fg=TC2022_white[normal])
        self.teamCLabel1.place(relx=0.1, rely=0.05)
        self.teamCLabel2.place(relx=0.1, rely=0.4)
        self.teamCNameEntry.place(relx=0.1, rely=0.18, relheight=0.18, relwidth=0.8)
        self.teamCScoreEntry.place(relx=0.1, rely=0.53, relheight=0.18, relwidth=0.8)
        self.teamCUpdate.place(relx=0.1, rely=0.78, relheight=0.15, relwidth=0.8)

class controlBTDisplay:
    def __init__(self) -> None:
        destroyAll_2()
        #container
        self.mainFrame = Frame(rootControl, bg=TC2022_bg_color)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)
    def display(self):
        destroyAll_2()
        #container
        self.mainFrame = Frame(rootControl, bg=TC2022_bg_color)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)
    
class controlBingoDisplay:
    def __init__(self) -> None:
        destroyAll_2()
        #container
        self.mainFrame = Frame(rootControl, bg=TC2022_bg_color)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)
        self.timerState = False
    def display(self):
        destroyAll_2()
        #container
        self.mainFrame = Frame(rootControl, bg=TC2022_bg_color)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)
        #container grid
        self.gridFrame = Frame(self.mainFrame, height = 420, width= 420, bg=TC2022_color3[dark])
        self.gridFrame.place(relx=0.5, rely=0.35, anchor=CENTER)
        #grid per square
        self.gridSquare = []
        self.gridButton = []
        for i in range(6):
            for j in range(6):
                self.gridSquare.append(Frame(self.gridFrame, bg=TC2022_color1[dark]))
                self.gridButton.append(Button(self.gridSquare[i*6+j], text=str(i*6+j+1), font=("Play Pretend", 20), bg=bingoGrid.color(i, j), fg=TC2022_white[normal], command=lambda i=i, j=j:self.gridPressed(i, j)))
                self.gridSquare[i*6+j].place(relx=j/6, rely=i/6, relheight=1/6, relwidth=1/6, anchor=NW)
                self.gridButton[i*6+j].place(relx=0.5, rely=0.5, relheight=0.9, relwidth=0.9, anchor=CENTER)
        for x in teamA.bingoData:
            self.gridButton[x].configure(text="A", fg=TC2022_yellow[normal], state=DISABLED)
        for x in teamB.bingoData:
            self.gridButton[x].configure(text="B", fg=TC2022_yellow[normal], state=DISABLED)
        for x in teamC.bingoData:
            self.gridButton[x].configure(text="C", fg=TC2022_yellow[normal], state=DISABLED)
        #tombol start time
        if not(self.timerState):
            self.timerButton = Button(self.mainFrame, text="start timer", fg="white", bg=TC2022_color1[normal], font=("Gotham", 14), command=self.timerButtonDo)
        else:
            self.timerButton = Button(self.mainFrame, text="stop timer", fg="white", bg=TC2022_red[normal], font=("Gotham", 14), command=self.timerButtonDo)
        self.timerButton.place(relx=0.065, rely=0.68)
        #tombol label giliran siapa
        self.turnLabel = Label(self.mainFrame, text="Giliran : Tim A", fg="white", bg=TC2022_bg_color, font=("Gotham", 14))
        self.turnLabel.place(relx = 0.6, rely=0.685)
    def timerButtonDo(self):
        self.timerState = not(self.timerState)
        if self.timerState:
            bingo_display.startTimer()
            self.timerButton.configure(text="stop timer", bg=TC2022_red[normal])
        else:
            bingo_display.stopTimer()
            self.timerButton.configure(text="start timer", bg=TC2022_color1[normal])
    def gridPressed(self, row, col):
        #semisal tombolnya dipencet
        bingo_display.updateInfo(row, col)
        bingo_display.makeSureDisplay(row, col)
        self.makeSureDisplay(row, col)
        for i in range(36):
            self.gridButton[i].configure(state=DISABLED)
    def cancelgridPressed(self):
        #ga jadi milih soal
        for i in range(36):
            self.gridButton[i].configure(state=NORMAL)
    def updateInfo(self, row, col, s):
        #update jawaban benar
        if s:
            if (bingo_display.turnN-1) == 0:
                self.gridButton[row*6+col].configure(text="A", fg=TC2022_yellow[normal], bg=bingoGrid.color(row, col))
                self.turnLabel.configure(text="Giliran : Tim B")
            elif (bingo_display.turnN-1) == 1:
                self.gridButton[row*6+col].configure(text="B", fg=TC2022_yellow[normal], bg=bingoGrid.color(row, col))
                self.turnLabel.configure(text="Giliran : Tim C")
            elif (bingo_display.turnN-1) == -1:
                self.gridButton[row*6+col].configure(text="C", fg=TC2022_yellow[normal], bg=bingoGrid.color(row, col))
                self.turnLabel.configure(text="Giliran : Tim A")
        else:
            if (bingo_display.turnN-1) == 0:
                self.gridButton[row*6+col].configure(bg=bingoGrid.color(row, col))
                self.turnLabel.configure(text="Giliran : Tim B")
            elif (bingo_display.turnN-1) == 1:
                self.gridButton[row*6+col].configure(bg=bingoGrid.color(row, col))
                self.turnLabel.configure(text="Giliran : Tim C")
            elif (bingo_display.turnN-1) == -1:
                self.gridButton[row*6+col].configure(bg=bingoGrid.color(row, col))
                self.turnLabel.configure(text="Giliran : Tim A")
    def makeSureDisplay(self, row, col):
        #jaga-jaga kalo salah klik
        self.noButton = Button(self.mainFrame, bg=TC2022_red[normal], text="N", font=("Play Pretend", 20), height=2, width=5, command=lambda:[self.yesButton.destroy(), bingo_display.problemFrame.destroy(), self.cancelgridPressed(), self.noButton.destroy()])
        self.yesButton = Button(self.mainFrame, bg=TC2022_color3[light], text="Y", font=("Play Pretend", 20), height=2, width=5, command=lambda:[self.noButton.destroy(), bingo_display.problemDisplay(row, col), bingo_display.problemDisplayThread(), self.trueorfalse(row, col), self.yesButton.destroy()])
        self.noButton.place(relx=1/3, rely=0.85, anchor=CENTER)
        self.yesButton.place(relx=2/3, rely=0.85, anchor=CENTER)
    def trueorfalse(self, row, col):
        #tombol untuk benar atau salah
        self.trueButton = Button(self.mainFrame, bg=TC2022_color3[light], text="O", font=("Gotham", 20, "bold"), height=2, width=5, command=lambda:[bingoGrid.trueAnswer(row, col, bingo_display.whatTurn()), bingo_display.updateInfo(row, col), bingo_display.next(), bingo_display.updateScore(), bingo_display.problemDisplayThreadEnd(), self.cancelgridPressed(), self.falseButton.destroy(), self.updateInfo(row, col, True), self.trueButton.destroy()])
        self.falseButton = Button(self.mainFrame, bg=TC2022_red[normal], text="X", font=("Gotham", 20, "bold"), height=2, width=5, command=lambda:[bingoGrid.add(row, col, bingo_display.whatTurn()), bingo_display.next(), bingo_display.updateInfo(row, col), bingo_display.updateScore(), bingo_display.problemDisplayThreadEnd(), self.cancelgridPressed(), self.trueButton.destroy(), self.updateInfo(row, col, False), self.falseButton.destroy()])
        self.falseButton.place(relx=1/3, rely=0.85, anchor=CENTER)
        self.trueButton.place(relx=2/3, rely=0.85, anchor=CENTER)

class controlGTDisplay:
    def __init__(self) -> None:
        destroyAll_2()
        #container
        self.mainFrame = Frame(rootControl, bg=TC2022_bg_color)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)
    def display(self):
        destroyAll_2()
        #container
        self.mainFrame = Frame(rootControl, bg=TC2022_bg_color)
        self.mainFrame.place(relheight=0.94, relwidth=1, relx=0, rely=0.06, anchor=NW)

#-----------------------[ OUTPUT TAMPILAN CONTROL ]----------------------------------
control_display = controlDisplay()
controlMain_display = controlMainDisplay()
controlBT_display = controlBTDisplay()
controlBingo_display = controlBingoDisplay()
controlGT_display = controlGTDisplay()
destroyAll_2()

#-----------------------[ LOOPING ]----------------------------------
rootDisplay.mainloop()
rootControl.mainloop()