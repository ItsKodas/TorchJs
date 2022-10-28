//? Dependencies
import fs from "fs";
//? Module
const Config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
export default Config;
