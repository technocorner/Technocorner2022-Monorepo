from tkinter import *
from assets.collor_pallete import *



class gambleTransition:

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



class gamble:

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

        #SHOW THEME BUTTON
        self.showTheme = Button(
            self.mainFrame,
            text = "Tampilkan tema",
            font = ("Gotham", 16, "bold"),
            bg = TC2022_color1[normal],
            fg = TC2022_white[normal],
            command = main.display[4].themeReveal
        )
        self.showTheme.place(
            relx = 0.5,
            rely = 0.1,
            anchor = N
        )

        #NEXT BUTTON
        self.nextButton = Button(
            self.mainFrame,
            text = "NEXT ->",
            font = ("Gotham", 16, "bold"),
            bg = TC2022_color2[normal],
            fg = TC2022_white[normal],
            command = lambda:[
                main.display[4].next(main.root, teamA, teamB, teamC, args=2)
            ]
        )
        self.nextButton.place(
            relx = 0.5,
            rely = 0.8,
            anchor = N
        )

        #ADD EXTRA TIME BUTTON
        self.extraTime = Button(
            self.mainFrame,
            text = "ADD EXTRA TIME",
            font = ("Gotham", 16, "bold"),
            bg = TC2022_yellow[normal],
            fg = "black",
            command = lambda:[
                main.display[4].extraTimer.timerLabel.place(
                    relx = 0.65,
                    rely = 0.83,
                    anchor = N
                ),
                main.display[4].extraTimer.start()
            ]
        )
        self.extraTime.place(
            relx = 0.5,
            rely = 0.2,
            anchor = N
        )

        #SKIP BUTTON
        self.skipButton = Button(
            self.mainFrame,
            text = "SKIP PROBLEM",
            font = ("Gotham", 16, "bold"),
            bg = TC2022_red[normal],
            fg = "black",
            command = lambda:[
                main.display[4].next(main.root, teamA, teamB, teamC, args=2),
                main.display[4].next(main.root, teamA, teamB, teamC, args=2)
            ]
        )
        self.skipButton.place(
            relx = 0.5,
            rely = 0.3,
            anchor = N
        )

        #ENTRY GAMBLE
        self.gambleEntry = Entry(
            self.mainFrame,
            bg = "white",
            fg = "black",
            justify = LEFT,
            font = ("Gotham", 16, "bold")
        )
        self.gambleEntry.place(
            relwidth = 0.9,
            relx = 0.5,
            rely = 0.4,
            anchor = N
        )

        #TRUE FALSE BUTTON
        self.trueButton = Button(
            self.mainFrame,
            height = 1,
            width = 10,
            text = "O",
            font = ("Gotham", 16, "bold"),
            bg = TC2022_color2[light],
            fg = "black",
            command = lambda:[
                main.display[4].next(main.root, teamA, teamB, teamC, args=1, score=int(self.gambleEntry.get())),
                self.gambleEntry.delete(0, END)
            ]
        )
        self.trueButton.place(
            relx = 0.25,
            rely = 0.5,
            anchor = N
        )

        self.falseButton = Button(
            self.mainFrame,
            height = 1,
            width = 10,
            text = "X",
            font = ("Gotham", 16, "bold"),
            bg = TC2022_red[light],
            fg = "black",
            command = lambda:[
                main.display[4].next(main.root, teamA, teamB, teamC, args=0, score=int(self.gambleEntry.get())),
                self.gambleEntry.delete(0, END)
            ]
        )
        self.falseButton.place(
            relx = 0.75,
            rely = 0.5,
            anchor = N
        )