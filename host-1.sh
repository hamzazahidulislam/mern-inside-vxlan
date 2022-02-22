#!/bin/bash

remote_ip=$1
eth0=$2

sudo apt-get update && sudo apt-get upgrade -y

sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

sudo apt -y install net-tools openvswitch-switch

docker build -t react-app ./client

sudo ovs-vsctl add-br br1

sudo ovs-vsctl add-port br1 net1 -- set interface net1 type=internal

sudo ifconfig net1 10.0.1.1 netmask 255.255.255.0 up

sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan options:remote_ip=${remote_ip} options:key=5000

sudo docker run -di --net none --name frontend react-app

sudo ovs-docker add-port br1 eth0 frontend --ipaddress=10.0.1.50/24 --gateway=10.0.1.1

sudo docker run -di --net none --name mongodb mongo:3.6-xenial

sudo ovs-docker add-port br1 eth0 mongodb --ipaddress=10.0.1.30/24 --gateway=10.0.1.1

echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf

sudo iptables --append FORWARD --in-interface net1 --jump ACCEPT
sudo iptables --append FORWARD --out-interface net1 --jump ACCEPT
sudo iptables --table nat --append POSTROUTING --source 10.0.1.0/24 --jump MASQUERADE

sudo iptables -t nat -A PREROUTING -d ${eth0} -p tcp -m tcp --dport 3000 -j DNAT --to-destination 10.0.1.50:3000

echo "finished"