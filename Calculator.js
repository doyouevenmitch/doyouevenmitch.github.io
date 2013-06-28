var calculator = (function() {
    var pub = {};
    var current = 0;                //variable to contain the running total of the calculations
    var memory = 0;                 //variable to contain values that are saved to memory
    var reset = true;               //variable to indicate that the calculator has been reset (ie. the screen and current variable are reset)
    var operatorSelected = false;   //variable to indicate whether an arithmetic operator has been selected by the user
    var previousOperator = "";      //variable to contain the previous operator entered by the user in the current set of calculations
    var cleared = false;            //variable to indicate that the screen has been cleared, but the calculator has not necessarily been reset (ie. current still holds a value)
    var screen = document.getElementById("screen");     //the calculator screen textbox

    /*  a function that is called on document load to insert an onclick method into each button element
    of the document. When a button is clicked, its class is analysed to determine what the next course
    of action should be. 
    */
    pub.start = function() {
        var buttons = document.getElementsByTagName('button');
        [].slice.call(buttons).forEach(function (button) {          //used to convert the nodelist into an array
            button.onclick = function() {
                switch (button.className) {
                    case "memory":
                        updateMemory(button);
                        break;
                    case "operator":
                        if (!reset && !cleared)             //ensures that the screen hasn't been cleared before processing the operator
                            processOperator(button);
                        break;
                    case "number":                      //sets the reset and cleared values to false because the screen is occupied by a number
                        reset = false;                  
                        cleared = false;
                        processNumber(button);
                        updateClearButton(button);      //sets the clear button to read "c" instead of "ac"
                        break;
                    case "clear":
                        clear();
                        updateClearButton(button);      //resets the clear button to read "ac"
                        break;
                    case "invert":
                        updateScreen(parseFloat(screen.value) * -1);
                        break;
                }
            }   
        });
    }

    /*  a function that is used to update the memory variable. Takes the memory button element as a parameter
        and then uses a switch statement to determine the appropriate action.
    */
    function updateMemory(memoryCommand) {
        switch (memoryCommand.innerHTML) {
            case "mc":
                memory = 0;
                break;
            case "m+":
                memory += parseFloat(screen.value);
                break;
            case "m-":
                memory -= parseFloat(screen.value);
                break;
            case "mr":
                updateScreen(memory);
                break;
        }
    }

    /*  a function to process operators and manipulate the calculator elements accordingly. Takes the operator button
        element as a parameter. The first time an operator button is clicked, the current variable is not manipulated
        using the operator (it only takes on the current screen value). The operator is then stored, and used when
        an operator button is pushed for the second time to update the running total (current) and print the resultant
        value to the screen.
    */
    function processOperator(operator) {
        var screenVal = parseFloat(screen.value);
        if (previousOperator != "" && !operatorSelected) {
            switch (previousOperator) {
                case "+":
                    current += screenVal;
                    break;
                case "-":
                    current -= screenVal;
                    break;
                case "x":
                    current *= screenVal;
                    break;
                case "÷":
                    current /= screenVal;
                    break;
            }
        }
        else {
            current = screenVal;
        }
        updateScreen(current);
        previousOperator = operator.innerHTML;
        if (operator.innerHTML != "=")             //equals is an exception case because if the clear button is pushed after equals, the calculator gets reset
            operatorSelected = true;
    }

    /*  a function that is executed whenever a number button is pushed, and takes the number button element as a parameter.
    */
    function processNumber(number) {
        if (screen.value == "0" && number.innerHTML != ".")     //if an actual number is pressed, the screen is cleared (to remove the leading zero). If the 
            updateScreen("");                                   //decimal point was pressed, the zero needs to remain
        if (operatorSelected) {                                 //if an operator was selected, the next number will overwrite whatever is on the screen currently
            updateScreen(number.innerHTML);
            operatorSelected = false;
        }
        else if (getLength(screen.value) < 10) 
            updateScreen(screen.value + number.innerHTML);
    }

    /* a function to return the number of digits on the screen (not including a decimal place).
    */
    function getLength(value) {
            if (value.match("\\.") != null)
                return value.length -1;
            else
                return value.length;
        return count;
    }

    /*  a function to print a value to the screen. It takes the value as a parameter (either a String or a Number). If
        the value is greater than 10 digits, an error message is printed instead.
    */
    function updateScreen(value) {
        if (getLength(value.toString()) <= 10)
            screen.value = value;
        else
            screen.value = "computer says no";
    }

    /*  a function to clear the screen, which also resets the calculator if necessary.
    */
    function clear() {
        updateScreen(0);
        if (cleared || previousOperator == "=")
            resetCalculator();
        else
            cleared = true;
    }

    /*  a function to reset the calculator to its original state.
    */
    function resetCalculator() {
            current = 0;
            cleared = false;
            reset = true;
            previousOperator = "";
            operatorSelected = false;
    }

    /*  a function to update the text inside the clear button. It takes a button element as a parameter. If the button
        is a number the value gets set "c", if it's the clear button it gets set to "ac".
    */
    function updateClearButton(button) {
        var clear = document.getElementsByClassName("clear").item(0);
        if (button.className == "clear")
            clear.innerHTML = "ac";
        else 
            clear.innerHTML = "c";
    }

return pub;
}());