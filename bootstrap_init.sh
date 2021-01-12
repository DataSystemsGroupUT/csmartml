cd /vagrant
. /vagrant/venv/bin/activate

export PYTHONPATH=$PYTHONPATH:`pwd`/server/
python server/main/index.py