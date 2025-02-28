public class Question
{
    public int QuestionID { get; set; }
    public string? QuestionText { get; set; }
    public List<string>? Options { get; set; }
    public string? Answer { get; set; }
    public int Points { get; set; }
    public string? Image { get; set; }
    public string? Category { get; set; }
}