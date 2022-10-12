import { execSync } from "child_process";
import { exit } from "process";
import promptbuilder from "prompt-sync";
import { GetSchedule } from "./schedule.js";
const prompt = promptbuilder();
const currentCommandList = `help: show this help message
get SCHEDULE|ASSIGNMENTS [for/of {today/tomorrow/yesterday/DATE}]: view selelected item.   
view: alias of 'get'
exit [program/querymode]: exit either the program or querymode.
verbose [on/off]: set the verbose option.`;
export async function queryMode(token: string, url:string) {
  let verbose: boolean = false;
  while (true) {
    let res = prompt("querymode> ")?.toLowerCase();
    if (res === null || res === undefined) {
      return;
    }
    switch (res) {
      case res.match(/^exit|^quit/)?.input:
        const shouldReturn = handleExit(res.split(" "));
        if (shouldReturn) {
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
        await handleGet(res.split(" "), token, url, verbose);
        break;
      case res.match(/^verbose/)?.input:
        const splitArgument: string[] = res.split(' ');
        switch (splitArgument[1]) {
          case "true":
            verbose = true;
            console.log(`Verbose: ${verbose}`);
            break;
          case "false":
            verbose = false;
            console.log(`Verbose: ${verbose}`);
            break;
          default:
            console.log(`Verbose: ${verbose}`);
            break;
        }
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
      break;
    default:
      returnvalue = true;
      break;
  }
  return returnvalue;
}
async function handleGet(splitGet: string[], token: string, url:string, verbose:boolean) {
  const print = (item: any) => {
    if (verbose)
    {
      console.log(item);
    } else if (!verbose)
    {
      console.table(item);
    }
  };
  switch (splitGet[1]) {
    case "schedule":
      switch (splitGet[2]) {
        case "for" || "of":
          switch (splitGet[3]) {
            case "today":
              print(await GetSchedule(token, url, new Date(), verbose));
              break;
            case "tomorrow":
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              print(await GetSchedule(token, url, tomorrow, verbose));
              break;
              case "yesterday":
              const yesterday= new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              print(await GetSchedule(token, url, yesterday, verbose));
              break;
            default:
                print(await GetSchedule(token, url, new Date(splitGet[3]), verbose));
              break;
          }
          break;

        default:
          print(await GetSchedule(token, url, new Date(), verbose));
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
