#! /bin/bash

error=0
basePath=$(echo $BASH_SOURCE | rev | cut -c 9- | rev)
cd $basePath/..

DOTMONETDBFILE="/tmp/.monetdb"
echo "user=${DB_USER}" > $DOTMONETDBFILE
echo "password=${DB_PASSWORD}" >> $DOTMONETDBFILE
echo "database=mapi:monetdb://${DB_HOST}:50000/${DB_NAME}"  >> $DOTMONETDBFILE
chmod 0600 $DOTMONETDBFILE

#Before all tests
./manager.sh monet drop &> /dev/null

echo "Should create a database"
./manager.sh monet create &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should not create a database, when already exists"
./manager.sh monet create &> /dev/null

if [[ $? -ne 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should load the database"
./manager.sh monet load &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should insert a tuple, with the right sequence"
    DOTMONETDBFILE=$DOTMONETDBFILE mclient \
         -s "INSERT INTO worker(login, password) VALUES('worker4', 'pass4')"\
         &> /dev/null

    value=$(DOTMONETDBFILE=$DOTMONETDBFILE mclient -f csv \
         -s "SELECT MAX(id) FROM worker")

if [[ $value -eq 4 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should insert a tuple, with the right sequence, on compactedfile"
    DOTMONETDBFILE=$DOTMONETDBFILE mclient \
         -s "INSERT INTO workercompact(login, password) VALUES('worker4', 'pass4')"\
         &> /dev/null

    value=$(DOTMONETDBFILE=$DOTMONETDBFILE mclient -f csv \
         -s "SELECT MAX(id) FROM workercompact")

if [[ $value -eq 4 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should create dummie data in the database"
./manager.sh monet fixture &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should clean the database"
./manager.sh monet clean &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should drop the database"
./manager.sh monet drop &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

# For some reason does not work on gitlab-ci
# echo "Should not create database with wrong credentials"
# PGPASSWORD="wrongPass" ./manager.sh create &> /dev/null

# if [[ $? -ne 0 ]]; then
#     echo -e "\tSucess"
# else
#     error=$(($error +1))
#     echo -e "\tFail"
# fi

# echo "Should not load database with wrong credentials"
# PGPASSWORD="wrongPass" ./manager.sh load &> /dev/null

# if [[ $? -ne 0 ]]; then
#     echo -e "\tSucess"
# else
#     error=$(($error +1))
#     echo -e "\tFail"
# fi

# echo "Should not drop database with wrong credentials"
# PGPASSWORD="wrongPass" ./manager.sh drop &> /dev/null

# if [[ $? -ne 0 ]]; then
#     echo -e "\tSucess"
# else
#     error=$(($error +1))
#     echo -e "\tFail"
# fi

rm $DOTMONETDBFILE
echo "$error error(s) occured."
if [[ $error -gt 0 ]]; then
    exit 1
else
    exit 0
fi
