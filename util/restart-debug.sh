psiturk -e "server off"
psiturk -e "mode sandbox"
psiturk -e "hit expire --all"
psiturk -e "hit dispose --all"
psiturk -e "server on"
psiturk -e "hit create 1 1.00 1"
exit
