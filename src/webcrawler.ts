import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { Problem, ProblemSetMap } from "./problem";


export async function getProblemSet(url: string): Promise<ProblemSetMap> {
  try {
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
          const id = url.split("/")[2];
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



