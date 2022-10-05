export {};
import { GetSchedule } from "./schedule.js";
import { CheckTokenValid } from "./checktokenvalid.js";
import prompts from "prompts";
import { AssignmentType, GetAssignments } from "./assignments.js";
import fs from 'fs/promises';

(async () => {
    let token: string;
    try {
        token = (await fs.readFile("token.secret")).toString();
        if (await CheckTokenValid(token) === false)
        {
            throw new Error("You need to refresh your token.")
        }
    } catch (error) {
        const initaltoken = await prompts({
            type: "text",
            name: "token",
            message: "Please enter your ShipleyNet token to use RevNet.",
          });
          if (await CheckTokenValid(initaltoken.token) === false) {
            throw new Error("This token is invalid");
          }
          token = initaltoken.token
          const savetoken = await prompts({
            type: "confirm",
            name: "savetofile",
            message:
              "Would you like to save this token for later use? It should work for about 3 hours",
          });
          if (savetoken.savetofile === true) {
            await fs.writeFile("token.secret", token)
          }
    }
    let running = true
while (running) {
const operation = await prompts({
    type: 'select',
    name: 'operation',
    message: 'What would you like to do?',
    choices: [
      { title: 'View the ShipleyNet Schedule', value: 'schedule' },
      { title: 'View ShipleyNet Assignments', value: 'assignments' },
      { title: 'Exit', value: 'exit' }
    ],
  })
  switch (operation.operation) {
    case "schedule":
      const dateSelect = await prompts({
        type: 'date',
        name: 'value',
        message: 'What date would you like the schedule for?',
        initial: new Date(),
        mask: "M/D/YYYY"
      })
        console.table(await GetSchedule(token, dateSelect.value));
        break;
    case "assignments":
      const [viewType, startDate, stopDate] = await GetAssignmentSelectionInfo();
      console.log(await GetAssignments(token, viewType, startDate, stopDate))
        break;
    case "exit":
        running = false;
        break;
    default:
        break;
  }
  // @ts-ignore
}
})();
async function GetAssignmentSelectionInfo()
{
  let type;
  let hasSelectedType: boolean = false;
  let hasSelectedDates = false;

    const typeSelect = await prompts({
      type: 'select',
      name: 'type',
      message: 'How would you like to view your assignments?',
      choices: [
        { title: 'Assigned', value: 'assigned' },
        { title: 'Active', value: 'active' },
        { title: 'Due', value: 'due' }
      ],
    })
  switch (typeSelect.type) {
    case "assigned":
      type = AssignmentType.Assigned;
      break;
    case "active":
      type = AssignmentType.Active;
      break;
    case "due":
      type = AssignmentType.Due;
      break;
  
    default:
      break;
  
  }
    const startDateSelect = await prompts({
      type: 'date',
      name: 'value',
      message: 'What date would you like to start listing assignments from?',
      initial: new Date(),
      mask: "M/D/YYYY"
    })
    const endDateSelect = await prompts({
      type: 'date',
      name: 'value',
      message: 'What date would you like to stop listing assignments from?',
      initial: startDateSelect.value,
      mask: "M/D/YYYY"
    })
    return [type, startDateSelect.value, endDateSelect.value]
}
