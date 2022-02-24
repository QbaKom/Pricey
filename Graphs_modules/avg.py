import matplotlib.pyplot as plt

with open("Covid.txt","r")as file:
    dane = file.readline().strip().split("\t")
    data = dict()
    while len(dane) > 0:
        dane = file.readline().split()
        month = dane[2] + "." + dane[3]
        cases = int(dane[4])
        if month in data:
            data[month] += cases
        else:
            data[month] = cases
    x = list(data.keys())
    y = list(data.values())
    print(x)
    print(y)