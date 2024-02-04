import { Client, TextChannel } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import * as dotenv from "dotenv";
import { Query } from "./query";
import { USERID_SET } from "../file/User.json";
import { User } from "./user";
import { getAcceptSet } from "./webcrawler";

dotenv.config();



(async () => {
  const BOT = new Client({intents: IntentOptions});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let channel : TextChannel | undefined;

  await BOT.login(process.env.BOT_TOKEN);
  BOT.on("ready", () => {
    console.log("Bot is ready!");
    channel = BOT.channels.cache.get(process.env.BOT_CHANNEL_ID!) as TextChannel;
  });
  
  const query : Query = await Query.init();
  const userQueue : User[] = await User.loadUser(USERID_SET);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (const user of userQueue) {
      const newProblemSets = await getAcceptSet(user.Id);
      if (!user.equalSets(newProblemSets)) {
        channel?.send(`User ${user.Name} has new accepted problems!`);
        const diff = user.diffSets(newProblemSets);
        for (const problem of diff) {
          const newProblem = query.getProblem(problem);
          channel?.send(
            `New problem: ${newProblem!.title}\n` +
            `Tags: ${newProblem!.tags}\n` +
            `URL: ${process.env.CSES_URL}${newProblem!.url}`
          );
        }
        user.updateAccept(diff);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * 5));
  }
})();