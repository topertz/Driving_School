using School_Driving.Controllers;
using System.Data.SQLite;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.MapGet("/", () => Results.Redirect("/index.html"));
SQLiteConnection connection = DatabaseConnector.Db();
SQLiteCommand command = connection.CreateCommand();
command.CommandText = "PRAGMA foreign_keys = ON;" +
    "CREATE TABLE if not Exists `Question` " +
    "(`QuestionID` integer PRIMARY KEY, `Question` text not NULL, `Option1` text not NULL, `Option2` text not NULL, `Option3` text NOT NULL, " +
    "`Answer` text not NULL, `Points` integer not NULL, `Image` text not NULL); " +
    "CREATE TABLE if not Exists `Score` " +
    "(`ScoreID` integer PRIMARY KEY, `Username` text not NULL, `ScoreValue` integer not NULL, `TotalPoints` integer not NULL, Timestamp datetime NOT NULL); ";
command.ExecuteNonQuery();
command.Dispose();
app.Run();