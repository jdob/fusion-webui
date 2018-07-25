# base image
FROM node:8.11.2

ENV HOME=/usr/src/app
RUN mkdir -p ${HOME} && \
    useradd -u 1001 -r -g 0 -d ${HOME} -s /sbin/nologin \
            -c "Fusion-Webui" default
WORKDIR ${HOME}
#WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --production

EXPOSE 3000

RUN chown -R 1001:0 ${HOME} && \
    find ${HOME} -type d -exec chmod g+ws {} \;
# start app
CMD ["/usr/src/app/run"]
USER 1001