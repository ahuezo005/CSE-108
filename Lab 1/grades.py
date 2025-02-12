import json

with open('grades.txt', 'r') as file:
    gradeInfo = json.load(file)
    # print(info)

def gradeD(gradeInfo):
    student = input("Please enter the student's full name: " ).strip()
    if student in gradeInfo:
        del gradeInfo[student]
        print(f"{student}'s grade was successfully deleted. \n")

def gradeC(gradeInfo):
        student = input("Please enter the student's full name: " ).strip()
        grade = input("Enter the student's current grade. ")
        grade = float(grade)

        if 0 <= grade <= 100:
            gradeInfo[student] = grade
            print(f"Grade for {student} created. Their current grade is {grade}.  \n")
        else:
            print("Given grade value is not possible.")

def gradeG(gradeInfo):
    student = input("Please enter the student's full name: " ).strip()
    if student in gradeInfo:
        print(f"{student}'s current grade is: {gradeInfo[student]} \n")
    else:
        print("The grade for the requested student was not found. \n")

def gradeE(gradeInfo):
    student = input("Please enter the student's name: " ).strip()
    if student in gradeInfo:
        grade = float(input("Enter their updated grade."))

        if 0 <= grade <= 100:
            gradeInfo[student] = grade
            print(f"Grade for {student} updated. Their current grade is {grade}.  \n")
        else:
            print("Given grade value is not possible. \n")

def gradeL(gradeInfo):
    if len(gradeInfo) == 0:
        print (len(gradeInfo))
        print("Nothing in system.")

    print("\nGrades:")
    for name, grade in gradeInfo.items():

        print(f"{name}: {grade}")
    print("\n")



def main():
    while True:
        print("Select an action to make from the options below:\n")
        print("(1) Request an existing student's grade.")
        print("(2) Create a new student's grade.")
        print("(3) Edit an exsisting student's grade.")
        print("(4) Show all exsisting grades.")
        print("(5) Delete an existing student's grade from the system.")
        print("(6) Stop program.\n")

        with open('grades.txt', 'w') as file:
            json.dump(gradeInfo, file, indent=2)

        option = input()
        option = int(option)
        if option == 1:
            gradeG(gradeInfo)
        elif option == 2:
            gradeC(gradeInfo)
        elif option == 3:
            gradeE(gradeInfo)
        elif option == 4:
            gradeL(gradeInfo)
        elif option == 5:
            gradeD(gradeInfo)
        elif option == 6:
            break
        else:
            option = print("Inputted number (",option,") is not an option, please select from the provided option numbers.")

    
if __name__ == "__main__":
    main()