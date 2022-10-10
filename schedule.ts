export async function GetSchedule(cookie:string, date: Date, verbose:boolean = false): Promise<object> {
    const data = await fetch(`https://shipleyschool.myschoolapp.com/api/schedule/MyDayCalendarStudentList/?scheduleDate=${date.toLocaleDateString('en-US').replaceAll('/', '%2F')}&personaId=2`, {
    "headers": {
        "Cookie": `t=${cookie}`,
    }
});
let returnvalue: any;
if (verbose)
{
    returnvalue = await data.json();
} else
{
    returnvalue = [];
    for (let period of (await data.json()) as any[]) {
        returnvalue.push({
            "Course Title": period.CourseTitle || "N/A",
            "Room Number": period.RoomNumber || "N/A",
            "Start Time": new Date(period.StartTime).toLocaleTimeString(Intl.DateTimeFormat().resolvedOptions().locale, {
                timeStyle: "short"
            }) || "N/A",
            "End Time": new Date(period.EndTime).toLocaleTimeString(Intl.DateTimeFormat().resolvedOptions().locale, {
                timeStyle: "short"
            }) || "N/A",
            "Block": period.Block || "N/A",
            
        })
    }
    
}
if (returnvalue.length === 0) {
    returnvalue = "Congratulations! You do not have school today!"
}
return returnvalue;

}