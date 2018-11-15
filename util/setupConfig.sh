if [ -r util/dbcreds ]; then
	heading='\[Database Parameters\]'
	config="config.txt"
	db=$(cat util/dbcreds | grep database)
	table=$(cat util/dbcreds | grep table)
	str="s|$heading|$heading\n$db\n$table|"
	sed -i "$str" $config

	port=31411
	
	while netstat -al | grep -q $port ; do
		let port=port+1
	done

	sed -i "s|^port = .*|port = $port|" $config

	sed -i "s|/ad|/$port/ad|" $config
else
	echo "You need to have a dbcreds file in the util directory."
fi
