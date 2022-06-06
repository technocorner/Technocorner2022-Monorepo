class team:

    def __init__(self, name, score) -> None:
        self.name = name
        self.score = score
        self.bingoData = []

    def addScore(self, score) -> None:
        self.score += score

    def subScore(self, score) -> None:
        self.score -= score

    def updateTeamData(self, name, score) -> None:
        self.name = name
        self.score = score