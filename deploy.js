require('dotenv').config();

const { exec } = require('child_process');

const command = `ssh -p ${process.env.SSH_PORT} ${process.env.SSH_USER}@${process.env.SSH_HOST} "/home/veilkro/digitajoe.com/deploy.sh"`;

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
