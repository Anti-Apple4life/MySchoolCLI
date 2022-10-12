export {};
import { GetSchedule } from "./schedule.js";
import { CheckTokenValid } from "./checktokenvalid.js";
import prompts from "prompts";
import { AssignmentType, GetAssignments } from "./assignments.js";
import fs from 'fs/promises';
import { existsSync as fileExists } from "fs";
import { queryMode } from "./querymode.js";
import { argv as args } from "process";
import { config } from "./config.js";

(async () => {
  let cfg: config = new config();
    if (!fileExists("data.json"))
    {
      const url = await prompts({
        type: 'text',
        name: 'url',
        message: 'Please enter your MySchoolApp URL (eg: awesomeschool.myschoolapp.com)',
      })
      const token = await prompts({
        type: 'text',
        name: 'token',
        message: 'Please enter your MySchoolApp token',
      })
      if (!await CheckTokenValid(token.token))
        {
            throw new Error("This token is invalid.")
        }
      cfg = new config(token.token, url.url)
      await fs.writeFile("data.json", JSON.stringify(cfg))
    } else
    {
      let config: config = JSON.parse((await fs.readFile("data.json")).toString())
        if (!await CheckTokenValid(config.token))
        {
          const token = await prompts({
            type: 'text',
            name: 'token',
            message: 'Please enter your MySchoolApp token',
          })
          if (!await CheckTokenValid(token.token)) {
            throw new Error("This token is invalid.")
          }
          config.token = token.token;
          cfg = config;
          await fs.writeFile("data.json", JSON.stringify(config))
        }
    }
    let running = true
    if (args.includes("-q" || args.includes("--query")))
    await queryMode(cfg.token, cfg.url);
while (running) {
const operation = await prompts({
    type: 'select',
    name: 'operation',
    message: 'What would you like to do?',
    choices: [
      { title: 'View Schedule', value: 'schedule' },
      { title: 'View Assignments', value: 'assignments' },
      { title: 'Enter Query Mode', value: 'query' },
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
        console.table(await GetSchedule(cfg.token, cfg.url, dateSelect.value));
        break;
    case "assignments":
      const [viewType, startDate, stopDate] = await GetAssignmentSelectionInfo();
      console.log(await GetAssignments(cfg.token, cfg.url, viewType, startDate, stopDate))
        break;
    case "exit":
        running = false;
        break;
    case "query":
      await queryMode(cfg.token, cfg.url);
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
