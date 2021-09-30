cd server
docker build -t pyapp .

cd ..

cd interface
docker build -t viz .

cd ..
docker-compose up