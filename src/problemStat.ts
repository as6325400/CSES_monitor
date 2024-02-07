import Axios from "axios";
import cheerio from "cheerio";
import * as dotenv from "dotenv";

dotenv.config();

async function getUserSolveProblemIDs(userID: string)
{
  const token: string = process.env.CSES_TOKEN || "";
  const config = {
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Cookie": token,
      "Host": "cses.fi",
      "Referer": "https://cses.fi/login",
      "Sec-Ch-Ua": "Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120",
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": "\"macOS\"",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    }
  };
  try
  {
    const url = process.env.CSES_URL + "problemset/user/" + userID + "/";
    const acceptSet : Set<string> = new Set<string>();
    const response = await Axios.get(url, config);
    const html = response.data;
    const $ = cheerio.load(html);
        
    const fullTds = $("td a.full");
    fullTds.each((i, element) => {
      const link = $(element).clone().attr("href");
      const problemID = link?.split("/")[3];
      if(problemID)
      {
        acceptSet.add(problemID);
      }
    });
    return acceptSet;
  }
  catch (error)
  {
    console.error(error);
    throw error; // or return a default value
  }
}

export async function countSolvedProblemsWithTags(userID: string)
{
  const tags: Array<string> = 
    [
      "Introductory Problems",
      "Additional Problems",
      "Mathematics",
      "Dynamic Programming",
      "Range Queries",
      "Graph Algorithms",
      "Sorting and Searching",
      "String Algorithms",
      "Geometry",
      "Tree Algorithms",
      "Advanced Techniques"
    ];
  const acceptSet = await getUserSolveProblemIDs(userID);
  const count: Array<number> = new Array<number>(tags.length).fill(0);
  // 使用爬蟲來看每個題目的tag
  const url = process.env.CSES_URL + "problemset/task/";
  await Promise.all(Array.from(acceptSet).map(async (problemID) => {
    try
    {
      const response = await Axios.get(url + problemID + "/");
      const html = response.data;
      const $ = cheerio.load(html);
      const h4 = $("h4");
      h4.each((i, element) => {
        const text = $(element).text();
        if(tags.includes(text))
        {
          count[tags.indexOf(text)]++;
        }
      });
    }
    catch (error)
    {
      console.error(error);
      throw error; // or return a default value
    }
  }));
  let result: string = "";
  for(let i = 0; i < tags.length; i++)
  {
    result += tags[i] + ": " + count[i] + "\n";
  }
  console.log(result);
}