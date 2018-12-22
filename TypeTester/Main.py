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
with open("test.json", 'w') as outfile:
    outfile.write(json.dumps(lineswithpoints))

# shortatext = typetester.strip_unicode("GText.txt")
# shortatext = open("GText.txt", 'r').read().replace('\n', ' ')
# marked_text = typetester.add_markers(shortatext)
# # print marked_text
# grammatical_lines = marked_text.split("<>")
# print grammatical_lines[1].strip()
#
# with open("AShortText.txt", 'w') as outfile:
#     outfile.write(grammatical_lines[1])
