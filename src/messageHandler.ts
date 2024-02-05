import { Message } from "discord.js";
import { Query } from "./query";
import { User } from "./user";
import { getUserExist } from "./webcrawler";

export async function handleMessage(message: Message, query: Query, ) {
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
}