sentence = input(" Enter the sentence I need to write lines for: " )
amount = input("How many times?: ")
amount = int(amount)

finished = 0
with open('CompletedPunishment.txt', 'w') as file:
    while finished != amount:
        file.write(sentence)
        file.write("\n")

        finished = finished + 1

