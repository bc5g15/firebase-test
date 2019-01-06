import Tester
import csv
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

difficultycsv = open("Difficulties.csv", 'w')
writer = csv.writer(difficultycsv)
#print(lineswithpoints.items())
#writer.writerows(lineswithpoints.items())
for key, value in lineswithpoints.items():
    print(key + "," + str(value) + "/n")
    writer.writerow([key, value])

    
