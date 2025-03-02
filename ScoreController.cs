using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace School_Driving.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ScoreController : Controller
    {
        [HttpGet]
        public IActionResult GetScore()
        {
            var scores = new List<Score>();

            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string selectSql = "SELECT ScoreID, Username, ScoreValue, TotalPoints, Percentage, Timestamp FROM Score";
                    using (SQLiteCommand selectCmd = new SQLiteCommand(selectSql, connection))
                    {
                        using (var reader = selectCmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Score data = new Score
                                {
                                    ScoreID = reader.GetInt32(0),
                                    Username = reader.GetString(1),
                                    ScoreValue = reader.GetInt32(2),
                                    TotalPoints = reader.GetInt32(3),
                                    Percentage = reader.GetDouble(4),
                                    Timestamp = reader.GetDateTime(5)
                                };
                                scores.Add(data);
                            }
                        }
                    }
                }
                return Ok(new { scores });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public IActionResult PostScore([FromForm] string username, [FromForm] int scoreValue, [FromForm] int totalPoints, [FromForm] double percentage)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest("Invalid data! Username cannot be empty.");
            }

            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string insertSql = "INSERT INTO Score (Username, ScoreValue, TotalPoints, Percentage, Timestamp) VALUES (@Username, @ScoreValue, @TotalPoints, @Percentage, @Timestamp)";
                    using (SQLiteCommand cmd = new SQLiteCommand(insertSql, connection))
                    {
                        cmd.Parameters.AddWithValue("@Username", username);
                        cmd.Parameters.AddWithValue("@ScoreValue", scoreValue);
                        cmd.Parameters.AddWithValue("@TotalPoints", totalPoints);
                        cmd.Parameters.AddWithValue("@Percentage", percentage);
                        cmd.Parameters.AddWithValue("@Timestamp", DateTime.UtcNow);
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok("Score saved successfully");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public IActionResult PostDeleteScore()
        {
            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string deleteSql = "DELETE FROM Score";

                    using (SQLiteCommand cmd = new SQLiteCommand(deleteSql, connection))
                    {
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { success = true, message = "Minden eredmény sikeresen törölve lett." });
                        }
                        else
                        {
                            return Ok(new { success = false, message = "Nincsenek törölhetõ eredmények." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Hiba történt: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Szerverhiba történt." });
            }
        }

        [HttpPost]
        public IActionResult PostDeleteScoreByUser([FromForm] string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest(new { success = false, message = "Érvénytelen felhasználónév!" });
            }

            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string deleteSql = "DELETE FROM Score WHERE Username = @Username";

                    using (SQLiteCommand cmd = new SQLiteCommand(deleteSql, connection))
                    {
                        cmd.Parameters.AddWithValue("@Username", username);
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { success = true, message = $"A(z) {username} felhasználó összes eredménye sikeresen törölve lett." });
                        }
                        else
                        {
                            return Ok(new { success = false, message = $"Nem található eredmény a(z) {username} felhasználónév alapján." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Hiba történt: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Szerverhiba történt." });
            }
        }
    }
}