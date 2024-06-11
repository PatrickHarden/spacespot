#!/bin/sh

# case "$NGINX_ENV" in
#  prod)
#    GL_HOST=https://search.cbrelistings.com/api
#    ;;
#  *)
#    GL_HOST=https://uat-search.cbrelistings.com/api
#    ;;
#esac
#sed -i -- 's#{GL_HOST}#'$GL_HOST'#g' /etc/nginx/conf.d/default.conf

exec "$@"
