docker run \
--interactive \
--tty \
--rm \
--name node \
--publish 3000:3000 \
--publish 9229:9229 \
--volume ${PWD}:/app/ \
--env HTTP_PROXY=${HTTP_PROXY} \
--env HTTPS_PROXY=${HTTPS_PROXY} \
--env http_proxy=${http_proxy} \
--env https_proxy=${https_proxy} \
--env NO_PROXY=${NO_PROXY} \
--env no_proxy=${no_proxy} \
--env DEBUG=NodeJSWebApp:* \
node:7.10.0-alpine \
/bin/sh -c \
'
cd /app/;
npm install;
npm build;
npm start;
'