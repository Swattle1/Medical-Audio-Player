using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.StaticFiles;

namespace MedicalAudioPlayerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConsultationsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ConsultationsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("folders")]
        public IActionResult GetConsultationFolders()
        {
            var testFilesPath = Path.Combine(_env.ContentRootPath, "../test-files");

            if (!Directory.Exists(testFilesPath))
            {
                return NotFound("The file directory does not exist.");
            }

            var directories = Directory.GetDirectories(testFilesPath).Select(Path.GetFileName);
            return Ok(directories);
        }

        [HttpGet("utterances/{folder}")]
        public IActionResult GetUtterances(string folder, [FromQuery] string convParty = "Doctor - Patient")
        {
            // Change this to the correct path to your consultation folders
            var folderPath = Path.GetFullPath(Path.Combine(_env.ContentRootPath, "../test-files", folder));

            Console.WriteLine($"Resolved folder path: {folderPath}");

            if (!Directory.Exists(folderPath))
            {
                return NotFound($"The folder '{folder}' does not exist.");
            }

            var partyMap = new Dictionary<string, string[]>
            {
                { "Doctor - Patient", new[] { "doctor-utterances", "patient-utterances" } },
                { "Doctor - Robot - Patient", new[] { "doctor-utterances", "robot-utterances", "patient-utterances" } },
                { "Robot - Patient", new[] { "robot-utterances", "patient-utterances" } }
            };

            var utteranceFolders = partyMap.ContainsKey(convParty) ? partyMap[convParty] : new[] { "doctor-utterances", "robot-utterances", "patient-utterances" };
            var utterances = new List<(string Speaker, string FilePath, int TurnNumber)>();

            foreach (var utteranceFolder in utteranceFolders)
            {
                var utterancePath = Path.Combine(folderPath, utteranceFolder);
                if (Directory.Exists(utterancePath))
                {
                    var files = Directory.GetFiles(utterancePath, "*.wav", SearchOption.TopDirectoryOnly);

                    foreach (var file in files)
                    {
                        var fileName = Path.GetFileNameWithoutExtension(file);
                        var parts = fileName.Split(new[] { '_' }, StringSplitOptions.RemoveEmptyEntries);
                        var turnPart = parts.LastOrDefault(p => p.StartsWith("turn", StringComparison.OrdinalIgnoreCase));

                        if (turnPart != null && int.TryParse(turnPart.Substring(4), out int turnNumber))
                        {
                            utterances.Add((utteranceFolder.Replace("-utterances", ""), file, turnNumber));
                        }
                    }
                }
                else
                {
                    Console.WriteLine($"Utterance folder not found: {utterancePath}");
                }
            }

            var sortedUtterances = utterances.OrderBy(u => u.TurnNumber).ToList();

            var result = sortedUtterances.Select(u => new
            {
                u.Speaker,
                FilePath = u.FilePath.Replace(_env.ContentRootPath, "").Replace("\\", "/"),
                u.TurnNumber
            });

            return Ok(result);
        }


        [HttpGet("audio")]
        public IActionResult GetAudioFile([FromQuery] string filePath)
        {
            var fullPath = Path.Combine(_env.ContentRootPath, "../test-files", filePath);

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound("Audio file not found.");
            }

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fullPath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return File(fileStream, contentType, enableRangeProcessing: true);
        }
        [HttpGet("transcript/{folder}")]
        public IActionResult GetTranscript(string folder, [FromQuery] string convParty = "Doctor - Patient")
        {
            var folderPath = Path.Combine(_env.ContentRootPath, "../test-files", folder);

            if (!Directory.Exists(folderPath))
            {
                return NotFound($"The folder '{folder}' does not exist.");
            }

            var transcriptFilePath = Directory.GetFiles(folderPath, "*-3speakers.txt").FirstOrDefault();

            if (transcriptFilePath == null)
            {
                return NotFound($"No 3speakers file found in the folder '{folder}'.");
            }

            try
            {
                var transcriptLines = System.IO.File.ReadAllLines(transcriptFilePath);
                var partyMap = new Dictionary<string, string[]>
                {
                    { "Doctor - Patient", new[] { "DOCTOR", "PATIENT" } },
                    { "Doctor - Robot - Patient", new[] { "DOCTOR", "ROBOT", "PATIENT" } },
                    { "Robot - Patient", new[] { "ROBOT", "PATIENT" } }
                };

                var filteredTranscriptLines = transcriptLines
                    .Where(line => !partyMap.ContainsKey(convParty) || partyMap[convParty].Any(party => line.Contains(party)))
                    .ToArray();

                return Ok(new { Transcript = filteredTranscriptLines });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error reading transcript file: {ex.Message}");
            }
        }
    }
}
