export async function CheckTokenValid(token:string): Promise<boolean>
{
    const data = await fetch("https://shipleyschool.myschoolapp.com/api/webapp/userstatus", {
        "headers": {
            "Cookie": `t=${token}`,
        }
    });
    return (await data.json()).TokenValid;
}