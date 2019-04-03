if netstat -tlp 2>/dev/null | grep -q gunicorn; then
    port=$(netstat -tlp 2>/dev/null | grep gunicorn | sed "s|^.*\*:\([0-9]\+\).*$|\1|")
    echo "Your server is on port $port".
else
    echo "Your server is off."
fi