using Microsoft.AspNetCore.Mvc;
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
    }
}
