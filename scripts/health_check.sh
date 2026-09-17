#!/bin/bash
sleep 5
curl -f http://localhost:5000/ || exit 1
