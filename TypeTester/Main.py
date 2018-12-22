import Tester
import csv
import json

typetester = Tester.Tester()
lineswithpoints = {}
longeststrings = {}
linespecialchars = {}
text = typetester.retrieveText()
text = typetester.addMarkers(text)
text = text.replace("\n", " ")
lines = text.split("<>")
longestwords = typetester.longestWords(lines, longeststrings)
lineratings = typetester.rateSpecialChars(lines, linespecialchars)
for line in lines:
    line.rstrip("\n")
    linedifficulty = typetester.calculateLineComplexity(line, longeststrings, linespecialchars)
    lineswithpoints[line] = linedifficulty

with open("Difficulties.json", 'w') as outfile:
    outfile.write(json.dumps(lineswithpoints))
