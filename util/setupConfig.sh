if [ -r util/dbcreds ]; then
	heading='\[Database Parameters\]'
	config="config.txt"
	db=$(cat util/dbcreds | grep database)
	table=$(cat util/dbcreds | grep table)
	str="s|$heading|$heading\n$db\n$table|"
	sed -i "$str" $config

	port=31420

	while netstat -tl | grep  $port | grep -q TIME_WAIT ; do
        echo "Waiting for port to open..."
        sleep 10
    done

	while netstat -tl | grep $port | grep -q LISTEN ; do
		let port=port+1
	done

	sed -i "s|^port = .*|port = $port|" $config

	let port=port-10

	sed -i "s|:[0-9]\+/ad|:$port/ad|" $config

    echo "Server set up on port $port."

else
	echo "You need to have a dbcreds file in the util directory."
fi
