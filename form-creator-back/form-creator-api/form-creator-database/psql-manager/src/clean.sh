#! /bin/bash

# Clean all data from database
cleanDB() {
    # Get all deletable tables fron DB
    tables=$(getTables)
    # Create temporary workspace (utility function)
    tmpWS=$(mktemp -d)

    # Create transactions files
    beginTrans > "$tmpWS/trans.sql"
    for t in $tables; do
        cleanCommand $t >> "$tmpWS/trans.sql"
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
    return $error
}

# Created a DELETE TABLE statement
cleanCommand() {
    table=${1:-""}
    echo "DELETE FROM \"$table\";"
}
