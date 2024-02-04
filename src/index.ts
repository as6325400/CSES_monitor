import { Client } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import * as dotenv from "dotenv";
import { Query } from "./query";
import { USERID_SET } from "../file/User.json";
import { User } from "./user";
import { getAcceptSet } from "./webcrawler";

dotenv.config();



(async () => {
  const BOT = new Client({intents: IntentOptions});

  await BOT.login(process.env.BOT_TOKEN);
  BOT.on("ready", () => {
    console.log("Bot is ready!");
  });
  
  const query : Query = await Query.init();
  const userQueue : User[] = await User.loadUser(USERID_SET);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (const user of userQueue) {
      const newProblemSets = await getAcceptSet(user.Id);
      if (!user.equalSets(newProblemSets)) {
        console.log("User " + user.Name + " has new accepted problems!");
        const diff = user.diffSets(newProblemSets);
        for (const problem of diff) {
          console.log("New problem: " + query.getProblem(problem)!.title);
        }
        user.updateAccept(diff);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * 5));
  }
  

})();