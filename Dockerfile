FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=6718
ENV MYSQL_DATABASE=pf_db

COPY ./scripts/ /docker-entrypoint-initdb.d/
#fportelalima/pf-mysql:1.0