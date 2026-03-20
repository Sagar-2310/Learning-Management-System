import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    // FIX: If no file exists, return null instead of crashing the parser
    if (!file || !file.buffer) return null; 

    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};

export default getDataUri;