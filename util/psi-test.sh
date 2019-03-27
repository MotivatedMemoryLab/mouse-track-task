git checkout -- config.txt
util/setupConfig.sh

if ! screen -list | grep -q exp; then     # run bash script
	screen -dmS exp bash
fi

screen -S exp -p 0 -X stuff "util/restart-debug.sh$(echo -ne '\r')"

while psiturk -e status | grep -q off
do
	echo "Waiting..."
    sleep 1
done

echo "Server on."