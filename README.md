# Sage Page Graph
- from wsl2 shell `docker compose up --build`
- from windows shell `cd frontend && npm install && npm start`
- export PYTHONPATH=E:\code\sage-page-graph\backend:$PYTHONPATH
- `npm run build --production` on windows to gen dist folder

## EC2 install
- install docker
- install docker-compose
- install npm
- install project
- `cd frontend && npm install && npm run build --production`
- `cd .. && docker-compose up --build`
- Before creating users you need to makemigrations and migrate
- createsuperuserhhh