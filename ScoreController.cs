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
    }
}