const { exec, spawn } = require('child_process');
const util = require('util');

// Configure your chains, and client
const config = {
  src: {
    chain: 'ibc0',
    client: 'ibconeclient',
  },
  dest: {
    chain: 'ibc1',
  },
  interval: 10
};

const cmd = `rly tx raw update-client ${config.src.chain} ${config.dest.chain} ${config.src.client}`;

function run() {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    let result = JSON.parse(stdout);
    // Log the result to console
    console.log(
      util.inspect(
        result,
        {showHidden: false, depth: null}
      )
    );
  
    let message = `Success! Client ${config.src.client} for connection ${config.src.chain}-${config.dest.chain} updated at ${result.height}! TxHash: ${result.txhash}`; 
    if(result.code) {
      message = `WARNING! Client ${config.src.client} for connection ${config.src.chain}-${config.dest.chain} failed to update!`; 
    }
    exec(`./notify "${message}"`, (err, stdout, stderr) => {
      if(err) {
        console.log(err);
        return
      }
      console.log(stdout, stderr);
    });
  });
}

setInterval(run, config.interval * 1000);



