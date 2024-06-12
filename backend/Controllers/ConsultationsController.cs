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
        public IActionResult GetUtterances(string folder)
        {
            var folderPath = Path.Combine(_env.ContentRootPath, "../test-files", folder);

            if (!Directory.Exists(folderPath))
            {
                return NotFound($"The folder '{folder}' does not exist.");
            }

            var utteranceFolders = new[] { "utterances-doctor", "utterances-patient", "utterances-robot" };
            var utterances = new List<(string Speaker, string FilePath, double StartTime)>();

            foreach (var utteranceFolder in utteranceFolders)
            {
                var utterancePath = Path.Combine(folderPath, utteranceFolder);
                if (Directory.Exists(utterancePath))
                {
                    var files = Directory.GetFiles(utterancePath, "*.wav");
                    foreach (var file in files)
                    {
                        var fileName = Path.GetFileNameWithoutExtension(file);
                        var outputIndex = fileName.IndexOf("output-");
                        if (outputIndex != -1)
                        {
                            var startTimeStr = fileName[(outputIndex + "output-".Length)..];
                            if (double.TryParse(startTimeStr, out var startTime))
                            {
                                utterances.Add((utteranceFolder, file, startTime));
                            }
                        }
                    }
                }
            }

            var sortedUtterances = utterances.OrderBy(u => u.StartTime).ToList();
            var orderedUtterances = new List<(string Speaker, string FilePath, double StartTime)>();

            while (sortedUtterances.Any())
            {
                var doctorUtterance = sortedUtterances.FirstOrDefault(u => u.Speaker == "utterances-doctor");
                if (doctorUtterance != default)
                {
                    orderedUtterances.Add(doctorUtterance);
                    sortedUtterances.Remove(doctorUtterance);
                }

                var robotUtterance = sortedUtterances.FirstOrDefault(u => u.Speaker == "utterances-robot");
                if (robotUtterance != default)
                {
                    orderedUtterances.Add(robotUtterance);
                    sortedUtterances.Remove(robotUtterance);
                }

                var patientUtterance = sortedUtterances.FirstOrDefault(u => u.Speaker == "utterances-patient");
                if (patientUtterance != default)
                {
                    orderedUtterances.Add(patientUtterance);
                    sortedUtterances.Remove(patientUtterance);
                }
            }

            var result = orderedUtterances.Select(u => new
            {
                Speaker = u.Speaker.Replace("utterances-", ""),
                u.FilePath,
                u.StartTime
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
        public IActionResult GetTranscript(string folder)
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
                return Ok(new { Transcript = transcriptLines });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error reading transcript file: {ex.Message}");
            }
        }
    }
}
