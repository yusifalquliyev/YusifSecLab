const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./yusifseclab.db");

/* =========================
   DATABASE
========================= */

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            released INTEGER NOT NULL
        )
    `);

    db.get(
        `SELECT COUNT(*) AS count FROM products`,
        [],
        (err, row) => {
            if (err) {
                console.error("Database error:", err.message);
                return;
            }

            if (row.count === 0) {
                const insert = db.prepare(`
                    INSERT INTO products
                    (id, name, category, released)
                    VALUES (?, ?, ?, ?)
                `);

                insert.run(1, "Red Team Notebook", "Gifts", 1);
                insert.run(2, "Cybersecurity Hoodie", "Gifts", 1);
                insert.run(3, "Secret Admin Toolkit", "Internal", 0);
                insert.run(4, "Pentesting Lab Access", "Training", 1);

                insert.finalize();

                console.log("Products database initialized.");
            }
        }
    );
});


/* =========================
   LABS
========================= */

const labs = [
    {
        id: "sqli",
        number: "01",
        title: "SQL Injection",
        short: "Manipulate database queries and retrieve hidden data.",
        category: "Injection",
        difficulty: "Easy",
        status: "ACTIVE",
        icon: "⌁"
    },
    {
        id: "xss",
        number: "02",
        title: "Cross-Site Scripting",
        short: "Identify and exploit reflected input in a web application.",
        category: "Client-Side",
        difficulty: "Easy",
        status: "READY",
        icon: "‹›"
    },
    {
        id: "idor",
        number: "03",
        title: "IDOR",
        short: "Access resources belonging to another user by manipulating IDs.",
        category: "Access Control",
        difficulty: "Medium",
        status: "READY",
        icon: "◈"
    },
    {
        id: "auth",
        number: "04",
        title: "Authentication",
        short: "Explore weaknesses in login and authentication mechanisms.",
        category: "Authentication",
        difficulty: "Medium",
        status: "READY",
        icon: "⌑"
    },
    {
        id: "upload",
        number: "05",
        title: "File Upload",
        short: "Investigate insecure file upload functionality.",
        category: "Web Security",
        difficulty: "Medium",
        status: "READY",
        icon: "↑"
    },
    {
        id: "ssrf",
        number: "06",
        title: "SSRF",
        short: "Understand how servers can be abused to make internal requests.",
        category: "Server-Side",
        difficulty: "Hard",
        status: "LOCKED",
        icon: "◎"
    }
];


/* =========================
   HELPERS
========================= */

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function page(title, content) {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>${title} — YusifSecLab</title>

    <link rel="stylesheet" href="/style.css">
</head>

<body>

<div class="bg-grid"></div>
<div class="ambient ambient-one"></div>
<div class="ambient ambient-two"></div>

<nav class="navbar">

    <div class="nav-inner">

        <a href="/" class="logo">

            <span class="logo-mark">
                &gt;_
            </span>

            <span>
                Yusif<span class="logo-accent">SecLab</span>
            </span>

        </a>


        <div class="nav-links">

            <a href="/">
                Home
            </a>

            <a href="/labs">
                Labs
            </a>

            <a href="/learning">
                Learning
            </a>

            <a href="/writeups">
                Writeups
            </a>

            <a href="/about">
                About
            </a>

        </div>


        <div class="nav-status">

            <span class="status-dot"></span>

            LAB ONLINE

        </div>

    </div>

</nav>


<main>

${content}

</main>


<footer class="footer">

    <div>

        <strong>
            YusifSecLab
        </strong>

        <span>
            • Web Security Training Environment
        </span>

    </div>


    <div class="footer-right">

        <span class="footer-dot"></span>

        LOCAL ENVIRONMENT

    </div>

</footer>


</body>
</html>
`;
}


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {

    res.send(page("Home", `

<section class="hero">

    <div class="hero-left">

        <div class="eyebrow">

            <span class="pulse"></span>

            WEB SECURITY / RED TEAM

        </div>


        <h1>

            Break.

            <span>
                Understand.
            </span>

            Secure.

        </h1>


        <p class="hero-text">

            A hands-on cybersecurity laboratory built to understand
            real-world web vulnerabilities through practical exploitation.

        </p>


        <div class="hero-actions">

            <a href="/labs" class="btn btn-primary">

                EXPLORE LABS

                <span>
                    →
                </span>

            </a>


            <a href="/writeups" class="btn btn-secondary">

                VIEW WRITEUPS

            </a>

        </div>


        <div class="hero-stats">

            <div class="stat">

                <strong>
                    06
                </strong>

                <span>
                    LABS
                </span>

            </div>


            <div class="stat">

                <strong>
                    01
                </strong>

                <span>
                    ACTIVE TARGET
                </span>

            </div>


            <div class="stat">

                <strong>
                    100%
                </strong>

                <span>
                    HANDS-ON
                </span>

            </div>

        </div>

    </div>


    <div class="hero-console">

        <div class="console-top">

            <div class="console-title">

                <span class="console-dot red"></span>
                <span class="console-dot yellow"></span>
                <span class="console-dot green"></span>

                <span class="console-name">
                    yusif@seclab:~
                </span>

            </div>


            <span class="console-live">
                LIVE
            </span>

        </div>


        <div class="console-body">

            <div class="terminal-line">

                <span class="green-text">
                    yusif@seclab
                </span>:<span class="blue-text">~</span>$ nmap -sV target.local

            </div>


            <div class="terminal-output">
                Starting Nmap scan...
            </div>


            <div class="terminal-output success">
                ✓ 80/tcp open http
            </div>


            <div class="terminal-output success">
                ✓ 3000/tcp open node
            </div>


            <div class="terminal-output">
                ✓ Database: SQLite
            </div>


            <br>


            <div class="terminal-line">

                <span class="green-text">
                    yusif@seclab
                </span>:<span class="blue-text">~</span>$ ./attack-surface

            </div>


            <div class="scan-bar">
                <span></span>
            </div>


            <div class="terminal-output warning">
                ! SQL Injection surface detected
            </div>


            <div class="terminal-output success">
                ✓ Target ready for testing
            </div>


            <div class="cursor-line">
                <span>█</span>
            </div>

        </div>


        <div class="console-footer">

            <span>HTTP</span>
            <span>SQLITE</span>
            <span>LINUX</span>
            <span>RED TEAM</span>

        </div>

    </div>

</section>


<section class="section">

    <div class="section-heading">

        <div>

            <span class="section-kicker">
                ATTACK SURFACE
            </span>

            <h2>
                Train against real vulnerabilities.
            </h2>

        </div>


        <a href="/labs" class="text-link">
            VIEW ALL LABS →
        </a>

    </div>


    <div class="feature-grid">


        <div class="feature-card">

            <div class="feature-number">
                01
            </div>

            <div class="feature-icon">
                ⌁
            </div>

            <h3>
                SQL Injection
            </h3>

            <p>
                Learn how unsafe database queries can be manipulated
                to expose hidden information.
            </p>

            <a href="/labs/database">
                LAUNCH →
            </a>

        </div>


        <div class="feature-card">

            <div class="feature-number">
                02
            </div>

            <div class="feature-icon">
                ‹›
            </div>

            <h3>
                Cross-Site Scripting
            </h3>

            <p>
                Understand how attacker-controlled input can reach
                the browser and execute as client-side code.
            </p>

            <a href="/labs/xss">
                COMING SOON →
            </a>

        </div>


        <div class="feature-card">

            <div class="feature-number">
                03
            </div>

            <div class="feature-icon">
                ◈
            </div>

            <h3>
                Access Control
            </h3>

            <p>
                Explore IDOR-style vulnerabilities and learn why
                authorization must be enforced server-side.
            </p>

            <a href="/labs/idor">
                COMING SOON →
            </a>

        </div>

    </div>

</section>


<section class="training-section">

    <div class="training-panel">

        <div class="training-content">

            <span class="section-kicker">
                TRAINING PATH
            </span>


            <h2>
                From first request<br>
                to exploitation.
            </h2>


            <p>
                Build your methodology step by step:
                reconnaissance, request analysis, exploitation,
                validation and documentation.
            </p>


            <a href="/learning" class="btn btn-primary">
                START LEARNING →
            </a>

        </div>


        <div class="training-steps">

            <div class="path-step active">

                <span>01</span>

                <div>
                    <strong>RECON</strong>
                    <small>Map the attack surface</small>
                </div>

            </div>


            <div class="path-line"></div>


            <div class="path-step">

                <span>02</span>

                <div>
                    <strong>ANALYZE</strong>
                    <small>Understand requests</small>
                </div>

            </div>


            <div class="path-line"></div>


            <div class="path-step">

                <span>03</span>

                <div>
                    <strong>EXPLOIT</strong>
                    <small>Validate the weakness</small>
                </div>

            </div>


            <div class="path-line"></div>


            <div class="path-step">

                <span>04</span>

                <div>
                    <strong>REPORT</strong>
                    <small>Document the finding</small>
                </div>

            </div>

        </div>

    </div>

</section>

`));

});


