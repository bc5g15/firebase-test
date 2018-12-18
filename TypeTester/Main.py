import Tester
import json
typetester = Tester.Tester()
lineswithpoints = {}
longeststrings = {}
linespecialchars = {}
text = typetester.retrieveText()
longestwords = typetester.longestWords(text, longeststrings)
lineratings = typetester.rateSpecialChars(text, linespecialchars)
for line in text:
    line.rstrip("\n")
    linedifficulty = typetester.calculateLineComplexity(text.index(line), longeststrings, linespecialchars)
    lineswithpoints[line] = linedifficulty

with open("Difficulties.txt", 'w') as difficultyjson:
    json.dump(lineswithpoints, difficultyjson)

    
