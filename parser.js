module.exports = (skript) => {

    var parsed = {};
    parsed.errors = [];
    parsed.lines = [];

    /*
        Getting the lines of the skript individually in an array to make reading them easier
    */

    var lines = skript.split('\r').join('').split('\n');

    /*
        Defining the variables used
    */

    var n = 0;
    var indents = 0;
    var indentScheme = null;
    var indentStarter = false;
    var current;
    var failedEvent = false;

    /*
        Looping through the lines to parse them
    */

    for (line of lines) {

        n++;

        
        /*
            Skipping any empty lines so the parser only reads used lines
        */

        var regex = /^[ \n\r\t]*$/;

        var test = regex.test(line);

        if (test) continue;

        
        /*
            Checking if the line has any indentations or not (if not checks if it's an event)
        */

        if (!line.startsWith(' ') && !line.startsWith('	')) {
            if (line.trim().endsWith(':') || line.trim().startsWith('#')) {
                indents = 1;
                indentStarter = true;

                if (current) {
                    parsed.lines.push(current);
                }

                current = {};

                current.line = n;
                current.content = line.trim();
                if (!line.trim().startsWith('#')) {
                    current.children = [];
                    failedEvent = false;
                } else {
                    failedEvent = true;
                }
            }
            else {
                failedEvent = true;
                parsed.errors.push({ error: `A missing colon was found at the end of line ${n}`, line: n, content: line.trim() });
            }
        } else {
            if (!failedEvent) {
                if (indentStarter) {

                    /*
                        Finding the indentation scheme
                    */

                    var ch;
                    if (line.startsWith(' ')) {
                        ch = ' ';
                    } else if (line.startsWith('	')) {
                        ch = '	';
                    }

                    indentScheme = '';

                    for (let i = 0; i < line.length; i++) {
                        if (line.charAt(i) === ch) {
                            indentScheme += ch;
                        } else {
                            break;
                        }
                    }

                    indentStarter = false;
                }

                if (!indentScheme) {
                    parsed.errors.push({ error: `More indents than expected were found at line ${n}`, line: n, content: line.trim() });
                    continue;
                }

                /*
                    Finding how many indentations are used in the line
                */

                var indentAmount = 0;

                for (let i = 0; i < line.length; i++) {
                    if (line.charAt(i) === indentScheme.substring(0, 1)) {
                        indentAmount += 1 / indentScheme.length;
                    } else {
                        break;
                    }
                }

                /*
                    Checking if any indentations were registered - no indentations being registered will occur when they use the wrong scheme (e.g. tabs when spaces are used or vice versa)
                */

                if (!indentAmount) {
                    parsed.errors.push({ error: `An unexpected amount of indents were found at line ${n}`, line: n, content: line.trim() });
                    continue;
                }

                /*
                    Checking if the amount of indents is greater than the allowed amount
                */

                if (indentAmount > indents) {
                    parsed.errors.push({ error: `More indents than expected were found at line ${n}`, line: n, content: line.trim() });
                } else {

                    /*
                        Checking if the amount of indents is a whole a number - the amount will not be a whole number if they go up in the wrong amount, e.g. going up in 3 spaces when the scheme is up in 4 space
                    */

                    if (Number.isInteger(indentAmount)) {


                        /*
                            Checking if the line ends in ":" so could potentially have child lines
                        */

                        if (line.trim().endsWith(':') && !line.trim().startsWith('#')) {
                            indents++;
                            if (indentAmount === 1) {
                                current.children.push({ line: n, content: line.trim(), children: [] });
                            } else {

                                /*
                                    Finding the parent of the line
                               */

                                indentAmount -= 1;

                                var parent = current;

                                for (let i = 0; i < indentAmount; i++) {
                                    parent = parent.children[parent.children.length - 1]
                                }

                                parent.children.push({ line: n, content: line.trim(), children: [] })

                            }
                        } else {
                            indents = indentAmount;

                            if (indentAmount === 1) {
                                current.children.push({ line: n, content: line.trim() });
                            } else {

                                /*
                                    Finding the parent of the line
                               */

                                indentAmount -= 1;

                                var parent = current;

                                for (let i = 0; i < indentAmount; i++) {
                                    parent = parent.children[parent.children.length - 1]
                                }

                                parent.children.push({ line: n, content: line.trim() })
                            }
                        }
                    } else {
                        parsed.errors.push({ error: `An unexpected amount of indents were found at line ${n}`, line: n, content: line.trim() });
                    }
                }
            }
        }
    }

    if (current) {
        parsed.lines.push(current);
    }

    /*
        Returning the parsed object
    */

    return parsed;

    //replace(new RegExp('\n\n', 'g'), '\n');

}