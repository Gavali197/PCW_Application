const express = require("express");
const dbConnect = require("./utils/Db");
const Session = require("express-session");
require("dotenv").config();

// 1. Import your routes
const userRoutes = require("./routes/userRoutes"); 
const profileRoute = require("./routes/profileRoute");
const JobDrive = require("./routes/JobDriveRoute")
const Company = require("./routes/CompanyRoute")
const auditLogRoutes = require("./routes/AuditLogRoute")

const app = express();
const PORT = process.env.PORT || 3030;

dbConnect();

// 2. Global Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(Session({
    secret : process.env.SESSION_SECRET || "GameOfThrons",
    resave: false,
    saveUninitialized : true
}));

// 3. Mount Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/jobs", JobDrive);
app.use("/api/v1/companies", Company);
app.use("/api/v1/audit-logs", auditLogRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});