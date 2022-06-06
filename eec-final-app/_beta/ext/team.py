class team:

    def __init__(it) -> None:
        it.name = "unknown"
        it.score = 0
        it.bingoCorrectList = []
        it.turn = False

    def setScore(it, score) -> None:
        it.score = score

    def setName(it, name) -> None:
        it.name = name

    def addScore(it, score) -> None:
        it.score += score

    def subScore(it, score) -> None:
        it.score -= score

    def addBingoList(it, no) -> None:
        it.bingoCorrectList.append(int(no))