/* =========================
   LABS
========================= */

app.get("/labs", (req, res) => {

    const cards = labs.map(lab => {

        const locked = lab.status === "LOCKED";

        const labUrl =
            lab.id === "sqli"
                ? "/labs/database"
                : `/labs/${lab.id}`;

        return `

        <article class="lab-card ${locked ? "locked" : ""}">

            <div class="lab-card-top">

                <span class="lab-number">
                    ${lab.number}
                </span>

                <span class="lab-status ${lab.status.toLowerCase()}">
                    ${lab.status}
                </span>

            </div>


            <div class="lab-icon">
                ${lab.icon}
            </div>


            <div class="lab-meta">

                <span>
                    ${lab.category}
                </span>

                <span>
                    •
                </span>

                <span>
                    ${lab.difficulty}
                </span>

            </div>


            <h3>
                ${lab.title}
            </h3>


            <p>
                ${lab.short}
            </p>


            <div class="lab-bottom">

                <div class="progress">
                    <span></span>
                </div>


                ${
                    locked
                    ? `
                    <span class="locked-text">
                        LOCKED
                    </span>
                    `
                    : `
                    <a
                        href="${labUrl}"
                        class="launch-link"
                    >
                        LAUNCH →
                    </a>
                    `
                }

            </div>

        </article>

        `;

    }).join("");


    res.send(page("Labs", `

<section class="page-hero">

    <div>

        <span class="section-kicker">
            LAB CONTROL CENTER
        </span>


        <h1>

            Vulnerabilities.

            <span>
                Hands-on.
            </span>

        </h1>


        <p>
            Practice common web security vulnerabilities inside
            isolated local environments.
        </p>

    </div>


    <div class="target-status">

        <span class="status-dot"></span>

        TARGET ENVIRONMENT ONLINE

    </div>

</section>


<section class="dashboard-stats">

    <div>

        <span>
            AVAILABLE LABS
        </span>

        <strong>
            06
        </strong>

    </div>


    <div>

        <span>
            ACTIVE
        </span>

        <strong class="green-text">
            01
        </strong>

    </div>


    <div>

        <span>
            DIFFICULTY
        </span>

        <strong>
            3 LEVELS
        </strong>

    </div>


    <div>

        <span>
            ENVIRONMENT
        </span>

        <strong>
            ONLINE
        </strong>

    </div>

</section>


<section class="labs-grid">

    ${cards}

</section>

`));

});


