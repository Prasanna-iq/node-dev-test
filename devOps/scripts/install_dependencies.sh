#!/bin/bash
mkdir /root/nodejs-service

sudo chmod -R 777 /root/
sudo yum update  
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install nodejs -y
sudo npm install pm2 -g