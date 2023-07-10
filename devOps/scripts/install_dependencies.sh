#!/bin/bash
mkdir /root/nodejs-service

sudo chmod -R 777 /root/
sudo apt update  
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo apt install nodejs -y
sudo apt install pm2 