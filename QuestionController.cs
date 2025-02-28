using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace School_Driving.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class QuestionController : Controller
    {
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = new List<string>();

            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string selectSql = "SELECT DISTINCT Category FROM Question";
                    using (SQLiteCommand selectCmd = new SQLiteCommand(selectSql, connection))
                    {
                        using (var reader = selectCmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                if (!reader.IsDBNull(0))
                                {
                                    categories.Add(reader.GetString(0));
                                }
                            }
                        }
                    }
                }
                return Ok(categories);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        public IActionResult GetQuestions()
        {
            var questions = new List<Question>();

            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string selectSql = "SELECT QuestionID, Question, Option1, Option2, Option3, Answer, Points, Image, Category FROM Question";
                    using (SQLiteCommand selectCmd = new SQLiteCommand(selectSql, connection))
                    {
                        using (var reader = selectCmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Question q = new Question
                                {
                                    QuestionID = reader.GetInt32(0),
                                    QuestionText = reader.GetString(1),
                                    Options = new List<string>
                                    {
                                        reader.GetString(2),
                                        reader.GetString(3),
                                        reader.GetString(4)
                                    },
                                    Answer = reader.GetString(5),
                                    Points = reader.GetInt32(6),
                                    Image = reader.IsDBNull(7) ? "" : reader.GetString(7),
                                    Category = reader.IsDBNull(8) ? "" : reader.GetString(8)
                                };
                                questions.Add(q);
                            }
                        }
                    }
                }
                return Ok(questions);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public IActionResult AddQuestion([FromForm] string questionText, [FromForm] string option1, [FromForm] string option2, [FromForm] string option3, [FromForm] string answer, [FromForm] int points, [FromForm] string? image, [FromForm] string category)
        {
            if (string.IsNullOrWhiteSpace(questionText) || string.IsNullOrWhiteSpace(option1) || string.IsNullOrWhiteSpace(option2) || string.IsNullOrWhiteSpace(option3) || string.IsNullOrWhiteSpace(answer))
            {
                return BadRequest("Invalid question data.");
            }

            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string insertSql = "INSERT INTO Question (Question, Option1, Option2, Option3, Answer, Points, Image, Category) VALUES (@Question, @Option1, @Option2, @Option3, @Answer, @Points, @Image, @Category)";
                    using (SQLiteCommand cmd = new SQLiteCommand(insertSql, connection))
                    {
                        cmd.Parameters.AddWithValue("@Question", questionText);
                        cmd.Parameters.AddWithValue("@Option1", option1);
                        cmd.Parameters.AddWithValue("@Option2", option2);
                        cmd.Parameters.AddWithValue("@Option3", option3);
                        cmd.Parameters.AddWithValue("@Answer", answer);
                        cmd.Parameters.AddWithValue("@Points", points);
                        cmd.Parameters.AddWithValue("@Image", string.IsNullOrWhiteSpace(image) ? "" : image);
                        cmd.Parameters.AddWithValue("@Category", category);
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok("Question added successfully.");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}