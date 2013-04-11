using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMLight.Models
{
    public class Candidate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int Rating { get; set; }
        public string Userpic { get; set; }
        public DateTime? Created { get; set; }
    }

}