#! /bin/bash

#WARNING: This file depends on "utils.sh" and "clean.sh". in order to re-use this file in some other project, you should also source "utils.sh" and "clean.sh".

# Clean and Load dummies datas in the database. The name of each file MUST be <table name>.csv
fixtureDB() {

    # Reads workspace
    ws=${1:-"./data"}
    workspace="$ws/fixture"

    cleanDB

    # Create temporary workspace
    tmpWS=$(mktemp -d)
    # Create transactions files
    beginTrans > "$tmpWS/trans.sql"
    i=0
    tables=$(ls -1 $workspace | grep ".bz2" | rev | cut -f4- -d\. | rev)
    for t in $tables; do
        mkfifo $tmpWS/$t.csv
        tar xjOf $workspace/$t.csv.tar.bz2 > $tmpWS/$t.csv &
        cpyComand $t $tmpWS/$t.csv >> "$tmpWS/trans.sql"
    done
    tables=$(ls -1 $workspace | grep -v ".bz2" | rev | cut -f2- -d\. | rev)
    for t in $tables; do
        cpyComand $t $workspace/$t.csv >> "$tmpWS/trans.sql"
    done
    commitTrans >> "$tmpWS/trans.sql"

    # Performs schema creation. As is in a transaction if fails it will
    # NOT leave the database inconsistent.
    execFile $tmpWS/trans.sql $tmpWS/error.out

    # If a error occurs will be sent to error.out
    # If error.out is not empty, should return a error
    egrep . $tmpWS/error.out
    if [[ $? -eq 0 ]]; then
        error=1
    else
        error=0
    fi

    # Utility function that removes the temporary workspace
    rm -fr $tmpWS

    #Update sequences for serial attributes
    updateSequences
    seqerror=$?
    error=$(( $error + $seqerror))

    return $error
}
