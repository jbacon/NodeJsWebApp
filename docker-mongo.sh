docker run \
--interactive \
--tty \
--name mongo \
--rm \
--expose 27017 \
mongo:3.5.6 \
mongo \
--shell \
--host mongodb://172.17.0.2:27017
