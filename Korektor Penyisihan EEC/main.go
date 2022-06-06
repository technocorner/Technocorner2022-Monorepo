package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"sort"
	"strconv"
)

type Pair struct {
	Key   string
	Value int
}

type PairList []Pair

func (p PairList) Len() int           { return len(p) }
func (p PairList) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
func (p PairList) Less(i, j int) bool { return p[i].Value > p[j].Value }

func main() {
	args := os.Args[1:]

	if len(args[0]) == 0 {
		log.Fatalf("Error(0): %v\n", "Need argument[0] as path to participant's answer file folder")
	}
	if len(args[1]) == 0 {
		log.Fatalf("Error(0): %v\n", "Need argument[1] as path to solutions file")
	}

	solutionsAnswers, err := os.ReadFile(args[1])
	if err != nil {
		log.Fatalf("Error(3): %v\n", err)
	}
	if len(solutionsAnswers) == 0 {
		log.Fatalf("Error(4): %v\n", "File empty")
	}

	var solutions map[string]map[string]interface{}
	if err := json.Unmarshal(solutionsAnswers, &solutions); err != nil {
		log.Fatalf("Error(6): %v\n", err)
	}

	files, err := ioutil.ReadDir(args[0])
	if err != nil {
		log.Fatal(err)
	}

	scores := make(map[string]int)

	for _, f := range files {
		if !f.IsDir() {
			fmt.Printf("-------------\n\n")
			fmt.Printf("TIM ID: %s\n", f.Name())

			participantAnswers, err := os.ReadFile(fmt.Sprintf("%s/%s", args[0], f.Name()))
			if err != nil {
				log.Fatalf("Error(1): %v\n", err)
			}
			if len(participantAnswers) == 0 {
				log.Fatalf("Error(2): %v\n", "File empty")
			}

			var answer map[string]map[string]map[string]interface{}
			if err := json.Unmarshal(participantAnswers, &answer); err != nil {
				log.Fatalf("Error(5): %v\n", err)
			}

			totalCorrect := 0
			totalWrong := 0
			totalNotAnswered := 0
			for i := 0; i < 3; i++ {
				subject := strconv.Itoa(i)
				fmt.Printf("Subject: %s\n", solutions[subject]["title"])

				correct := 0
				wrong := 0
				notAnswered := 0
				for j := 1; j <= 40; j++ {
					number := strconv.Itoa(j)
					thisAnswer := answer[subject][number]["value"]
					thisSolution := solutions[subject][number].(map[string]interface{})["value"]

					if thisAnswer != nil {
						fmt.Printf("%d. User answer: %s     solution: %s\n", j, thisAnswer, thisSolution)

						if thisAnswer == thisSolution {
							correct++
						} else {
							wrong++
						}
					} else {
						notAnswered++
					}
				}
				fmt.Printf("\nCorrect: %d     Wrong: %d     Not answered: %d\n\n", correct, wrong, notAnswered)
				totalCorrect += correct
				totalWrong += wrong
				totalNotAnswered += notAnswered
			}

			fmt.Printf("\nTotal correct: %d     Total wrong: %d     Total not answered: %d\n\n", totalCorrect, totalWrong, totalNotAnswered)
			scores[f.Name()] = (totalCorrect * 4) - (totalWrong)
		}
	}

	p := make(PairList, len(scores))

	i := 0
	for k, v := range scores {
		p[i] = Pair{k, v}
		i++
	}

	sort.Sort(p)

	fmt.Println("Score order")
	for i, k := range p {
		fmt.Printf("%d. %v     %v\n", i+1, k.Key, k.Value)
	}
}
