# State of JS HQ - Command Line tool

A tool to perform background tasks related to State of JavaScript.

```
node cli --help
```

## STEP 1: Download and process survey results

To download **all** pages of result sequentially, each page contains 1000 answers:

```
node cli download --all --limit 1000
```

For an unknown reason, some requests may fail, returning an error 500.

Use the following command to request a given page.
E.g. to request results from 18001 to 19000:

```
node cli download --start 18001 --limit 1000
```

The following files will be created in local

```
./output
└── responses
    ├── 00001.csv
    ├── 01001.csv
    ├── 02001.csv
    ├── 03001.csv
    ├── 04001.csv
    ├── 05001.csv
    ├── 06001.csv
    ├── 07001.csv
    ├── 08001.csv
    ├── 09001.csv
    ├── 10001.csv
    ├── 11001.csv
    ├── 12001.csv
    ├── 13001.csv
    ├── 14001.csv
    ├── 15001.csv
    ├── 16001.csv
    ├── 17001.csv
    ├── 19001.csv
    ├── 20001.csv
    ├── 21001.csv
    ├── 22001.csv
    └── 23001.csv
```

## STEP 2: Aggregate all results

The following script will loop through all files inside `output/responses` and create a single object.

```
node cli aggregate
```

As a result of the aggregation, the following files will be created:

```
./output
├── aggregations
│   ├── answers.json
│   └── meta.json
```
