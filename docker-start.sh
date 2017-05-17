docker run \
--interactive \
--tty \
--rm \
--name node \
--publish 3000:3000 \
--publish 9229:9229 \
--volume ${PWD}:/app/ \
--env DEBUG=NodeJSWebApp:* \
node:7.10.0-alpine \
/bin/sh -c \
'
cd /app/;
npm install;
npm start;
'