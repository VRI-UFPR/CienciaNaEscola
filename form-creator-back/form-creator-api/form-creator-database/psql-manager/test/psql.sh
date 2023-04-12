#! /bin/bash

error=0
basePath=$(echo $BASH_SOURCE | rev | cut -c 8- | rev)
cd $basePath/..

#Before all tests
./manager.sh psql drop &> /dev/null

echo "Should create a database"
./manager.sh psql create &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should not create a database, when already exists"
./manager.sh psql create &> /dev/null

if [[ $? -ne 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should load the database"
./manager.sh psql load &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should insert a tuple, with the right sequence"
    PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST}\
         -d ${DB_NAME}\
         -U ${DB_USER}\
         -c "INSERT INTO worker(login, password) VALUES('worker4', 'pass4')"\
         &> /dev/null


    value=$(PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST}\
         -d ${DB_NAME}\
         -U ${DB_USER}\
         -c "SELECT MAX(id) FROM worker" |\
         head -n3 | tail -n1)

if [[ $value -eq 4 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should insert a tuple, with the right sequence, on compactedfile"
    PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST}\
         -d ${DB_NAME}\
         -U ${DB_USER}\
         -c "INSERT INTO workercompact(login, password) VALUES('worker4', 'pass4')"\
         &> /dev/null

    value=$(PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST}\
         -d ${DB_NAME}\
         -U ${DB_USER}\
         -c "SELECT MAX(id) FROM workercompact" |\
         head -n3 | tail -n1)

if [[ $value -eq 4 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should create dummie data in the database"
./manager.sh psql fixture &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should clean the database"
./manager.sh psql clean &> /dev/null

if [[ $? -eq 0 ]]; then
    echo -e "\tSucess"
else
    error=$(($error +1))
    echo -e "\tFail"
fi

echo "Should drop the database"
./manager.sh psql drop &> /dev/null

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


echo "$error error(s) occured."
if [[ $error -gt 0 ]]; then
    exit 1
else
    exit 0
fi
