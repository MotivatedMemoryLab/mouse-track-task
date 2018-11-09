if ! screen -list | grep -q exp; then     # run bash script
	screen -dmS exp bash
fi

screen -S exp -p 0 -X stuff "./restart-debug.sh$(echo -ne '\r')"


