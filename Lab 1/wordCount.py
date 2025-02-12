userWord = input("Enter the word you want to search for: ")
keyWord = userWord.upper()

with open('PythonSummary.txt', 'r') as file:
    content = file.read()
content = content.upper()

count = content.count(keyWord)

if count == 0:
    print("The requested word ", userWord, "was not found in the file")

else:
    print(userWord, "appears", count, "times within the file.")