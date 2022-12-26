const testFolder = __dirname + "/src/preload";
const fs = require("fs");
const path = require("path");

console.log(__dirname);

// fs.readdir(testFolder, (err, files) => {
// 	files.forEach((file) => {
// 		console.log(file);
// 	});
// });

const fileName = path.basename("./main/App.css");
console.log(fileName);

const resolve = path.resolve("./main/App.css");
console.log(resolve);

const check = fs.existsSync("/Users/edlee/Desktop/Git/electron-vite/src/renderer/assets/react.svg")
console.log(check)

const read = fs.readFileSync("/Users/edlee/Desktop/Git/electron-vite/src/renderer/windows/main/App.css", "utf-8")

console.log(read)

const mod = require("./index.node");

mod.getSystemInfo();
