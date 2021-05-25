# skript-parser
A light-weight javascript library for parsing skript indentations in to an object to be easily read by a program.

[![npm](https://img.shields.io/npm/dt/skript-parser.svg?style=for-the-badge)](https://npmjs.com/package/skript-parser)

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
Run javascript (nodejs) code:
```
const parse = require('skript-parser');
const fs = require('fs');

const file = fs.readFileSync('./myskript.sk').toString();

const parsed = parse(file);

fs.writeFileSync('./output.json', JSON.stringify(parsed));
```
The output file should then show the following:
```
{
    "errors": [
        {
            "error": "A missing colon was found at the end of line 4",
            "line": 4,
            "content": "on place"
        }
    ],
    "lines": [
        {
            "line": 1,
            "content": "on break:",
            "children": [
                {
                    "line": 2,
                    "content": "cancel event"
                }
            ]
        },
        {
            "line": 7,
            "content": "command /test:",
            "children": [
                {
                    "line": 8,
                    "content": "trigger:",
                    "children": [
                        {
                            "line": 9,
                            "content": "if player is on the ground:",
                            "children": [
                                {
                                    "line": 10,
                                    "content": "send \"on ground\""
                                }
                            ]
                        },
                        {
                            "line": 11,
                            "content": "broadcast \"test\""
                        }
                    ]
                }
            ]
        }
    ]
}
```

PLEASE NOTE: This package only parses indentations and not other errors in skript code