using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

namespace School_Driving.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class HelpController : Controller
    {
        [HttpGet]
        public IActionResult GetHelpItems(string category)
        {
            var helpItems = new List<HelpItem>();

            try
            {
                using (SQLiteConnection connection = DatabaseConnector.CreateNewConnection())
                {
                    string selectSql = "SELECT Title, Description, Image FROM Help WHERE Category = @Category";
                    using (SQLiteCommand selectCmd = new SQLiteCommand(selectSql, connection))
                    {
                        selectCmd.Parameters.AddWithValue("@Category", category);
                        using (var reader = selectCmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                helpItems.Add(new HelpItem
                                {
                                    Title = reader.GetString(0),
                                    Description = reader.GetString(1),
                                    Image = reader.IsDBNull(2) ? "" : reader.GetString(2)
                                });
                            }
                        }
                    }
                }
                return Ok(helpItems);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}