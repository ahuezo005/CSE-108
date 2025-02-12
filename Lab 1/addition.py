floatingNums = []

while len(floatingNums) < 2:    #ensures 2 numbers will b added
    nums = input("Enter 2 or more numbers separated by a space: ")
    numsAll = nums.split(" ")
    floatingNums = [float(s) for s in numsAll]  

    if len(floatingNums) < 2:
        print(" Please enter more than 1 number to add")

total = sum(floatingNums)
print ( "Total: ", round(total, 2) )       #rounds to 2 decimals