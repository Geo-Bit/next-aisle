#!/bin/sh

#Pull latest source code
echo "Getting latest version of source code..."
if git pull; then
	echo "Pulled the latest version of source code"
else
	echo "Failed to get latest version of source code"
	exit 1
fi

#See if Docker image is already running
echo "Checking if either containers are running..."
echo "server_c..."
if [ "$( docker container inspect -f '{{.State.Running}}' server_c )" = "true" ];
then
	#Stop Docker image (if running)
	echo "server_c is running. Stopping..."
	if docker stop server_c; then
		echo "server_c stopped"
	else
		echo "server_c failed to stop. Exiting..."
		exit 1
	fi
else
	echo "server_c is not running."
fi

echo "client_c..."
if [ "$( docker container inspect -f '{{.State.Running}}' client_c )" = "true" ];
then
	#Stop Docker image (if running)
	echo "client_c is running. Stopping..."
	if docker stop client_c; then
		echo "client_c stopped"
	else
		echo "client_c failed to stop. Exiting..."
		exit 1
	fi
else
	echo "client_c is not running."
fi

#Build new Docker image
echo "Building new image..."

if docker build -t labdash/dockerize-vuejs-app ~/labdash-home/; then
	echo "Successfully built new image"
else
	echo "Building new image failed. Exiting..."
		exit 1
fi
 
#Run Docker container
echo "Running new Docker image..."
if docker-compose up --build -d; then
	echo "Successfully ran new Docker image!"
else
	echo "Running new Docker image failed. Exiting..."
		exit 1
fi