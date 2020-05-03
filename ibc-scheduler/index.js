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
    console.log(
      util.inspect(
        JSON.parse(stdout), 
        {showHidden: false, depth: null}
      )
    );
  });
}

setInterval(run, config.interval * 1000);



