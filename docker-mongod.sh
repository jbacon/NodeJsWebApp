docker run \
--interactive \
--tty \
--name mongod \
--rm \
--expose 27017 \
mongo:3.5.6 \
mongod