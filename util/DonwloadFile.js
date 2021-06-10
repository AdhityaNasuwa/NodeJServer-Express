const fs = require("fs");
const os = require("os");

const SaveFile = () => {
  const dataPath = "../public/StrFiles/" + os.hostname() + ".json";
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "", "utf-8");
  }
};

SaveFile();
