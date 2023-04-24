#! /bin/bash

# 'Create' a database. This function assumes that the database is
# acessible. In other words, it does not create the user and the 'database'
# itself, only creates the database schema (tables, views, etc.).
createDB() {
    # Reads workspace
    ws=${1:-"./data"}
    workspace="$ws/create"

    # Get schema files, and sort it
    files=$(ls $workspace | sort)
    schemaFiles=""
    for f in $files; do
        schemaFiles="$schemaFiles $workspace/$f"
    done

    # Create temporary workspace
    tmpWS=$(mktemp -d)

    # Create transactions files
    beginTrans > "$tmpWS/begin.sql"
    commitTrans > "$tmpWS/commit.sql"
    mkfifo "$tmpWS/trans.fifo"
    touch $tmpWS/error.out

    # Concats the transaction and schema files
    cat "$tmpWS/begin.sql"\
        $schemaFiles\
        "$tmpWS/commit.sql"\
        > "$tmpWS/trans.fifo"&

    # Performs schema creation. As is in a transaction if fails it will
    # NOT leave the database inconsistent.
    execFile $tmpWS/trans.fifo $tmpWS/error.out

    # If a error occurs will be sent to error.out
    # If error.out is not empty, should return a error
    egrep . $tmpWS/error.out
    if [[ $? -eq 0 ]]; then
        error=1
    else
        error=0
    fi

    # Utility function that removes the temporary workspace
    rm -rf $tmpWS
    return $error
}
