using System.Data.SqlClient;
using my_app.Models;
using my_app.Services.Interfaces;
using Dapper;
using Microsoft.Extensions.Configuration;
using my_app.Models.Enums;

namespace my_app.Services
{
    public class TimeService : ITimeService
    {
        private readonly IConfiguration _configuration;
        private readonly IPlayerService _playerService;

        public TimeService(IConfiguration configuration, IPlayerService playerService)
        {
            _configuration = configuration;
            _playerService = playerService;
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(_configuration.GetSection("ConnectionStrings")["MKWLeaderboard"]);
        }

        public async Task<Time> Insert(Time time)
        {
            DateTime minDate = DateTime.Parse("2008-04-09");

            if(time.Date < minDate) {
                time.Date = null;
            }

            var oldTime = await GetExistingTime(time.PlayerId, time.Track, time.Glitch, time.Flap);
            await Obsolete(oldTime.Id);

            string sqlQuery = "INSERT INTO Times (PlayerId, Date, Track, Glitch, Flap, Minutes, Seconds, Milliseconds, Link, Ghost)" +
            "VALUES (@PlayerId, @Date, @Track, @Glitch, @Flap, @Minutes, @Seconds, @Milliseconds, @Link, @Ghost)";


            using var connection = GetConnection();
            return await GetById(await connection.ExecuteAsync(sqlQuery, time));
        }

        public async Task<Time> Edit(Time time)
        {
            string sqlQuery = "UPDATE Times SET Date = @Date, Glitch = @Glitch, Flap = @Flap, Minutes = @Minutes, Seconds = @Seconds, Milliseconds = @Milliseconds, Link = @Link, Ghost = @Ghost WHERE Id = @Id";

            using var connection = GetConnection();
            await connection.ExecuteAsync(sqlQuery, time);

            return await GetById(time.Id);
        }

        public async Task<Time> Obsolete(int id)
        {
            string sqlQuery = "UPDATE Times SET Obsoleted = 1 WHERE Id = @Id";

            using var connection = GetConnection();
            await connection.ExecuteAsync(sqlQuery, new { Id = id });

            return await GetById(id);
        }

        public async Task<Time> Delete(int id)
        {
            string sqlQuery = "UPDATE Times SET DeletedAt = @DeletedAt WHERE Id = @Id";

            using var connection = GetConnection();
            await connection.ExecuteAsync(sqlQuery, new { Id = id, DeletedAt = DateTime.Now });

            return await GetById(id);
        }

        public async Task<Time> GetById(int id)
        {
            string sqlQuery = "SELECT * FROM Times WHERE Id = @Id";

            using var connection = GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Time>(sqlQuery, new { Id = id });
        }

        public async Task<TimeSheet> GetFullTimeSheet(int playerId)
        {
            return new TimeSheet(playerId, await GetNGByPlayerId(playerId), await GetGByPlayerId(playerId), await GetNGFlapByPlayerId(playerId), await GetGFlapByPlayerId(playerId));
        }

        public async Task<TimeSheet> GetNGTimeSheet(int playerId)
        {
            return new TimeSheet(playerId, await GetNGByPlayerId(playerId), new List<Time>(), await GetNGFlapByPlayerId(playerId), new List<Time>());
        }

        public async Task<TimeSheet> GetGTimeSheet(int playerId)
        {
            return new TimeSheet(playerId, new List<Time>(), await GetGByPlayerId(playerId), new List<Time>(), await GetGFlapByPlayerId(playerId));
        }

        public async Task<TimeSheet> Get3LapTimeSheet(int playerId)
        {
            return new TimeSheet(playerId, await GetNGByPlayerId(playerId), await GetGByPlayerId(playerId), new List<Time>(), new List<Time>());
        }

        public async Task<TimeSheet> GetFlapTimeSheet(int playerId)
        {
            return new TimeSheet(playerId, new List<Time>(), new List<Time>(), await GetNGFlapByPlayerId(playerId), await GetGFlapByPlayerId(playerId));
        }

        public async Task<IEnumerable<Time>> GetNGByPlayerId(int playerId)
        {
            string sqlQuery = "SELECT * FROM Times WHERE PlayerId = @PlayerId AND Glitch = 0 AND Flap = 0 AND Obsoleted = 0";

            using var connection = GetConnection();
            return await connection.QueryAsync<Time>(sqlQuery, new { PlayerId = playerId });
        }

        public async Task<IEnumerable<Time>> GetAllByPlayerId(int playerId)
        {
            string sqlQuery = "SELECT * FROM Times WHERE PlayerId = @PlayerId AND Glitch = 0 AND Flap = 0 AND Obsoleted = 0";

            using var connection = GetConnection();
            return await connection.QueryAsync<Time>(sqlQuery, new { PlayerId = playerId });
        }

        public async Task<IEnumerable<Time>> GetGByPlayerId(int playerId)
        {
            string sqlQuery = "SELECT * FROM Times WHERE PlayerId = @PlayerId AND Glitch = 1 AND Flap = 0 AND Obsoleted = 0";

            using var connection = GetConnection();
            return await connection.QueryAsync<Time>(sqlQuery, new { PlayerId = playerId });
        }

        public async Task<IEnumerable<Time>> GetNGFlapByPlayerId(int playerId)
        {
            string sqlQuery = "SELECT * FROM Times WHERE PlayerId = @PlayerId AND Glitch = 0 AND Flap = 1 AND Obsoleted = 0";

            using var connection = GetConnection();
            return await connection.QueryAsync<Time>(sqlQuery, new { PlayerId = playerId });
        }

