import Tester
import csv
import json

typetester = Tester.Tester()
lineswithpoints = {}
longeststrings = {}
linespecialchars = {}
outputdictlist = []
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
    for item in lineswithpoints.items():
        outputdict = {} #Creates a new dictionary for each tuple because in the test file there is a dictionary for each line and its difficulty
        outputdict["text"] = item[0] #Stores the line under the "text" key ready for uploading to the database
        outputdict["difficulty"] = item[1] #Stores the line's difficulty under the "difficulty" key ready for uploading to the database
        outputdictlist.append(outputdict) #Creates a list of text-difficulty dictionaries which it saves to JSON    
    json.dump(outputdictlist, outfile)
