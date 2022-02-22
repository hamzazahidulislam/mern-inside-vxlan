#!/bin/bash

remote_ip=$1
eth0=$2

sudo apt-get update && sudo apt-get upgrade -y

sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

sudo apt -y install net-tools openvswitch-switch

docker build -t api-server ./server

sudo ovs-vsctl add-br br1

sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan options:remote_ip=${remote_ip} options:key=5000

sudo docker run -di --net none --name backend api-server

sudo ovs-docker add-port br1 eth0 backend --ipaddress=10.0.1.40/24 --gateway=10.0.1.1

echo "finished"