﻿using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Collections.Generic;

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

            var sortedUtterances = utterances.OrderBy(u => u.StartTime).Select(u => new
            {
                Speaker = u.Speaker.Replace("utterances-", ""),
                u.FilePath,
                u.StartTime
            });

            return Ok(sortedUtterances);
        }


    }
}
