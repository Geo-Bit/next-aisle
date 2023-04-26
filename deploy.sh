#!/bin/sh

#End current pm2 processes
echo "Terminating current processes"
pm2 stop node
pm2 stop npm


#Pull latest source code
echo "Getting latest version of source code..."
if git pull; then
	echo "Pulled the latest version of source code"
else
	echo "Failed to get latest version of source code"
	exit 1
fi

#Start pm2 processes again
cd /home/pi/ez-list/server
pm2 start node -- index
cd /home/pi/ez-list/client
pm2 start npm -- start


