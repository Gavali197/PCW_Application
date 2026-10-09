const express = require("express");
const dbConnect = require("./utils/Db");
const Session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3030;

// CORS
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true
}));

// Connect database
dbConnect();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(Session({
    secret: process.env.SESSION_SECRET || "GameOfThrons",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        sameSite: "lax"
    }
}));

// Routes
const userRoutes = require("./routes/UserRoute");
const profileRoute = require("./routes/profileRoute");
const JobDrive = require("./routes/JobDriveRoute");
const Company = require("./routes/CompanyRoute");
const auditLogRoutes = require("./routes/AuditLogRoute");
const applicationRoutes = require("./routes/ApplicationRoute");
const notification = require("./routes/NotificationRoute");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/jobs", JobDrive);
app.use("/api/v1/companies", Company);
app.use("/api/v1/auditLogs", auditLogRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/notifications", notification);
// Mount the route
app.use("/api/v1/analytics", analyticsRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});