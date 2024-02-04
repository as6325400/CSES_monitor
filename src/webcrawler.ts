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


