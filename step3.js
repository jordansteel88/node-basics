const fs = require('fs');
const process = require('process');
const axios = require('axios');

let output;
let path;

function cat(path, output) {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
            console.error(`Error reading ${path}: ${err}`);
            process.exit(1);
        }
        handleOutput(data, output);
    });
}

async function webCat(url, output) {
    try {
        let res = await axios.get(url);
        handleOutput(res.data, output);
    } catch (err) {
        console.error(`Error fetching ${url}: ${err}`);
        process.exit(1);
    }    
}

function handleOutput(text, output) {
    if (output) {
      fs.writeFile(output, text, 'utf8', function(err) {
        if (err) {
          console.error(`Couldn't write ${output}: ${err}`);
          process.exit(1);
        }
      });
    } else {
      console.log(text);
    }
}

if (process.argv[2] === '--out') {
    output = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

if (path.includes('http://')) {
    webCat(path, output);
} else {
    cat(path, output);
}

