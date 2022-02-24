from typing import Literal
import matplotlib.pyplot as plt
from numpy import spacing

with open("test.txt", "r")as file:
    line = file.readline()
    data = dict()
    for line in file:
        line = line.strip().split()
        year = line[0]
        val = int(float(line[2]))
        if year in data:
            data[year] += val
        else:
            data[year] = val
    x = list(data.keys())
    y = list(data.values())

plt.plot(x,y)
plt.title('Test')
plt.xlabel('rok')
plt.ylabel('kwota')
plt.show()
plt.autoscale(enable=True, axis = Literal['both','x','y'])