#!/usr/bin/env node
import * as fs from "fs";
import * as prettier from "prettier";
import {queryObjects} from "v8";
const options = await prettier.resolveConfig(".prettierrc");
const lock = {};
const queue = [];
const process_entry = async (entry) => {
    if (!lock[entry.lock]) {
        lock[entry.lock] = true;
        queue.splice(queue.indexOf(entry), 1);
        await entry.callback(entry.file);
        lock[entry.lock] = false;
    }
};
var server_restart = false;

async function format(file) {
    lock[file] = true;
    const prefile = fs.readFileSync(file, {encoding: "utf-8"});
    fs.writeFileSync(
        file,
        await prettier.format(prefile, {...options, parser: "babel"}),
        function () {},
    );
}

fs.watch(
    ".",
    {
        recursive: true,
    },
    function (event, filename) {
        console.log("add")
        queue.push({
            filename: filename,
            callback: format,
            event: event,
        });
    },
);

while (true) {
    console.log(queue.length)
    if(queue.length>0) {
        console.log("proces")
        queue.forEach((...args)=>{process_entry(...args)})
    }
}