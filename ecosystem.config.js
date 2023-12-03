module.exports = {
  apps: [
    {
      name: 'tictactoe-backend',
      script: 'node_modules/.bin/npm',
      args: 'run start', // Reemplaza 'start' con el script que deseas ejecutar
      exec_mode: 'cluster',
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // Formato de fecha y hora
    },
  ],
};
