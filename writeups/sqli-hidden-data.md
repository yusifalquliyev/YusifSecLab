# SQL Injection — Hidden Data Retrieval

## Lab Overview

This lab demonstrates a SQL Injection vulnerability in a product category filter.

The application uses user-controlled input directly inside an SQL query without proper input validation or parameterized queries.

## Objective

The goal of the lab is to retrieve a hidden product that is normally not displayed.

Hidden product:

`Secret Admin Toolkit`

## Vulnerable Parameter

The vulnerable parameter is:

`category`

The application uses this parameter directly in an SQL query.

## Exploitation

I tested the following SQL Injection payload:

`' OR 1=1 -- -`

The payload changes the logic of the SQL query so that the condition becomes true for all rows.

The resulting query is effectively:

    SELECT * FROM products WHERE category = '' OR 1=1 -- -'

Because `1=1` is always true, the application returns all products, including the hidden product.

## Result

The hidden product `Secret Admin Toolkit` was successfully retrieved.

The lab displayed:

`LAB SOLVED`

Flag:

`YSL{SQL_INJECTION_HIDDEN_DATA_RETRIEVED}`

## Vulnerability

The root cause is the direct insertion of user input into an SQL query.

A secure implementation should use:

- Parameterized queries
- Prepared statements
- Input validation
- Proper database access controls

## What I Learned

This lab helped me understand how SQL Injection can manipulate the logic of an SQL query and expose data that should normally remain hidden.

I also practiced identifying a vulnerable parameter, constructing a basic SQL Injection payload, and validating the result.
## What I Learned

This lab helped me understand how SQL Injection can manipulate the logic of an SQL query and expose data that should normally remain hidden.

I also practiced identifying a vulnerable parameter, constructing a basic SQL Injection payload, and validating the result.
