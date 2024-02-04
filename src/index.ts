import { Client } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import { setProblemJson } from "./file";


(async () => {
  const BOT = new Client({intents: IntentOptions});

  await BOT.login(process.env.BOT_TOKEN);
  BOT.on("ready", () => {
    console.log("Bot is ready!");
  });
  await setProblemJson();
  

})();