if ! screen -list | grep -q exp; then     # run bash script
	screen -dmS exp bash
fi

echo "Starting up server..."
screen -S exp -p 0 -X stuff "util/restart-debug.sh$(echo -ne '\r')"
echo "Server started."
