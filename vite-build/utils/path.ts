import fs from "fs";

export const takeAllFileName = (folder: string) => {
	return fs.readdirSync(folder);
};
