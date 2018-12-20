
class Tester:

    specialchars = ["?", "!", ]
    text = []

    def retrieveText(self):
        textfile = open("Short Text.txt", "r")
        if textfile.mode == 'r':
            text = textfile.readlines()  #Produces a list of lines in the text
            print(len(text))
        return text;

    def longestWords(self, text, longeststrings):
        wordlengths = {}
        currentmax = 0
        currentmaxindex = 0
        counter = 0
        for line in text:
            words = line.split(" ")
            for string in words:
                wordlengths[string] = len(string) #Gets the length of each word in the line and stores it with the word

            for number in wordlengths.values():
                if number > currentmax:
                    currentmax = number
                    currentmaxindex = wordlengths.values().index(number)

            longeststring = wordlengths.keys()[currentmaxindex] #Finds the longest string in the line and stores it and its length in the longeststrings dictionary
            longeststrings[longeststring] = currentmax
            counter += 1
            wordlengths = {} #Empties wordlengths ready to work with the strings of the next line
            currentmax = 0
            currentmaxindex = 0

        #print(counter)
        print(len(longeststrings.keys()))
        return longeststrings

    def rateSpecialChars(self, text, linespecialchars):
        counter = 0
        for line in text:
            for string in line:
                for character in string:
                    if not character.isalnum():
                        counter += 1 #Looks at each character in each string of the line and adds 1 to the counter if it is non-alphanumeric
            linespecialchars[line] = counter #Assigns the value of the counter as the number of special characters in the line before setting it to 0 again for the next line
            counter = 0
        #print(len(linespecialchars.values()))
        return linespecialchars

    def calculateLineComplexity(self, sentencenumber, longeststrings, linespecialchars): #Calculates a score for a particular line by adding the length of its longest string to the number of special characters in it
        longeststringvalues = longeststrings.values()
        longestwordlength = longeststringvalues[sentencenumber]
        linespecialcharvalues = linespecialchars.values()
        #print("(" + str(sentencenumber) + ", " + str(len(longeststringvalues)) + ")")
        linerating = linespecialcharvalues[sentencenumber]
        return longestwordlength + linerating




