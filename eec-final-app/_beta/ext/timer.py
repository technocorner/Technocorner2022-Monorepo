import threading, time
from tkinter import *
from assets.collor_pallete import *

class timer:

    def __init__(it, root, fontsize, mode, hour='00', minute='00', second='00') -> None:   
        it.size = int(fontsize)
        it.hour = str(hour)
        it.minute = str(minute)
        it.second = str(second)
        it.countStatus = False
        if mode == "HMS":
            #NOT USED YET
            pass
        elif mode == "MS":
            it.timerLabel = Label(root, text=it.minute + " : " + it.second, bg=TC2022_color1[dark], fg=TC2022_white[normal], font=("Gotham", it.size))
        elif mode == "S":
            #NOT USED YET
            pass

    def count(it):
        while True:
            if it.countStatus:
                time.sleep(1)
                if(int(it.second) == 0):
                    if(int(it.minute) == 0):
                        break
                    elif(int(it.minute) <= 10):
                        it.minute = '0' + str(int(it.minute)-1)
                    else:
                        it.minute = str(int(it.minute)-1)
                    it.second = "59"
                elif(int(it.second) <= 10):
                    it.second = '0' + str(int(it.second)-1)
                else:
                    it.second = str(int(it.second)-1)
                it.timerLabel.configure(text=it.minute + " : " + it.second)

    def start(it):
        it.countStatus = True
        it.thread = threading.Thread(target=it.count)
        it.thread.start()

    def stop(it):
        it.countStatus = False
        it.thread.join()