# Reflected XSS — Search Input

## Lab Overview

This lab demonstrates a Reflected Cross-Site Scripting (XSS) vulnerability in a web application search function.

The application reflects user-controlled input directly into the HTML response without proper output encoding.

## Objective

The goal of the lab is to execute JavaScript through the vulnerable search parameter.

## Vulnerable Parameter

The vulnerable parameter is:

`search`

The application takes the user's search input and reflects it directly into the page.

## Exploitation

I tested the following XSS payload:

`<script>alert(1)</script>`

The payload was reflected into the application's HTML response without being properly encoded.

As a result, the browser interpreted the injected `<script>` element as JavaScript and executed it.

## Result

The JavaScript `alert(1)` successfully executed in the browser.

The lab displayed:

`LAB SOLVED`

Flag:

`YSL{REFLECTED_XSS_EXECUTED}`

## Vulnerability

The root cause is the direct reflection of user-controlled input into an HTML response.

A secure implementation should use:

- Context-aware output encoding
- Input validation where appropriate
- Safe templating practices
- Content Security Policy (CSP) as an additional defense

## Mitigation

User-controlled input should never be inserted directly into HTML.

The application should properly encode output before rendering it in the browser.

For example, HTML special characters such as `<`, `>`, `"`, and `'` should be safely encoded when the data is displayed as text.

## What I Learned

This lab helped me understand how Reflected XSS occurs when user input is immediately returned in an HTTP response and interpreted by the browser as HTML or JavaScript.

I also practiced identifying the vulnerable parameter, creating a simple XSS payload, and validating successful JavaScript execution.