/* =========================
   SQL INJECTION LAB
========================= */

app.get("/labs/database", (req, res) => {

    const category = req.query.category || "Gifts";

    /*
        INTENTIONALLY VULNERABLE LAB
        The parameter is deliberately inserted
        into the SQL query without parameterization.
    */

    const query = `
        SELECT *
        FROM products
        WHERE category = '${category}'
    `;

    const flag =
        "YSL{SQL_INJECTION_HIDDEN_DATA_RETRIEVED}";

    db.all(query, [], (err, rows) => {

        const labSolved =
            !err &&
            rows.some(
                row => row.name === "Secret Admin Toolkit"
            );

        let resultHtml = "";


        if (err) {

            resultHtml = `

                <div class="db-error">

                    <strong>
                        DATABASE ERROR
                    </strong>

                    <span>
                        ${escapeHtml(err.message)}
                    </span>

                </div>

            `;

        }


        else if (rows.length === 0) {

            resultHtml = `

                <div class="empty-result">

                    <span>
                        ∅
                    </span>

                    <strong>
                        No products returned.
                    </strong>

                    <small>
                        Try modifying the category parameter.
                    </small>

                </div>

            `;

        }


        else {

            resultHtml = `

                ${
                    labSolved
                    ? `
                    <div class="lab-solved">

                        <div class="solved-icon">
                            ✓
                        </div>

                        <div class="solved-content">

                            <strong>
                                LAB SOLVED
                            </strong>

                            <span>
                                SQL Injection vulnerability successfully exploited.
                            </span>

                            <code>
                                ${flag}
                            </code>

                        </div>

                    </div>
                    `
                    : ""
                }


                <div class="result-count">

                    <span>
                        QUERY RESULT
                    </span>

                    <strong>
                        ${rows.length} ROWS
                    </strong>

                </div>


                <div class="products">

                    ${
                        rows.map(row => `

                        <div class="product-row">

                            <div class="product-id">
                                #${row.id}
                            </div>


                            <div class="product-main">

                                <strong>
                                    ${escapeHtml(row.name)}
                                </strong>

                                <span>
                                    ${escapeHtml(row.category)}
                                </span>

                            </div>


                            <div class="product-release ${
                                row.released
                                    ? "released"
                                    : "hidden-release"
                            }">

                                ${
                                    row.released
                                        ? "RELEASED"
                                        : "HIDDEN"
                                }

                            </div>

                        </div>

                        `).join("")
                    }

                </div>

            `;

        }


        res.send(page("SQL Injection Lab", `

<section class="lab-hero">

    <div>

        <div class="breadcrumb">
            LABS / 01 / DATABASE INJECTION
        </div>


        <span class="section-kicker">
            WEB SECURITY LAB
        </span>


        <h1>

            SQL

            <span>
                Injection
            </span>

        </h1>


        <p>
            Manipulate an unsafe SQL query to retrieve data
            that should not normally be visible.
        </p>

    </div>


    <div class="difficulty-badge">

        <span class="status-dot"></span>

        EASY

    </div>

</section>


<div class="sqli-layout">


    <section class="target-panel">

        <div class="panel-header">

            <div>

                <span class="panel-label">
                    TARGET APPLICATION
                </span>

                <h2>
                    Product Search
                </h2>

            </div>


            <span class="online-badge">
                ● ONLINE
            </span>

        </div>


        <div class="target-url">

            <span>
                GET
            </span>

            <code>
                /labs/database?category=Gifts
            </code>

        </div>


        <form
            method="GET"
            action="/labs/database"
            class="attack-form"
        >

            <label for="category">
                CATEGORY PARAMETER
            </label>


            <div class="input-row">

                <input
                    id="category"
                    name="category"
                    value="${escapeHtml(category)}"
                    autocomplete="off"
                    placeholder="Enter category..."
                >


                <button type="submit">
                    SEND REQUEST →
                </button>

            </div>

        </form>


        <div class="response-panel">

            <div class="response-header">

                <span>
                    SERVER RESPONSE
                </span>

                <span>
                    200 OK
                </span>

            </div>


            ${resultHtml}

        </div>

    </section>


    <aside class="mission-panel">

        <div class="mission-header">

            <span class="section-kicker">
                MISSION 01
            </span>

            <span class="mission-status">
                ${labSolved ? "SOLVED" : "IN PROGRESS"}
            </span>

        </div>


        <h2>
            Retrieve hidden data.
        </h2>


        <p>
            The application builds an SQL query directly
            from the category parameter.
        </p>


        <div class="objective">

            <span>
                OBJECTIVE
            </span>

            <strong>
                ${
                    labSolved
                    ? "✓ Hidden Secret Admin Toolkit retrieved successfully."
                    : "Make the application return the hidden Secret Admin Toolkit."
                }
            </strong>

        </div>


        <div class="info-list">

            <div>

                <span>
                    TARGET
                </span>

                <strong>
                    Product Database
                </strong>

            </div>


            <div>

                <span>
                    DATABASE
                </span>

                <strong>
                    SQLite
                </strong>

            </div>


            <div>

                <span>
                    VULNERABILITY
                </span>

                <strong>
                    SQL Injection
                </strong>

            </div>


            <div>

                <span>
                    DIFFICULTY
                </span>

                <strong class="green-text">
                    EASY
                </strong>

            </div>

        </div>


        <div class="hint-box">

            <div class="hint-title">

                <span>
                    ?
                </span>

                HINT

            </div>


            <p>
                Think about how the value inside the
                category parameter reaches the SQL query.
            </p>

        </div>


        <div class="lab-objective-status">

            <div class="status-icon">
                ${labSolved ? "✓" : "⌁"}
            </div>


            <div>

                <strong>
                    ${labSolved ? "LAB SOLVED" : "ATTACK SURFACE READY"}
                </strong>

                <span>
                    ${
                        labSolved
                        ? "Hidden data successfully retrieved"
                        : "Parameter is controllable"
                    }
                </span>

            </div>

        </div>

    </aside>

</div>


<section class="query-inspector">

    <div class="inspector-header">

        <div>

            <span class="section-kicker">
                BACKEND INSPECTOR
            </span>

            <h2>
                Query Construction
            </h2>

        </div>


        <span class="warning-label">
            INTENTIONALLY VULNERABLE
        </span>

    </div>


    <div class="code-window">

        <div class="code-top">

            <span>
                server.js
            </span>

            <span>
                SQLITE / UNSAFE QUERY
            </span>

        </div>


        <pre><span class="code-keyword">const</span> category = req.query.category || <span class="code-string">"Gifts"</span>;

<span class="code-keyword">const</span> query = <span class="code-string">\`
    SELECT *
    FROM products
    WHERE category = '</span><span class="code-variable">\${category}</span><span class="code-string">'
\`</span>;</pre>

    </div>

</section>


<section class="lab-footer-nav">

    <a href="/labs">
        ← BACK TO LABS
    </a>

    <span>
        LAB 01 / 06
    </span>

    <span>
        YUSIFSECLAB
    </span>

</section>

`));

    });

});


