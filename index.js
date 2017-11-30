(() => {
  const fs = require("fs");

  const file = process.argv[2];
  const size = parseInt(process.argv[3]);
  if(!size || size <= 0 || Math.floor(size) !== size){
    return console.error(`Size ${process.argv[3]} was not a valid number greater than 0!`);
  }

  const stream = fs.createWriteStream(file);
  if(size < 1000){
    console.log("wrote", size, "bytes to", file);
    stream.write("\0".repeat(size));
  }else{
    let left = size;
    do{
      const bytesToWrite = Math.min(left, 1000);
      console.log("wrote", bytesToWrite, "bytes to", file);
      stream.write("\0".repeat(bytesToWrite));
      left -= bytesToWrite;
    }while(left > 0);
  }
  stream.close();
})();
