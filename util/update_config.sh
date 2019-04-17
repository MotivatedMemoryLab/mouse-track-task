sed -i "/^.*database_url/d" config.txt
sed -i "/^.*table_name/d" config.txt
git update-index --no-assume-unchanged config.txt
git add config.txt
git commit -m "Update config.txt"
git update-index --assume-unchanged config.txt
util/psi-kill.sh
util/setupConfig.sh
