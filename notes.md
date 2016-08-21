# Generating self signed SSL certificates for dev work  

## OSX (10.11.6 El Capitan) and Debian Jessie

```sudo openssl genrsa -out server.key 2048```

```sudo openssl req -new -key server.key -out server.csr

```sudo openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt```
