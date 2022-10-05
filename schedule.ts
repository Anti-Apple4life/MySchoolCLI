export async function GetSchedule(cookie:string, date: Date, verbose:boolean = false): Promise<object> {
    const data = await fetch(`https://shipleyschool.myschoolapp.com/api/schedule/MyDayCalendarStudentList/?scheduleDate=${date.toLocaleDateString('en-US').replaceAll('/', '%2F')}&personaId=2`, {
    "headers": {
        "Cookie": `t=${cookie}`,
    }
});
let returnvalue: any;
if (verbose === true)
{
    returnvalue = await data.json();
} else
{
    returnvalue = [];
    for (let period of (await data.json()) as any[]) {
        returnvalue.push({
            "Course Title": period.CourseTitle,
            "Room Number": period.RoomNumber,
            "Calendar Date": period.CalendarDate,
            "Start Time": period.StartTime,
            "End Time": period.EndTime,
            "Block": period.Block,
            
        })
    }
    
}
if (returnvalue.length === 0) {
    returnvalue = "Congratulations! You do not have school today!"
}
return returnvalue;

}