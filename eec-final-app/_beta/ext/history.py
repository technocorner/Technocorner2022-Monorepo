from datetime import datetime

class history:

    def __init__(it, filename) -> None:
        it.fileName = str(filename) + ".txt"
        it.textFile = open("ext/history/"+it.fileName, 'w')
        it.no = 1
    
    def write(it, msg) -> None:
        currentTime = str(datetime.now())
        it.textFile.write('[' + str(it.no) + ']' + '[' + currentTime + ']' + '\n')
        it.textFile.write(msg + "\n\n")
        it.no += 1
