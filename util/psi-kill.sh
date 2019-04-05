if screen -list | grep -q exp; then     # run bash script
	screen -S exp -p 0 -X stuff "util/end_server.sh$(echo -ne '\r')"
	echo "Exiting Psiturk Server..."
fi

if netstat -tlp 2>/dev/null | grep -q gunicorn; then
    while psiturk -e status | grep -q blocked && netstat -tlp 2>/dev/null | grep -q gunicorn
    do
        echo "Waiting..."
        sleep 1
    done

    screen -S exp -X quit
    echo "Exited."

fi

