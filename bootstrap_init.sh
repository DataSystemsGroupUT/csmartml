cd /vagrant
. /vagrant/venv/bin/activate

export PYTHONPATH=$PYTHONPATH:`pwd`/server/
#npm start
python server/main/sse.py