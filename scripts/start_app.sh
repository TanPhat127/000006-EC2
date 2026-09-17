#!/bin/bash
cd /opt/app
nohup npm start > /var/log/app.log 2>&1 &
