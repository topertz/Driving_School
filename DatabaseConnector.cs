using System;
using System.IO;
using System.Data.SQLite;

namespace School_Driving.Controllers
{
    public static class DatabaseConnector
    {
        private static SQLiteConnection? conn;

        public static SQLiteConnection Db()
        {
            if (conn == null)
            {
                // A projekt gyökérkönyvtárának biztonságos meghatározása
                string? projectRoot = GetProjectRoot();

                if (projectRoot == null)
                {
                    throw new InvalidOperationException("Nem sikerült meghatározni a projekt gyökérkönyvtárát!");
                }

                string dbPath = Path.Combine(projectRoot, "database", "UserDB.sqlite3");

                if (!File.Exists(dbPath))
                {
                    Console.WriteLine("HIBA: Az adatbázis fájl nem található!");
                    throw new FileNotFoundException("Az adatbázis nem található a megadott helyen.", dbPath);
                }

                conn = new SQLiteConnection($"Data Source={dbPath}");
                conn.Open();
            }
            else if (conn.State == System.Data.ConnectionState.Closed)
            {
                conn.Open();
            }

            return conn;
        }

        public static SQLiteConnection CreateNewConnection()
        {
            string? projectRoot = GetProjectRoot();

            if (projectRoot == null)
            {
                throw new InvalidOperationException("Nem sikerült meghatározni a projekt gyökérkönyvtárát!");
            }

            string dbPath = Path.Combine(projectRoot, "database", "UserDB.sqlite3");

            var conn = new SQLiteConnection($"Data Source={dbPath}");
            conn.Open();
            return conn;
        }

        private static string? GetProjectRoot()
        {
            // A jelenlegi futtatási könyvtár
            string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
            DirectoryInfo? dir = new DirectoryInfo(baseDirectory);

            // Három szinttel feljebb lépés (ha lehetséges)
            for (int i = 0; i < 3; i++)
            {
                if (dir?.Parent == null) return null;
                dir = dir.Parent;
            }

            return dir?.FullName;
        }
    }
}