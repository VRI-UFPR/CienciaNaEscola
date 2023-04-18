#! /bin/bash

# Drop a database. Removes all tables and data
dropDB() {
    tables=$(getTables)
    # Create temporary workspace (utility function)
    tmpWS=$(mktemp -d)

    # Create transactions files
    beginTrans > "$tmpWS/trans.sql"
    for t in $tables; do
        dropComand $t >> "$tmpWS/trans.sql"
    done
    commitTrans >> "$tmpWS/trans.sql"


    # Performs schema creation. As is in a transaction if fails it will
    # NOT leave the database inconsistent.
    execFile $tmpWS/trans.sql $tmpWS/error.out

    # If a error occurs will be sent to error.out
    # If error.out is not empty, should return a error
    cat $tmpWS/error.out | grep -v "drop cascades to" > $tmpWS/error2.out
    egrep . $tmpWS/error2.out
    if [[ $? -eq 0 ]]; then
        error=1
    else
        error=0
    fi

    # Utility function that removes the temporary workspace
    rm -fr $tmpWS
    return $error
}

