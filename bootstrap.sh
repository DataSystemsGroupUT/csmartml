# configure environment with python3
sudo apt-get update -y && \
  apt-get install -y python3 python3-pip && \
  pip3 install --upgrade pip

# set up venv environment for python
sudo pip3 install virtualenv
cd /vagrant && virtualenv venv --always-copy
source venv/bin/activate

# other pip packages
pip3 install -r /vagrant/server/dependencies.txt

# node packages
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs
cd /vagrant/interface && npm install