import axios from "axios";
import cheerio from "cheerio";
import qs from "qs";
import * as dotenv from "dotenv";

dotenv.config();

export let Session : string;

export async function loginAndGetSession() : Promise<void> {
  try {
    const url : string = process.env.CSES_URL + "login";
    const username : string = process.env.CSES_USERNAME || "username";
    const password : string = process.env.CSES_PASSWORD || "password";
    const http = axios.create({
      withCredentials: true
    });

    
    const loginPageResponse = await http.get(url);
    const $ = cheerio.load(loginPageResponse.data);
    
    
    const csrfToken = $("input[name=\"csrf_token\"]").val();

    const credentials = {
      csrf_token: csrfToken,
      nick: username,
      pass: password
    };
    
    const formData = qs.stringify(credentials);
    console.log(formData);
    
    await http.post(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    console.log(loginPageResponse.headers);
    Session = loginPageResponse.headers["set-cookie"]![0].split(";")[0];
  } catch (error) {
    console.error("Error:", error);
  }
}
