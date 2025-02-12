
file = open('classesInput.txt')
content = file.readlines()
length = len(content)


class Course:
    def __init__(self, major, number, name, credit, days, timeStart, timeEnd, average):
        self.major = major
        self.number = number
        self.name = name
        self.credit = credit
        self.days = days
        self.timeStart = timeStart
        self.timeEnd = timeEnd
        self.average = average

    def format_return (self, courseNum):
        return  f"COURSE {courseNum}: {self.major}{self.number}: {self.name}\n" \
                f"Number of Credits: {self.credit}\n" \
                f"Days of Lectures: {self.days}\n" \
                f"Lecture Time: {self.timeStart} - {self.timeEnd}\n" \
                f"Stat: on average, students get {self.average} in this course\n\n"


def read_courses():
    counter = 1
    allCourses = []

    for i in range(1, length):
        line = content[i].strip()   #strips current text line from file to be selected item

        if counter == 1:
            # major = content[i]
            major = line
        if counter == 2:
            # number = content[i]
            number = line
        if counter == 3:
            # name = content[i]
            name = line
        if counter == 4:
            # credit = content[i]
            credit = line
        if counter == 5:
            # days = content[i]
            days = line
        if counter == 6:
            # timeStart = content[i]
            timeStart = line
        if counter == 7:
            # timeEnd = content[i]
            timeEnd = line
        if counter == 8:
            # average = content[i]
            average = line

            course = Course(major, number, name, credit, days, timeStart, timeEnd, average)
            allCourses.append(course)

            counter = 1

        else:
            counter = counter + 1


    with open('ClassSchedules.txt', 'w') as file:
        for j, course in enumerate(allCourses):         # enumerate to iterate thru all courses
            file.write(course.format_return(j + 1))

read_courses()