from tkinter import *
import threading



class mainDisplay:


    def __init__(self) -> None:
        
        #VARIABLES
        self.teamAState = False
        self.teamBState = False
        self.teamCState = False
        self.closeApp = False

        #WINDOWS SETUP
        self.root = Tk()
        self.root.geometry("640x200")
        self.root.resizable(False, False)
        self.root.title(string="Final Button Try")
        self.root.configure(background="#0d261f")

        #TEAM LABEL
        self.teamList = ['A', 'B', 'C']
        self.teamLabel = [Label(self.root) for i in range(3)]
        for i in range(3):
            self.teamLabel[i].configure(
                text = self.teamList[i],
                bg = "white",
                fg = "black",
                font = ("Calibri", 32)
            )
            self.teamLabel[i].place(
                relheight = 0.7,
                relwidth = 0.28,
                relx = (2*i + 1)/6,
                rely = 0.5,
                anchor = CENTER
            )

        #THREAD
        self.stateThread = threading.Thread(target = self.stateCheckThread)


    #THREAD FUNCTION
    def stateCheckThread(self) -> None:
        while True:

            while not(self.teamAState or self.teamBState or self.teamCState):
                if self.closeApp:
                    return None
            
            while self.teamAState or self.teamBState or self.teamCState:
                
                if self.teamAState:
                    self.teamLabel[0].configure(
                        bg = "blue",
                        fg = "white"
                    )
                    
                elif self.teamBState:
                    self.teamLabel[1].configure(
                        bg = "blue",
                        fg = "white"
                    )
                
                elif self.teamCState:
                    self.teamLabel[2].configure(
                        bg = "blue",
                        fg = "white"
                    )

                while self.teamAState or self.teamBState or self.teamCState:
                    if self.closeApp:
                        return None


    #RESET
    def resetState(self) -> None:
        for x in self.teamLabel:
            x.configure(
                bg = "white",
                fg = "black",
            )
        self.teamAState = False
        self.teamBState = False
        self.teamCState = False


    #LAUNCH
    def launch(self) -> None:
        self.stateThread.start()
        self.root.mainloop()


    #EXIT APP
    def exitApp(self, control) -> None:
        self.closeApp = True
        self.stateThread.join()
        self.root.destroy()
        control.root.destroy()




class controlDisplay:


    def __init__(self, main) -> None:
        
        #WINDOWS SETUP
        self.root = Tk()
        self.root.geometry("200x200")
        self.root.resizable(False, False)
        self.root.title(string="Control Log")
        self.root.configure(background="#0d261f")

        #RESET BUTTON
        self.resetButton = Button(self.root)
        self.resetButton.configure(
            text = "RESET",
            font = ("Calibri", 30, "bold"),
            bg = "red",
            fg = "white",
            command = main.resetState
        )
        self.resetButton.place(
            relheight = 0.4,
            relwidth = 0.9,
            relx = 0.05,
            rely = 0.25,
            anchor = W
        )

        #EXIT APP BUTTON
        self.exitButton = Button(self.root)
        self.exitButton.configure(
            text = "EXIT",
            font = ("Calibri", 30, "bold"),
            bg = "red",
            fg = "white",
            command = lambda:[main.exitApp(self)]
        )
        self.exitButton.place(
            relheight = 0.4,
            relwidth = 0.9,
            relx = 0.05,
            rely = 0.75,
            anchor = W
        )


    def launch(self) -> None:
        self.root.mainloop()



#LOOP
main = mainDisplay()
control = controlDisplay(main)
main.launch()
control.launch()