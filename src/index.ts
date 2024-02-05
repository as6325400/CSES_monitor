import { Client, TextChannel } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import * as dotenv from "dotenv";
import { Query } from "./query";
import { USERID_SET } from "../file/User.json";
import { User } from "./user";
import { getAcceptSet, getUserExist } from "./webcrawler";

dotenv.config();



(async () => {
  const BOT = new Client({intents: IntentOptions});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let channel : TextChannel | undefined;

  await BOT.login(process.env.BOT_TOKEN);
  
  const query : Query = await Query.init();
  await User.loadUser(USERID_SET);

  BOT.on("ready", () => {
    console.log("Bot is ready!");
    channel = BOT.channels.cache.get(process.env.BOT_CHANNEL_ID!) as TextChannel;
  });

  BOT.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith(process.env.BOT_PREFIX!)) return;
    const command : string[] = message.content.split(" ");
    if (command.length < 2) return;
    if (command[1] === "tagsets") {

      let mes : string = "";
      let idx = 1;

      for(const key of query.getTagSets()) {
        console.log(key);
        mes += `${idx}. ${key}\n`;
        idx++;
      }
      
      message?.reply(mes);
    }

    else if (command[1] == "add"){
      if (command.length < 3) {
        message?.reply("Please input the user id!");
        return;
      }

      if (getUserExist(command[2]) === null) {
        message?.reply("User does not exist!");
        return;
      }

      const newUser: User | string = await User.createUser(command[2]);

      if (typeof newUser === "string") {
        message?.reply(newUser);
      }
      else {
        message?.reply(`User ${newUser.Name} has been added!`);
      }
    }
  });

  console.log("Bot is running!");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (const user of User.getUserSet()) {
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