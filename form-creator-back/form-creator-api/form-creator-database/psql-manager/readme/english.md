# Ultimate SQL Manager

Tool developed to ease database management. The main goal of this tool is to
become a interface to perform basic operations in databases independent of the
**DBMS** used.

## Languages

The same README is available other languages:

* ![alt text](./brazil-flag.png "Brazilian Flag") [Portuguese](../README.md)
* ![alt text](./united-kingdom-flag.png "UK Flag") [English](./english.md)

## How to use
```bash
    ./manger.sh <dbms> <operation> [./workspace]
```

If workspace is not provided, the default directory (./data) is used instead.

Any workspace directory MUST follow the same structure of ./data directory.

## Features

The list of features and operations allowed is listed bellow:

### Database building (creation) (*create*)

Given a freshly created database, in other words, a database with no tables and
any other elements, the **create** command can be used to load building files to
the database, generating a database schema, without any record inserted.

The **create** operation executes the files in **create** directory in
alphabetical order, allowing structures with dependencies.

### Bulk insertion (*load*)

The **load** operation can be used to perform bulk data insertion. Each file in
the **load** directory will be inserted in a table with the same same (removing
the extension).

Two data formats are allowed:

* **example.csv**: CSV file with **;** as separator and **\n** as end-of-line.
The file MUST contain a header.

* **example.csv.tar.bz2**: Compacter version of the CSV file previously
mentioned. The file must contain a single CSV file which will be inserted after
its decompression . The following commands are used to compress e decompress
respectively:
```bash
    tar cjf example.csv.tar.bz2 example.csv
    tar xjOf example.csv.tar.bz2 > example.csv
```

WARNING: The **load** operation additiva, which means that the records will be
added in the database, but the existent data will NOT be removed. To ensure that
the database contains exactly the data contained in the directory, the operation
**fixture** should be used.

### Database cleaning (*clean*)

Removal of all records inserted in the databse, but keeping the structure, which
means that the databse returns to the state which was after the **create**
operation was performed. The operation **clean** must be used to perform this
task.

### Fixtures bulk insertion (*fixture*)

Clean the database then bulk inserts records in the **fixture** directory,
using the same restrictions and patterns described in the **load** operation.
This operation is normally used in test scenarios to ensure that the database
state is exactly the same as described in the **fixture** directory.

WARNING: The **fixture** operation is equivalent to a **clean** followed by a
**load** operation, however, the **fixture** operation loads its data from the
**fixture** not from the **load** directory.

WARNING: The **fixture** operation will remove ALL existent records in the
database.

### Database destruction (*drop*)

Removal of all database structures. After this operation all records and
structures will be removed. The database state is the same as the state before
the use of the **create** operation. The **drop** operation is used to perform
this task.

## DMBSs

Nowadays the supported DBMSs are:
* PostgreSQL: Tested with the version 10
* MonetDB: Tested with the version Apr2019

## Future Work

The objective of the project in the future is to extend the support to others
DBMSs and to add more operations.

Candidate DBMSs to receive support:
* MariaDB

Candidate operations to be added:
* Database versioning (migrations)

## Images

The flag images were imported from: https://www.iconfinder.com/iconsets/142-mini-country-flags-16x16px
