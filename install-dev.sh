#!/usr/bin/env bash
cd frontend
npm install
ng build -prod
cd ../backend
npm install
cd ../matchmaking
npm install
cd ..
pm2 reload ecosystem.config.js --env dev