/* =========================
   OTHER LABS
========================= */

app.get("/labs/:id", (req, res) => {

    const lab = labs.find(
        item => item.id === req.params.id
    );


    if (!lab) {

        return res.status(404).send(
            page("404", `

<section class="error-page">

    <span>
        404
    </span>

    <h1>
        Lab not found.
    </h1>

    <a
        href="/labs"
        class="btn btn-primary"
    >
        BACK TO LABS
    </a>

</section>

`)
        );

    }


    if (lab.id === "sqli") {

        return res.redirect("/labs/database");

    }


    res.send(page(lab.title, `

<section class="coming-page">

    <div class="coming-icon">
        ${lab.icon}
    </div>


    <span class="section-kicker">
        LAB ${lab.number}
    </span>


    <h1>
        ${lab.title}
    </h1>


    <p>
        ${lab.short}
    </p>


    <div class="coming-status">

        <span class="status-dot"></span>

        LAB UNDER DEVELOPMENT

    </div>


    <a
        href="/labs"
        class="btn btn-primary"
    >
        ← BACK TO LABS
    </a>

</section>

`));

});


/* =========================
   LEARNING
========================= */

app.get("/learning", (req, res) => {

    res.send(page("Learning", `

<section class="page-hero">

    <div>

        <span class="section-kicker">
            KNOWLEDGE BASE
        </span>


        <h1>

            Learn the

            <span>
                methodology.
            </span>

        </h1>


        <p>
            Understand how security researchers approach
            web applications from reconnaissance to reporting.
        </p>

    </div>

</section>


<section class="learning-grid">

    <div class="learning-card">

        <span>01</span>

        <h2>
            HTTP Fundamentals
        </h2>

        <p>
            Requests, responses, headers, cookies, methods,
            status codes and parameters.
        </p>

    </div>


    <div class="learning-card">

        <span>02</span>

        <h2>
            Web Reconnaissance
        </h2>

        <p>
            Identify technologies, endpoints, parameters
            and potential attack surfaces.
        </p>

    </div>


    <div class="learning-card">

        <span>03</span>

        <h2>
            OWASP Top 10
        </h2>

        <p>
            Build a practical understanding of common
            web application vulnerabilities.
        </p>

    </div>


    <div class="learning-card">

        <span>04</span>

        <h2>
            Burp Suite
        </h2>

        <p>
            Intercept, modify and replay HTTP requests
            during web security testing.
        </p>

    </div>

</section>

`));

});


