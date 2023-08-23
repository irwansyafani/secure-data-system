const fizzBuzzFunc = (maxNum = 15) => {
  [...new Array(maxNum).keys()].forEach((val) => {
    const number = val + 1;
    if (number % 5 === 0 && number % 3 === 0) {
      console.log("FizzBuzz");
    } else if (number % 5 === 0) {
      console.log("Buzz");
    } else if (number % 3 === 0) {
      console.log("Fizz");
    } else {
      console.log(number);
    }
  });
};

fizzBuzzFunc(15); // change the number
