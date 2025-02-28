using School_Driving.Controllers;
using System;
using System.Data.SQLite;

public class SessionManager
{
    public static string CreateSession(Int64 UserID)
    {
        SQLiteConnection connection = DatabaseConnector.Db();
        string sessionCookie;

        do
        {
            sessionCookie = Guid.NewGuid().ToString();
        } while (SessionCookieExists(sessionCookie, connection));

        Int64 validUntil = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + 3600;

        string insertSql = "INSERT INTO Session (SessionCookie, UserID, ValidUntil, LoginTime) VALUES (@SessionCookie, @UserID, @ValidUntil, @LoginTime)";
        using (SQLiteCommand cmd = new SQLiteCommand(insertSql, connection))
        {
            cmd.Parameters.AddWithValue("@SessionCookie", sessionCookie);
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@ValidUntil", validUntil);
            cmd.Parameters.AddWithValue("@LoginTime", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
            cmd.ExecuteNonQuery();
        }

        return sessionCookie;
    }

    // Tries to create a session for the user
    public static bool TryCreateSession(Int64 UserID, out string? sessionCookie)
    {
        SQLiteConnection connection = DatabaseConnector.Db();
        sessionCookie = null;
        bool loginSuccessful = false;

        try
        {
            // Generate a unique session cookie
            do
            {
                sessionCookie = Guid.NewGuid().ToString();
            } while (SessionCookieExists(sessionCookie, connection));

            Int64 attemptTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            loginSuccessful = true; // Assume the session creation is successful

            // Insert the session into the database
            string insertSql = "INSERT INTO LoginAttempt (SessionCookie, UserID, AttemptTime, Success) VALUES (@SessionCookie, @UserID, @AttemptTime, @Success)";
            using (SQLiteCommand cmd = new SQLiteCommand(insertSql, connection))
            {
                cmd.Parameters.AddWithValue("@SessionCookie", sessionCookie);
                cmd.Parameters.AddWithValue("@UserID", UserID);
                cmd.Parameters.AddWithValue("@AttemptTime", attemptTime);
                cmd.Parameters.AddWithValue("@Success", loginSuccessful ? 1 : 0);
                cmd.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Exception occurred: " + ex.Message);
            // Log the exception for further analysis
            loginSuccessful = false;
        }

        return loginSuccessful;
    }

    // Logs a failed login attempt
    public static void LogFailedAttempt(Int64 UserID)
    {
        SQLiteConnection connection = DatabaseConnector.Db();
        string sessionCookie = Guid.NewGuid().ToString(); // Generate a dummy session cookie

        try
        {
            Int64 attemptTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            // Insert the failed attempt into the database
            string insertSql = "INSERT INTO LoginAttempt (SessionCookie, UserID, AttemptTime, Success) VALUES (@SessionCookie, @UserID, @AttemptTime, @Success)";
            using (SQLiteCommand cmd = new SQLiteCommand(insertSql, connection))
            {
                cmd.Parameters.AddWithValue("@SessionCookie", sessionCookie);
                cmd.Parameters.AddWithValue("@UserID", UserID);
                cmd.Parameters.AddWithValue("@AttemptTime", attemptTime);
                cmd.Parameters.AddWithValue("@Success", 0); // Log failure
                cmd.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Exception occurred: " + ex.Message);
            // Log the exception for further analysis
        }
    }

    // Handles user login
    public static bool Login(string username, string password, out string? sessionCookie)
    {
        sessionCookie = null;
        bool isAuthenticated = false;
        Int64 userID = GetUserIDByUsername(username);

        if (userID == -1)
        {
            // User does not exist
            LogFailedAttempt(userID);
            return false;
        }

        // Here you would check the password (omitted for simplicity)
        // For example: isAuthenticated = CheckPassword(username, password);

        if (isAuthenticated)
        {
            // Create a new session if authentication is successful
            return TryCreateSession(userID, out sessionCookie);
        }
        else
        {
            // Log the failed attempt if authentication fails
            LogFailedAttempt(userID);
            return false;
        }
    }

    // Invalidates all sessions for a specific user
    public static string InvalidateAllSessions(Int64 UserID)
    {
        SQLiteConnection connection = DatabaseConnector.Db();
        string deleteSql = "DELETE FROM LoginAttempt WHERE UserID = @UserID";
        using (SQLiteCommand cmd = new SQLiteCommand(deleteSql, connection))
        {
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.ExecuteNonQuery();
        }
        return "All sessions invalidated for UserID: " + UserID;
    }

    // Invalidates a specific session by its cookie
    public static string InvalidateSession(string SessionCookie)
    {
        SQLiteConnection connection = DatabaseConnector.CreateNewConnection();
        string deleteSql = "DELETE FROM LoginAttempt WHERE SessionCookie = @SessionCookie";
        using (SQLiteCommand cmd = new SQLiteCommand(deleteSql, connection))
        {
            cmd.Parameters.AddWithValue("@SessionCookie", SessionCookie);
            cmd.ExecuteNonQuery();
        }
        return "Session invalidated for SessionCookie: " + SessionCookie;
    }

    // Retrieves the UserID associated with a given session cookie
    public static Int64 GetUserID(string SessionCookie)
    {
        SQLiteConnection connection = DatabaseConnector.Db();

        string selectSql = "SELECT UserID FROM LoginAttempt WHERE SessionCookie = @SessionCookie";

        using (SQLiteCommand cmd = new SQLiteCommand(selectSql, connection))
        {
            cmd.Parameters.AddWithValue("@SessionCookie", SessionCookie);

            try
            {
                object result = cmd.ExecuteScalar();
                if (result != null)
                    return Convert.ToInt64(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception occurred: " + ex.Message);
                // Log the exception for further analysis
            }
        }
        return -1; // Return -1 to indicate that no user ID was found
    }

    // Checks if a session cookie already exists
    private static bool SessionCookieExists(string sessionCookie, SQLiteConnection connection)
    {
        string selectSql = "SELECT COUNT(*) FROM LoginAttempt WHERE SessionCookie = @SessionCookie";

        using (SQLiteCommand cmd = new SQLiteCommand(selectSql, connection))
        {
            cmd.Parameters.AddWithValue("@SessionCookie", sessionCookie);

            try
            {
                object result = cmd.ExecuteScalar();
                if (result != null && Convert.ToInt64(result) > 0)
                    return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception occurred: " + ex.Message);
                // Log the exception for further analysis
            }
        }
        return false;
    }

    // Retrieves the UserID based on the username (example placeholder method)
    private static Int64 GetUserIDByUsername(string username)
    {
        // Dummy implementation - replace with actual logic
        return -1; // Return -1 if user not found
    }
}