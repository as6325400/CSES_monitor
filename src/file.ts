import { promises as fs } from "fs";
import { ProblemSetMap } from "./problem";
import { getProblemSet } from "./webcrawler";

export async function setProblemJson(){
  const obj : ProblemSetMap = await getProblemSet(process.env.CSES_URL || "https://cses.fi/problemset/");
  const jsonContent = JSON.stringify(obj, null, 2);
  await fs.writeFile("./file/Problem.json", jsonContent, "utf8");
}