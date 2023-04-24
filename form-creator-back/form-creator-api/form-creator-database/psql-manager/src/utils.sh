#! /bin/bash

# Check if the environment vars are set
correctEnv() {
    vars="DB_HOST DB_NAME DB_USER DB_PASSWORD"
    error=0
    for var in $vars; do
        if [[ -z ${!var} ]]; then
            echo "Env var $var is unset. Set it to use the script"
            error=1
        fi
    done
    return $error
}

# Updates the sequence tables. Used to fix serial data after copy
updateSequences() {
    # Create temporary workspace
    tmpWS=$(mktemp -d)

    # Create transactions files
    beginTrans > "$tmpWS/seq-trans.sql"
    for i in $(getSequences); do
        seq_name=$(echo $i | cut -d',' -f1)
        attr=$(echo $i | cut -d',' -f2)
        table=$(echo $i | cut -d',' -f3)
        sequenceComand "$seq_name" "$attr" "$table" >> "$tmpWS/seq-trans.sql"
    done
    commitTrans >> "$tmpWS/seq-trans.sql"

    # Performs sequence update. As is in a transaction if fails it will
    # NOT leave the database inconsistent.
    execFile $tmpWS/seq-trans.sql $tmpWS/error.out

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

