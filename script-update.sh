git pull
yarn build
sudo pm2 delete 0
sudo pm2 start dist/server.js 