        public async Task<IEnumerable<Time>> GetGFlapByPlayerId(int playerId)
        {
            string sqlQuery = "SELECT * FROM Times WHERE PlayerId = @PlayerId AND Glitch = 1 AND Flap = 1 AND Obsoleted = 0";

            using var connection = GetConnection();
            return await connection.QueryAsync<Time>(sqlQuery, new { PlayerId = playerId });
        }

        public async Task<IEnumerable<Time>> GetAll()
        {
            string sqlQuery = "SELECT * FROM Times WHERE DeletedAt IS NULL AND Obsoleted = 0";

            using var connection = GetConnection();
            return await connection.QueryAsync<Time>(sqlQuery);
        }

        public async Task<Time> GetExistingTime(int playerId, Track track, bool glitch, bool flap)
        {
            string sqlQuery = "SELECT * FROM Times WHERE PlayerId = @PlayerId AND Track = @Track AND Glitch = @Glitch AND Flap = @Flap AND Obsoleted = 0 AND DeletedAt IS NULL";

            using var connection = GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Time>(sqlQuery, new { PlayerId = playerId, Track = track, Glitch = glitch, Flap = flap});
        }

        public async Task<IEnumerable<Time>> GetTimeHistory(int playerId, Track track, bool glitch, bool flap)
        {
            string sqlQuery = "SELECT * FROM Times WHERE PlayerId = @PlayerId AND Track = @Track AND Glitch = @Glitch AND Flap = @Flap AND DeletedAt IS NULL ORDER BY Date DESC";

            using var connection = GetConnection();
            return await connection.QueryAsync<Time>(sqlQuery, new { PlayerId = playerId, Track = track, Glitch = glitch, Flap = flap});
        }

        public async Task<IEnumerable<LeaderBoardTimeEntry>> GetTop10(Track track, bool glitch, bool flap)
        {
            string sqlQuery = "SELECT TOP 15 * FROM Times WHERE Track = @Track AND Glitch = @Glitch AND Flap = @Flap AND Obsoleted = 0 AND DeletedAt IS NULL ORDER BY Minutes, Seconds, Milliseconds";

            using var connection = GetConnection();
            var top15 = await connection.QueryAsync<Time>(sqlQuery, new { Track = track, Glitch = glitch, Flap = flap});

            //return ng if there are no glitch times
            if(glitch && !top15.Any()) {
                return await GetTop10(track, false, flap);
            }

            //if category is glitch, mix together the fastest ng times on that track from people that don't have a glitch time, and pick out the fastest from the mix
            if(glitch)
            {
                var ngQuery = "SELECT TOP 15 * FROM Times WHERE Track = @Track AND Glitch = @Glitch AND Flap = @Flap AND Obsoleted = 0 AND DeletedAt IS NULL AND PlayerId NOT IN @GlitchTimeIds ORDER BY Minutes, Seconds, Milliseconds";
                var ngTops = await connection.QueryAsync<Time>(ngQuery, new { Track = track, Glitch = false, Flap = flap, GlitchTimeIds = top15.Select(t => t.PlayerId)});
                top15.AsList().AddRange(ngTops);
                top15.AsList().Sort(CompareTimes);
            }

            var result = new List<LeaderBoardTimeEntry>();
            var times = new List<Time>();

            for(int i=0; i<10; i++)
            {
                times.Add(top15.AsList()[i]);
            }

            for(int i=10; i<15; i++)
            {
                if(TimesAreEqual(times.Last(), top15.AsList()[i]))
                {
                    times.Add(top15.AsList()[i]);
                }
            }

            foreach (var time in times)
            {
                result.Add(new LeaderBoardTimeEntry(time, await _playerService.GetById(time.PlayerId)));
            }

            return result;
        }

        private static bool TimesAreEqual(Time time1, Time time2)
        {
            return time1.Milliseconds.Equals(time2.Milliseconds) && time1.Seconds.Equals(time2.Seconds) && time1.Minutes.Equals(time2.Minutes);
        }

        private static int CompareTimes(Time time2, Time time1)
        {
            //compare by minutes
            if(time2.Minutes > time1.Minutes)
            {
                return 1;
            }
            else if(time1.Minutes > time2.Minutes)
            {
                return -1;
            }
            //if that is the same, compare by seconds
            else
            {
                if(time2.Seconds > time1.Seconds)
                {
                    return 1;
                }
                else if(time1.Seconds > time2.Seconds)
                {
                    return -1;
                }
                //if that is the same, compare by milliseconds
                else
                {
                    if(time2.Milliseconds > time1.Milliseconds)
                    {
                        return 1;
                    }
                    if(time1.Milliseconds > time2.Milliseconds)
                    {
                        return -1;
                    }
                    //if that is the same, compare by which time was first
                    else
                    {
                        if(time2.Date < time1.Date)
                        {
                            return 1;
                        }
                        if(time1.Date < time2.Date)
                        {
                            return -1;
                        }
                        //if even that is the same, sort by player id (this will always be different)
                        else
                        {
                            if(time2.PlayerId < time1.PlayerId)
                            {
                                return 1;
                            }
                            if(time1.PlayerId < time2.PlayerId)
                            {
                                return -1;
                            }
                        }
                    }
                }
            }
            //failsafe
            return 1;
        }
    }
}