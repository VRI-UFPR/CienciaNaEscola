#! /bin/bash

# Executes the SQL file in the target DBMS
execFile() {
    file=$1
    error=${2:-"/tmp/error.out"}
    if [[ ${DBMS} == "psql" ]]; then
        PGPASSFILE=$PGPASSFILE psql -d ${DB_NAME} -U ${DB_USER} -h ${DB_HOST} -f $file 2> $error
    elif [[ ${DBMS} == "monet" ]]; then
        DOTMONETDBFILE=$DOTMONETDBFILE mclient -E "UTF8" < $file 2> $error
    fi

}

# Executes the SQL file in the target DBMS
execStatement() {
    statement=$1
    if [[ ${DBMS} == "psql" ]]; then
        PGPASSFILE=$PGPASSFILE psql -d ${DB_NAME} -U ${DB_USER} -h ${DB_HOST} -c "$statement"
    elif [[ ${DBMS} == "monet" ]]; then
        echo "$statement" | DOTMONETDBFILE=$DOTMONETDBFILE mclient -i -E "UTF8"
    fi

}

# Begin Transaction
beginTrans() {
    if [[ $DBMS == "psql" ]]; then
        echo "BEGIN;"
    elif [[ $DBMS == "monet" ]]; then
        echo "START TRANSACTION;"
    fi
}

# Commit Transaction
commitTrans() {
    if [[ $DBMS == "psql" ]]; then
        echo "COMMIT;"
    elif [[ $DBMS == "monet" ]]; then
        echo "COMMIT;"
    fi
}

# Init DBMS configuration
initDBMS() {
    ws=${1:-"./data"}
    if [[ $DBMS == "psql" ]]; then
        PGPASSFILE="$ws/.pgpass"
        echo "${DB_HOST}:5432:${DB_NAME}:${DB_USER}:${DB_PASSWORD}" > $PGPASSFILE
        chmod 0600 $PGPASSFILE
    elif [[ $DBMS == "monet" ]]; then
        DOTMONETDBFILE="$ws/.monetdb"
        echo "user=${DB_USER}" > $DOTMONETDBFILE
        echo "password=${DB_PASSWORD}" >> $DOTMONETDBFILE
        echo "database=mapi:monetdb://${DB_HOST}:50000/${DB_NAME}"  >> $DOTMONETDBFILE
        chmod 0600 $DOTMONETDBFILE
    fi
}

# Releases DBMS configuration
releaseDBMS() {
    ws=${1:-"./data"}
    if [[ $DBMS == "psql" ]]; then
        rm $PGPASSFILE
        return 0
    elif [[ $DBMS == "monet" ]]; then
        rm $DOTMONETDBFILE
    fi
}

# Get the list of tables in database
getTables() {
    if [[ $DBMS == "psql" ]]; then
         unset -v $(locale | cut -f1 -d'=');
         execStatement "\d" |\
         grep "^.*|.*| *table *|.*$" |\
         cut -d'|' -f2
    elif [[ $DBMS == "monet" ]]; then
         unset -v $(locale | cut -f1 -d'=');
         execStatement "\d" |\
         grep "^TABLE" |\
         cut -d'.' -f2
    fi
}

# Get the list of sequences in database
getSequences() {
    #FIXME: Unexpected result if the table contains more than one sequence
    if [[ $DBMS == "psql" ]]; then
        tables=$(getTables)
        for t in $tables; do
            seq=$(\
                execStatement "\d \"$t\"" |\
                grep "nextval(" |\
                sed -e "s/nextval('\|'::regclass)//g"
            )
            if [[ -n $seq ]]; then
                attr=$(echo "$seq" | cut -d'|' -f1)
                seq_name=$(echo "$seq" | cut -d'|' -f5)
                echo "$seq_name,$attr,$t" | sed -e 's/ //g'
            fi
        done
    elif [[ $DBMS == "monet" ]]; then
        tables=$(getTables)
        for t in $tables; do
            seq=$(\
                execStatement "\d \"$t\"" |\
                grep "next value" |\
                tr -s ' ' |\
                sed -e 's/\t//g' |\
                sed -e 's/,//g'\
            )
            if [[ -n $seq ]]; then
                attr=$(echo "$seq" | cut -d' ' -f1)
                seq_name=$(echo "$seq" | cut -d'.' -f2)
                echo "$seq_name,$attr,$t" | sed -e 's/ //g'
            fi
        done
    fi
}

# Created a query that updates a sequence
sequenceComand() {
    seq_name=$1
    attr=$2
    table=$3
    if [[ $DBMS == "psql" ]]; then
        echo "SELECT setval('$seq_name', COALESCE((SELECT MAX($attr) FROM \"$table\")+1,1),false);"
    elif [[ $DBMS == "monet" ]]; then
        echo "ALTER SEQUENCE "$seq_name" RESTART WITH (SELECT MAX($attr) + 1 FROM \"$table\");"
    fi
}

# Creates the COPY command used to insert data
cpyComand() {
    table=${1:-""}
    file=${2:-""}
    if [[ $DBMS == "psql" ]]; then
        echo "\\copy \"$table\" FROM '$file' WITH CSV HEADER ENCODING 'UTF8' DELIMITER ';'"
    elif [[ $DBMS == "monet" ]]; then
        echo "COPY OFFSET 2 INTO \"$table\" FROM '$file' ON CLIENT USING DELIMITERS ';','\\n','\"' NULL AS '';"
    fi
}

# Creates the DROP TABLE statement
dropComand() {
    table=${1:-""}
    if [[ $DBMS == "psql" ]]; then
        echo "DROP TABLE IF EXISTS \"$table\" CASCADE;"
    elif [[ $DBMS == "monet" ]]; then
        echo "DROP TABLE \"$table\" CASCADE;"
    fi
}
