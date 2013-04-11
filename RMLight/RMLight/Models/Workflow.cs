using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMLight.Models
{
    public class Workflow
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int CandidateId { get; set; }
        public int Type { get; set; }
        public string Comment { get; set; }
        public DateTime Created { get; set; }
        public object AdditionalInfo { get; set; }
        public int AdditionalInfoType { get; set; }
    }
}