/* =========================
   WRITEUPS
========================= */

app.get("/writeups", (req, res) => {

    res.send(page("Writeups", `

<section class="page-hero">

    <div>

        <span class="section-kicker">
            RESEARCH LOG
        </span>


        <h1>

            Attack.

            <span>
                Document.
            </span>

            Learn.

        </h1>


        <p>
            Practical notes and vulnerability writeups
            from YusifSecLab research.
        </p>

    </div>

</section>


<section class="writeup-list">

    <article class="writeup-card">

        <div class="writeup-number">
            01
        </div>


        <div class="writeup-main">

            <span>
                SQL INJECTION • EASY
            </span>


            <h2>
                Retrieving hidden data with SQL Injection
            </h2>


            <p>
                How an unsafe category parameter can be manipulated
                to alter the backend SQL query.
            </p>

        </div>


        <div class="writeup-arrow">
            →
        </div>

    </article>


    <article class="writeup-card muted">

        <div class="writeup-number">
            02
        </div>


        <div class="writeup-main">

            <span>
                XSS • EASY
            </span>


            <h2>
                Coming soon
            </h2>


            <p>
                Reflected input and client-side execution.
            </p>

        </div>


        <div class="writeup-arrow">
            +
        </div>

    </article>

</section>

`));

});


/* =========================
   ABOUT
========================= */

