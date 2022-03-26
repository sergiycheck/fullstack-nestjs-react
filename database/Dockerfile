FROM postgres

ENV POSTGRES_USER="postgres"
ENV POSTGRES_PASSWORD="simple_pass"

COPY ./sql-scripts/ /docker-entrypoint-initdb.d/
