const { exec, spawn } = require('child_process');
const util = require('util');

// Configure your chains, and client
const config = {
  src: {
    chain: '',
    client: '',
  },
  dst: {
    chain: '',
    client: ''
  },
  interval: 30,
  retry: 8, 
  receivers: [
    "+14154700506",
    "+15416027710"
  ]
};

const command = `rly tx raw update-client ${config.src.chain} ${config.dst.chain} ${config.src.client}`;

const runExec = (cmd) => (new Promise((resolve) => {
  exec(cmd, (err, stdout, stderr) => {
    if(err) {
      resolve({
        error: err,
        result: {
          code: '-1'
        }
      })
    } else if(stderr) {
        resolve({
          error: stderr,
          result: {
            code: '-2'
          }
        })
    } else {
      try {
        let json = JSON.parse(stdout)
        resolve({
          error: undefined,
          result: json
        });
      } catch(err) {
        resolve({
          error: err,
          result: {
            code: '-3'
          }
        })
      }
    }
  });
}));

async function main() {
  console(`RUNNING ${command}`
  let execResult = await runExec(command);
  
  console.log(
    "RESULT",
    util.inspect(
      execResult,
      {showHidden: false, depth: null}
    )
  );


  let message = `SUCCESS! Client ${config.src.chain}-${config.dst.chain} updated!`; 
  let restart = false;
  if(execResult.error) {
    restart = true;
    message = `WARNING! Failed to update client ${config.src.chain}-${config.dst.chain}!`; 
  } else if(execResult.result.code) {
    restart = true;
    message = `WARNING! Failed to update client ${config.src.chain}-${config.dst.chain}!`; 
  }

  if(restart) {
    setTimeout(main, config.retry);
    config.receivers.forEach(number => {
      exec(`./notify "${message}" "${number}"`, (err, stdout, stderr) => {
        if(err) {
          console.log(err);
          return
        }
        console.log(`Text message to ${number} successfully sent!`);
      });
    })
  }
}

// Testing
//main();

// Running
setInterval(main, config.interval * 60 * 1000);
