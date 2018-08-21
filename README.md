# Reactor; a chatwidget created with ReactJS
Created by team Reactor (coach Aisha) at WeCamp 2018

## Development environment
We use Docker for the development environment. [After installing docker and docker-compose](https://docs.docker.com/compose/install/)
you can run `docker-compose up`. This will create 2 docker containers:

* react: Container that automatically transpiles React code in `./widget/src` to browser-compatible code in `./widget/build`
* website: Container with nginx that shows the `nginx/public/index.html` website.

You can access the website at [http://localhost:8080](http://localhost:8080).
