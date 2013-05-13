using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMLight.Models
{
    public class Application : StateInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }        
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime? Birthday { get; set; }
        public int Rating { get; set; }
        public string Userpic { get; set; }
        public string Source { get; set; }
        public int Status { get; set; }     // -> Status for application, like: new / refused / pending / etc...
        public int ProjectId { get; set; }
        public int CandidateId { get; set; }
    }

}