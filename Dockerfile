ARG Environment

# build environment
FROM node:12.18.1 as builder
ARG Environment
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
  libxss1 --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV PATH /usr/src/app/node_modules/.bin:$PATH
# Auth in .npmrc already set by ADO
# ARG TOKEN
# RUN echo @cbreenterprise:registry=https://npm.pkg.github.com/ >.npmrc
# RUN echo //npm.pkg.github.com/:_authToken=${TOKEN} >>.npmrc
COPY . /usr/src/app
RUN yarn install
ENV REACT_APP_ENV ${Environment}
RUN nohup sh -c "node proxy/prerender-proxy &" && yarn build

# production environment
FROM nginx:1.17.1-alpine
ARG Environment
RUN rm -rf /etc/nginx/conf.d
COPY nginx /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80 443
ENV NGINX_ENV ${Environment}
COPY Docker/entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
