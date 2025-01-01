#!/bin/sh

export API_ENV=prod
export PORT=4001
export PG_HOST=localhost
export PG_USER=app_user
export PG_PASSWORD=app_pass
export PG_DB=omnivore
export PG_PORT=5432
export PG_POOL_MAX=20
export JAEGER_HOST=localhost
export IMAGE_PROXY_SECRET=aaaaaaaaaaaaaaaaaaa
export JWT_SECRET=bbbbbbbbbbbbbbbbbbbbbbbbbbb
export SSO_JWT_SECRET=ccccccccccccccccccccccc
export CLIENT_URL=http://omnivore.soian.fun
export GATEWAY_URL=http://localhost:4000/api
export CONTENT_FETCH_URL=http://localhost:3002/?token=dddddddddddddddddddddddd
export REDIS_URL=redis://localhost:6379
export MQ_REDIS_URL=redis://localhost:6380
export GCS_UPLOAD_BUCKET=omnivore-bucket
export PUBSUB_EMULATOR_HOST=http://localhost:8085
npm run dev_qp
