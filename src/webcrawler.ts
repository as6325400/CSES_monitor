import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { Problem, ProblemSetMap } from "./problem";
import dotenv from "dotenv";

dotenv.config();

export async function getProblemSet(): Promise<ProblemSetMap> {
  try {
    const url = process.env.CSES_URL + "problemset/" || "https://cses.fi/problemset/";
    const response: AxiosResponse = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const problemMaps: ProblemSetMap = {};

    $("h2").each((index, element) => {
      const tags = $(element).text();
      const problems: Problem[] = [];
      if (tags !== "General") {
        $(element).next().find("a").each((index, element) => {
          const title = $(element).text();
          const url = $(element).attr("href")!;
          const id = url.split("/")[3];
          problems.push({ id: id, title: title, tags: tags, url: url });
        });
        problemMaps[tags] = { tags: tags, problems: problems };
      }
    });

    return problemMaps;
  } catch (error) {
    console.error(error);
    throw error; // or return a default value
  }
}

export async function getAcceptedNum(id: string): Promise<number> {
  
  const url = process.env.CSES_URL + "user/" + id;
  
  try {
    
    const response : AxiosResponse = await axios.get(url);
    const html = response.data;
    
    const $ = cheerio.load(html);
    const accepted : number = Number($("table.narrow a").first().text());
    
    return accepted;
  }catch (error) {
    console.error("Error fetching or parsing:", error);
    throw error;
  }
}

export async function getAcceptSet(id: string): Promise<Set<string>> {
  const config = {
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Cookie": process.env.CSES_TOKEN,
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
  try {
    const url = process.env.CSES_URL + "problemset/user/" + id + "/";
    const acceptSet : Set<string> = new Set<string>();
    const response : AxiosResponse = await axios.get(url, config);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const fullTds = $("td a.full");
    fullTds.each((i, element) => {
      const title = $(element).clone().attr("title");
      acceptSet.add(title!);
    });

    return acceptSet;
  } catch (error) {
    console.error(error);
    throw error; // or return a default value
  }
}


