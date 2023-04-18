#! /bin/bash

# Script used as interface to manage a PostgreSQL database

if [[ $# -ne 2 && $# -ne 3 ]]; then
    echo "Correct use: $0 <dbms> <task> [directory]"
    echo "The allowed dbms's are: psql and monet"
    echo "The allowed tasks are: create, load, fixture, drop and clean"
    echo "The directory structure should respect the example struct used in:"
    echo "./data directory"

    exit 1
fi

# Rename arguments
DBMS=$1
task=$2
workspace=${3:-"./data"}

# transform relative path into absolute path,
# only when the path is indicated
if [[ $# -eq "3" ]]; then
    workspace="$(cd $workspace && pwd)"
fi

# Make independent of path
basePath=$(echo $BASH_SOURCE | rev | cut -c 11- | rev)
cd $basePath

# Dictonary with allowed tasks, mapped with executable funcion
declare -A TASKS=(
    [create]=createDB
    [load]=loadDB
    [drop]=dropDB
    [clean]=cleanDB
    [fixture]=fixtureDB
)

# Source script files
SCRIPTS=$(ls "./src")
if [[ -n "$SCRIPTS" ]]; then
    for script in $SCRIPTS; do
        source "./src/$script"
    done
fi

# Check env vars (utility)
correctEnv || exit 1

if [ ${TASKS[$task]+_} ]; then
    initDBMS $workspace
    ${TASKS[$task]} $workspace
    if [[ $? -ne 0 ]]; then
        echo "Some error occured on task <$task>"
        echo "Check your connection parameters and schema files"
        echo "Aborting..."
        releaseDBMS $workspace
        exit 1
    else
        echo "Task <$task> performed with success"
        releaseDBMS $workspace
        exit 0
    fi
else
    echo "Task <$task> not found."
    exit 1
fi
