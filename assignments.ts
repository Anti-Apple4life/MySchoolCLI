export async function GetAssignments(cookie:string, url:string, assignmentType: AssignmentType = AssignmentType.Active, startDate: Date, endDate: Date, verbose:boolean = false): Promise<object>
{
     const data = await fetch(`https://${url}/api/DataDirect/AssignmentCenterAssignments/?format=json&filter=${assignmentType}&dateStart=${startDate.toLocaleDateString('en-US').replaceAll('/', '%2F')}&dateEnd=${endDate.toLocaleDateString('en-US').replaceAll('/', '%2F')}&persona=2&statusList=&sectionList=`, {
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
    for (let assignment of (await data.json()) as any[]) {
        let status: string;
        switch (assignment.assignment_status) {
            case -1:
                status = "To Do";
                break;
            case 0:
                status = "In Progress"
                break;
            case 1:
                status = "Completed"
                break;
            case 4:
                status = "Graded";
                break;
            default:
                status = "N/A"
                break;
        }
        returnvalue.push({
            "Class": assignment.groupname || "N/A",
            "Type": assignment.assignment_type || "N/A",
            "Date Assigned": new Date(assignment.date_assigned).toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale) || "N/A",
            "Date Due": new Date(assignment.date_due).toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale) || "N/A",
            "Title": assignment.short_description || "N/A",
            "Description": assignment.long_description || "N/A",
            "Status": status || "N/A"
            
        })
    }
    }
    return returnvalue;
}
export enum AssignmentType {
    Assigned = 0,
    Active = 2,
    Due = 1,
}
