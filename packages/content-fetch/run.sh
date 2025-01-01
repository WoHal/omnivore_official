#!/bin/sh

export CHROMIUM_PATH=/usr/bin/chromium
export LAUNCH_HEADLESS=true 
export VERIFICATION_TOKEN=dddddddddddddddddddddddd
export JWT_SECRET=bbbbbbbbbbbbbbbbbbbbbbbbbbb
export REST_BACKEND_ENDPOINT=http://localhost:4000/api
export REDIS_URL=redis://localhost:6379
export MQ_REDIS_URL=redis://localhost:6380
export MINIO_USERNAME=minioadmin
export MINIO_PASSWORD=minioadminpasswd
npm start
