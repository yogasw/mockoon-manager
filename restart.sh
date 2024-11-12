#!/bin/bash

# Kill all pm2
pm2 kill

# Backend
cd /root/mockoon-manager/backend
npm start

# Frontend
cd /root/mockoon-manager/frontend
npm start
