(() => {
  const fs = require("fs");
  const crypto = require("crypto");

  const getBytesFromNotation = str => {
    const numList = "KMGTPE";
    if(str.slice(-1) === "B" && numList.includes(str.slice(-2, -1)) && parseInt(sizeArg.slice(0, -2))){
      let size = parseInt(str.slice(0, -2));
      const increment = str.slice(-2, -1);
      console.log("calculaing", str.slice(0, -2), increment + "B");
      for(let i = 0; i < numList.indexOf(increment) + 1; i++){
        console.log("size", size, "became", size * 1024);
        size *= 1024;
      }
      return size;
    }else{
      return parseInt(str);
    }
  };

  const file = process.argv[2];
  fs.writeFileSync(file, "");

  const sizeArg = process.argv[3];
  let size = getBytesFromNotation(sizeArg);

  const options = process.argv.slice(4);

  let chunkLength = 1000;
  options.some(option => {
    let slice;
    if(option.startsWith("--chunk=")){
      slice = "--chunk=".length;
    }else if(option.startsWith("-c=")){
      slice = "-c=".length;
    }
    if(slice){
      console.log("getting chunk size from", option.slice(slice));
      const newSize = getBytesFromNotation(option.slice(slice));
      if(newSize && newSize > 0 && Math.floor(newSize) === newSize){
        chunkLength = newSize;
        return true;
      }else{
        console.error("Invalid chunk size ", option.slice(size));
      }
    }
  });
  console.log("writing", size, "bytes...");
  if(!size || size <= 0 || Math.floor(size) !== size){
    return console.error(`Size ${process.argv[3]} was not a valid number greater than 0!`);
  }

  const getBytes = num => {
    if(options.includes("--random") || options.includes("-r")){
      return crypto.randomBytes(num);
    }else if(options.includes("--newline") || options.includes("-n")){
      return "\n".repeat(num);
    }else{
      return "\0".repeat(num);
    }
  };

  if(size < chunkLength){
    console.log("wrote", size, "bytes to", file);
    fs.appendFileSync(file, getBytes(size));
  }else{
    let left = size;
    do{
      const bytesToWrite = Math.min(left, chunkLength);
      console.log("wrote", bytesToWrite, "bytes to", file);
      fs.appendFileSync(file, getBytes(bytesToWrite));
      left -= bytesToWrite;
    }while(left > 0);
  }
})();
