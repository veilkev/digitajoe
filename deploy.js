const { exec } = require('child_process');

const command = 'ssh -p 21098 veilkro@digitajoe.com "/home/veilkro/digitajoe.com/deploy.sh"';

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Error output: ${stderr}`);
    return;
  }

  console.log(`Command output: ${stdout}`);
});