async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/employees');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    //console.log(data);
    consecutiveDays(data);
    shiftGaps(data);
    fourteenHours(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

//a) who has worked for 7 consecutive days.
function consecutiveDays(employees) {
  const consecutiveDaysThreshold = 7;

  employees.forEach(employee => {
    const { "Employee Name": name, "Position ID": position, "Time": startTime } = employee;
    const workedConsecutiveDays = checkConsecutiveDays(employee, consecutiveDaysThreshold);

    if (workedConsecutiveDays) {
      console.log(`Name: ${name}, Position: ${position}`);
    }
  });
}

function checkConsecutiveDays(employee, consecutiveDaysThreshold) {
  const { "Time": startTime, "Pay Cycle Start Date": payCycleStartDate } = employee;

  const startDate = new Date(payCycleStartDate);
  const currentDate = new Date(startTime);

  const timeDiff = Math.abs(currentDate.getTime() - startDate.getTime());
  const daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDifference >= consecutiveDaysThreshold;
}


//b) who have less than 10 hours of time between shifts but greater than 1 hour.
function shiftGaps(employees) {
  const minGapThreshold = 1; // minimum gap in hours
  const maxGapThreshold = 10; // maximum gap in hours

  employees.forEach((employee, index, array) => {
    if (index < array.length - 1) {
      const { "Employee Name": currentName, "Position ID": currentPosition, "Time Out": currentTimeOut } = employee;
      const { "Employee Name": nextName, "Time": nextStartTime } = array[index + 1];

      const gapHours = calcTimeGap(currentTimeOut, nextStartTime);

      if (gapHours > minGapThreshold && gapHours < maxGapThreshold) {
        console.log(`Name: ${currentName}, Position: ${currentPosition}`);
      }
    }
  });
}

function calcTimeGap(timeOut, nextStartTime) {
  const timeOutDate = new Date(timeOut);
  const nextStartDate = new Date(nextStartTime);

  const timeDiff = nextStartDate.getTime() - timeOutDate.getTime();
  const gapHours = timeDiff / (1000 * 3600);

  return gapHours;
}

//c) Who has worked for more than 14 hours in a single shift
function fourteenHours(employees) {
  const excessiveHoursThreshold = 14;

  employees.forEach(employee => {
    const { "Employee Name": name, "Position ID": position, "Timecard Hours (as Time)": timecardHours } = employee;
    const workedHours = calcTotalHours(timecardHours);

    if (workedHours > excessiveHoursThreshold) {
      console.log(`Name: ${name}, Position: ${position}`);
    }
  });
}

function calcTotalHours(timecardHours) {
  if(typeof timecardHours === 'string'){  //checking if the variable is a string before calling split
  const [hours, minutes] = timecardHours.split(':');
  const totalHours = parseInt(hours, 10) + parseInt(minutes, 10) / 60;

  return totalHours;
  }
}

fetchData();