app.get("/about", (req, res) => {

    res.send(page("About", `

<section class="about-page">

    <div class="about-badge">
        &gt;_ YSL
    </div>


    <span class="section-kicker">
        ABOUT THE PROJECT
    </span>


    <h1>

        Built to

        <span>
            break things safely.
        </span>

    </h1>


    <p class="about-text">

        YusifSecLab is a personal cybersecurity laboratory
        designed for learning web application security through
        controlled, intentionally vulnerable environments.

    </p>


    <div class="about-grid">

        <div>

            <span>
                FOCUS
            </span>

            <strong>
                Web Security
            </strong>

        </div>


        <div>

            <span>
                TRACK
            </span>

            <strong>
                Red Team
            </strong>

        </div>


        <div>

            <span>
                ENVIRONMENT
            </span>

            <strong>
                Local Lab
            </strong>

        </div>


        <div>

            <span>
                MISSION
            </span>

            <strong>
                Learn by Doing
            </strong>

        </div>

    </div>

</section>

`));

});


/* =========================
   404
========================= */

app.use((req, res) => {

    res.status(404).send(page("404", `

<section class="error-page">

    <span class="error-code">
        404
    </span>


    <h1>
        Target not found.
    </h1>


    <p>
        The requested endpoint does not exist
        in this environment.
    </p>


    <a
        href="/"
        class="btn btn-primary"
    >
        RETURN HOME →
    </a>

</section>

`));

});


/* =========================
   SERVER
========================= */

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("======================================");
    console.log("       YusifSecLab is ONLINE");
    console.log("======================================");
    console.log(`   Port: ${PORT}`);
    console.log("   Database: SQLite");
    console.log("   SQL Injection Lab: ACTIVE");
    console.log("======================================");
    console.log("");

});