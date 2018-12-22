import Tester
import csv
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
    linedifficulty = typetester.calculateLineComplexity(line, longeststrings, linespecialchars)
    lineswithpoints[line] = linedifficulty

# with open("Difficulties.csv", 'w') as difficultycsv:
#     writer = csv.writer(difficultycsv)
#     writer.writerows(lineswithpoints.items())
#
# with open("test.json", 'w') as outfile:
#     outfile.write(json.dumps(lineswithpoints))

with open("AText.txt", 'w') as outfile:
    outfile.write(typetester.strip_unicode("Text.txt"))
    print "Unicode stripped"
