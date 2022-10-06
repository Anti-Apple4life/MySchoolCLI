import { exec, execSync } from "child_process";
import { exit } from "process";
import promptbuilder from "prompt-sync";
import { GetSchedule } from "./schedule.js";
const prompt = promptbuilder();
const currentCommandList = `help: show this help message
exit [program/querymode]: exit either the program or querymode.`;
export async function queryMode(token: string) {
  while (true) {
    let res = prompt("querymode> ")?.toLowerCase();
    if (res === null || res === undefined) {
      return;
    }
    switch (res) {
      case res.match(/^exit|^quit/)?.input:
        const shouldReturn = handleExit(res.split(" "));
        if (shouldReturn === true) {
          return;
        }
        break;
      case res.match(/^help/)?.input:
        console.log(currentCommandList);
        break;
      case res.match(/^!/)?.input:
        try {
          let stdout = execSync(res.replace("!", ""), { encoding: "utf-8" });
          console.log(stdout);
        } catch (error) {
          console.log("There was an error running this command.");
        }
        break;
      case res.match(/^get|^view/)?.input:
        await handleGet(res.split(" "), token);
        break;

      default:
        console.error("This is not implemented yet.");
        break;
    }
  }
}
function handleExit(splitExit: string[]): boolean {
  let returnvalue = false;
  switch (splitExit[1]) {
    case "program":
      exit(0);
      break;
    case "querymode" || "query":
      returnvalue = true;
    default:
      returnvalue = true;
      break;
  }
  return returnvalue;
}
async function handleGet(splitGet: string[], token: string) {
  switch (splitGet[1]) {
    case "schedule":
      switch (splitGet[2]) {
        case "for" || "of":
          switch (splitGet[3]) {
            case "today":
              console.table(await GetSchedule(token, new Date()));
              break;
            case "tomorrow":
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              console.table(await GetSchedule(token, tomorrow));
              break;
              case "yesterday":;
              const yesterday= new Date();
              yesterday.setDate(yesterday.getDate() + 1);
              console.table(await GetSchedule(token, yesterday));
              break;
            default:
                console.table(await GetSchedule(token, new Date(splitGet[3])));
              break;
          }
          break;

        default:
          console.table(await GetSchedule(token, new Date()));
      }
      break;
    case "assignments":
      console.log("This is not implemented yet.");
      break;
    default:
      console.log(
        "Incorrect usage of the " +
          splitGet[0] +
          " command. Run 'help' for correct usage"
      );
      break;
  }
}
