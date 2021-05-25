# skript-parser
A light-weight javascript library for parsing skript indentations in to an object to be easily read by a program.

[![npm](https://img.shields.io/npm/dt/cubed-api.svg?style=for-the-badge)](https://npmjs.com/package/cubed-api)

# Installing
To install skript-parser first make sure you have npm installed then run `npm i skript-parser`.

# Example Usage
Start with skript file:
```
on break:
    cancel event
    
on place
    cancel event

command /test:
  trigger:
    if player is on the ground:
      send "on ground"
    broadcast "test"
```
