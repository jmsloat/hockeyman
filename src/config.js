import * as fs from "fs";

export function saveConfig(cfg) {
    fs.writeFileSync("config/config.json", JSON.stringify(cfg, null, 2));
    return cfg;
}

export function readConfig() {
    return JSON.parse(fs.readFileSync("config/config.json"));
}